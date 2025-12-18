import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OptimizeImageRequest {
  imageUrl: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, maxWidth = 1920, maxHeight = 1080, quality = 85 }: OptimizeImageRequest = await req.json();

    if (!imageUrl) {
      throw new Error("Image URL is required");
    }

    console.log(`Optimizing image: ${imageUrl} (max: ${maxWidth}x${maxHeight}, quality: ${quality}%)`);

    // Fetch the original image
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
    const imageBlob = await imageResponse.blob();

    // For now, return metadata about the image since Deno doesn't have sharp
    // In production, you could use a service like Cloudflare Images, imgproxy, or similar
    const originalSize = imageBlob.size;

    // Create Supabase client for storage
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate optimized filename
    const timestamp = Date.now();
    const optimizedPath = `optimized/${timestamp}_${maxWidth}x${maxHeight}.jpg`;

    // For basic optimization without sharp, we can use image compression APIs
    // or just pass through the image with metadata
    const result = {
      originalUrl: imageUrl,
      originalSize,
      contentType,
      maxWidth,
      maxHeight,
      quality,
      message: "Image metadata processed. For full optimization, consider using Cloudflare Images or imgproxy.",
      optimized: false,
    };

    // If the image is small enough, mark as optimized
    if (originalSize < 500 * 1024) {
      result.optimized = true;
      result.message = "Image is already optimized (under 500KB).";
    }

    console.log("Image optimization result:", result);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in optimize-image function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        optimized: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
