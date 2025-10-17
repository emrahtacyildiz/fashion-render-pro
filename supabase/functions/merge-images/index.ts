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
    
    console.log('Merge images request:', { productImageUrl, modelImageUrl, category });

    if (!productImageUrl || !modelImageUrl) {
      throw new Error('Both product and model images are required');
    }

    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY');
    if (!GOOGLE_API_KEY) {
      throw new Error('GOOGLE_GEMINI_API_KEY is not configured');
    }

    // Fetch both images and convert to base64
    const [productResponse, modelResponse] = await Promise.all([
      fetch(productImageUrl),
      fetch(modelImageUrl)
    ]);

    const [productBlob, modelBlob] = await Promise.all([
      productResponse.blob(),
      modelResponse.blob()
    ]);

    const [productBase64, modelBase64] = await Promise.all([
      blobToBase64(productBlob),
      blobToBase64(modelBlob)
    ]);

    // Create category-specific prompt for better results
    const categoryPrompts: Record<string, string> = {
      'clothing': 'Seamlessly place and fit the clothing item from the first image onto the model in the second image. The clothing should naturally conform to the model\'s body shape, with realistic folds, shadows, and lighting that matches the studio environment. Preserve the exact colors, patterns, and textures of the product. The final result should look like a professional fashion photography shoot where the model is actually wearing the garment.',
      'jewelry': 'Elegantly place the jewelry piece from the first image onto the model in the second image. The jewelry should appear naturally worn, with realistic reflections, shadows, and lighting that enhances its luxury appeal. For necklaces, ensure proper positioning on the neck/chest. For earrings, place them on the ears. For rings/bracelets, position on hands/wrists. Maintain the jewelry\'s sparkle, materials, and fine details while making it look professionally photographed on the model.',
      'tech': 'Naturally integrate the technology product from the first image with the model in the second image. The device should appear as if the model is holding, using, or displaying it in a realistic manner. Pay attention to proper hand positioning, device orientation, and natural interaction. The lighting should highlight both the product features and create a lifestyle photography aesthetic. Maintain all product details, screen clarity, and brand elements.',
      'beauty': 'Artfully apply or position the beauty/cosmetic product from the first image in relation to the model in the second image. For makeup products, show realistic application on the model\'s face with natural blending and color accuracy. For skincare, show the product being held elegantly or applied naturally. The result should have the polished look of professional beauty advertising photography, with perfect lighting that highlights both the model\'s features and the product\'s attributes.'
    };

    const prompt = categoryPrompts[category] || categoryPrompts['clothing'];

    console.log('Calling Gemini Nano Banana with prompt:', prompt);

    // Call Gemini Nano Banana (image editing model)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: productBlob.type,
                  data: productBase64
                }
              },
              {
                inline_data: {
                  mime_type: modelBlob.type,
                  data: modelBase64
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Gemini response received');

    // Check if we got image data in the response
    if (result.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
      const generatedImageData = result.candidates[0].content.parts[0].inlineData.data;
      const mimeType = result.candidates[0].content.parts[0].inlineData.mimeType;
      
      // Convert base64 to blob for upload
      const imageBlob = base64ToBlob(generatedImageData, mimeType);
      
      // Upload to Supabase Storage
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const fileName = `merged-${Date.now()}.${mimeType.split('/')[1]}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(fileName, imageBlob, {
          contentType: mimeType,
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
    } else {
      console.error('No image data in response:', result);
      throw new Error('No image generated by Gemini');
    }

  } catch (error) {
    console.error('Error in merge-images function:', error);
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

// Helper functions
async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
