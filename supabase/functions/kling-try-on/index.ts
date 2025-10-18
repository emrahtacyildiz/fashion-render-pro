import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  modelImageUrl: string;
  productImageUrl: string;
  garmentType: 'dress' | 'upper' | 'lower';
  batchSize?: number;
}

interface KlingResponse {
  code: number;
  message: string;
  data?: {
    task_id: string;
    task_status: string;
  };
}

interface KlingTaskResult {
  code: number;
  message: string;
  data?: {
    task_id: string;
    task_status: string;
    task_result?: {
      images?: Array<{
        url: string;
      }>;
    };
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const KLING_API_KEY = Deno.env.get("KLING_API_KEY");
    if (!KLING_API_KEY) {
      throw new Error("KLING_API_KEY is not configured");
    }

    const { modelImageUrl, productImageUrl, garmentType, batchSize = 1 }: RequestBody = await req.json();

    if (!modelImageUrl || !productImageUrl) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const requestBody: any = {
      model: "kling",
      task_type: "ai_try_on",
      input: {
        model_input: modelImageUrl,
        batch_size: batchSize,
      },
    };

    if (garmentType === 'dress') {
      requestBody.input.dress_input = productImageUrl;
    } else if (garmentType === 'upper') {
      requestBody.input.upper_input = productImageUrl;
    } else if (garmentType === 'lower') {
      requestBody.input.lower_input = productImageUrl;
    }

    console.log("Sending request to Kling API...");
    const klingResponse = await fetch("https://api.piapi.ai/api/kling/v1/images/generations", {
      method: "POST",
      headers: {
        "x-api-key": KLING_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!klingResponse.ok) {
      const errorText = await klingResponse.text();
      console.error("Kling API error:", errorText);
      throw new Error(`Kling API error: ${klingResponse.status} - ${errorText}`);
    }

    const klingData: KlingResponse = await klingResponse.json();
    console.log("Kling API response:", klingData);

    if (klingData.code !== 200 || !klingData.data?.task_id) {
      throw new Error(klingData.message || "Failed to create task");
    }

    const taskId = klingData.data.task_id;
    console.log("Task created with ID:", taskId);

    let taskResult: KlingTaskResult | null = null;
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      console.log(`Checking task status (attempt ${attempts + 1})...`);
      const statusResponse = await fetch(`https://api.piapi.ai/api/kling/v1/images/generations/${taskId}`, {
        method: "GET",
        headers: {
          "x-api-key": KLING_API_KEY,
        },
      });

      if (!statusResponse.ok) {
        console.error("Status check failed:", statusResponse.status);
        attempts++;
        continue;
      }

      const statusData: KlingTaskResult = await statusResponse.json();
      console.log("Task status:", statusData.data?.task_status);

      if (statusData.data?.task_status === "succeed" && statusData.data?.task_result?.images) {
        taskResult = statusData;
        break;
      }

      if (statusData.data?.task_status === "failed") {
        throw new Error("Task processing failed");
      }

      attempts++;
    }

    if (!taskResult?.data?.task_result?.images || taskResult.data.task_result.images.length === 0) {
      throw new Error("Timeout waiting for task completion or no images generated");
    }

    const imageUrls = taskResult.data.task_result.images.map(img => img.url);
    console.log("Generated images:", imageUrls);

    return new Response(
      JSON.stringify({ 
        success: true,
        imageUrls,
        taskId 
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in kling-try-on function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});