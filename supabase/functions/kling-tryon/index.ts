import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productImageUrl, modelImageUrl, category } = await req.json();
    
    console.log('Kling Try-On request:', { productImageUrl, modelImageUrl, category });

    if (!productImageUrl || !modelImageUrl) {
      throw new Error('Both product and model images are required');
    }

    const PIAPI_API_KEY = Deno.env.get('PIAPI_API_KEY');
    if (!PIAPI_API_KEY) {
      throw new Error('PIAPI_API_KEY is not configured');
    }

    // Determine which input parameter to use based on category
    const inputParams: any = {
      model_input: modelImageUrl,
      batch_size: 1
    };

    // For clothing, we can be more specific
    if (category === 'clothing') {
      // Use dress_input for full-body garments
      inputParams.dress_input = productImageUrl;
    } else {
      // For other categories (jewelry, tech, beauty), use dress_input
      inputParams.dress_input = productImageUrl;
    }

    console.log('Calling Kling API with params:', inputParams);

    // Call Kling Virtual Try-On API
    const response = await fetch('https://api.piapi.ai/api/v1/task', {
      method: 'POST',
      headers: {
        'x-api-key': PIAPI_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'kling',
        task_type: 'ai_try_on',
        input: inputParams
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Kling API error:', response.status, errorText);
      throw new Error(`Kling API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Kling API response:', result);

    // The API returns a task that we need to poll for results
    // For now, we'll return the task info
    if (!result.data?.taskId) {
      throw new Error('No task ID received from Kling API');
    }

    // Poll for task completion
    const taskId = result.data.taskId;
    let attempts = 0;
    const maxAttempts = 60; // 60 attempts * 2 seconds = 2 minutes max
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
      const statusResponse = await fetch(`https://api.piapi.ai/api/v1/task/${taskId}`, {
        headers: {
          'x-api-key': PIAPI_API_KEY,
        },
      });

      if (!statusResponse.ok) {
        console.error('Status check failed:', statusResponse.status);
        attempts++;
        continue;
      }

      const statusResult = await statusResponse.json();
      console.log('Task status:', statusResult);

      if (statusResult.data?.status === 'completed' && statusResult.data?.output?.images?.[0]) {
        const imageUrl = statusResult.data.output.images[0];
        
        // Download the image and upload to Supabase Storage
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const fileName = `generated-${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('generated-images')
          .upload(fileName, imageBlob, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('generated-images')
          .getPublicUrl(fileName);

        console.log('Image uploaded successfully:', publicUrl);

        return new Response(
          JSON.stringify({ 
            success: true, 
            imageUrl: publicUrl 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else if (statusResult.data?.status === 'failed') {
        throw new Error('Image generation failed');
      }
      
      attempts++;
    }

    throw new Error('Image generation timed out');

  } catch (error) {
    console.error('Error in kling-tryon function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
