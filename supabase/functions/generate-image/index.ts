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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { projectId, productImageUrl, modelId, styleId, prompt } = await req.json();

    // Check user credits
    const { data: credits, error: creditsError } = await supabase
      .from('credits')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (creditsError || !credits || credits.balance < 1) {
      return new Response(
        JSON.stringify({ error: 'Yetersiz kredi. Lütfen kredi satın alın.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build AI prompt
    const modelDescriptions: Record<string, string> = {
      'model-1': 'genç kadın model',
      'model-2': 'genç erkek model',
      'model-3': 'orta yaşlı kadın model',
      'model-4': 'orta yaşlı erkek model',
    };

    const styleDescriptions: Record<string, string> = {
      'studio': 'profesyonel stüdyo çekimi, beyaz arka plan, yumuşak ışıklandırma',
      'street': 'sokak stili, doğal ışık, şehir arka planı',
      'minimal': 'minimalist arka plan, sade ve temiz kompozisyon',
      'lifestyle': 'yaşam tarzı çekimi, doğal ortam',
    };

    const finalPrompt = `Ürün fotoğrafını ${modelDescriptions[modelId] || 'model'} üzerinde gösteren profesyonel ürün fotoğrafı. ${styleDescriptions[styleId] || 'Profesyonel fotoğraf'}. ${prompt || ''} Ürün detayları net görünmeli, model doğal ve gerçekçi olmalı. Yüksek kalite, profesyonel e-ticaret görseli.`;

    console.log('Generating image with prompt:', finalPrompt);

    // Call Lovable AI image generation
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: finalPrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const imageBase64 = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageBase64) {
      throw new Error('No image generated');
    }

    // Convert base64 to blob
    const base64Data = imageBase64.split(',')[1];
    const imageBlob = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Upload to storage
    const fileName = `${user.id}/${projectId}_${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('generated-images')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('generated-images')
      .getPublicUrl(fileName);

    // Save to database
    const { error: insertError } = await supabase
      .from('generated_images')
      .insert({
        project_id: projectId,
        image_url: publicUrl
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

    // Update project status
    await supabase
      .from('projects')
      .update({ status: 'completed' })
      .eq('id', projectId);

    // Deduct credit
    await supabase
      .from('credits')
      .update({ balance: credits.balance - 1 })
      .eq('user_id', user.id);

    return new Response(
      JSON.stringify({ imageUrl: publicUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});