import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DaluxSyncRequest {
  projectId: string;
  syncType?: "documents" | "models" | "all";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DALUX_API_URL = Deno.env.get("DALUX_API_URL");
    const DALUX_API_KEY = Deno.env.get("DALUX_API_KEY");

    if (!DALUX_API_URL || !DALUX_API_KEY) {
      console.log("DALUX credentials not configured - returning info");
      return new Response(
        JSON.stringify({
          success: true,
          message: "DALUX integration ready. Configure DALUX_API_URL and DALUX_API_KEY to enable sync.",
          configured: false,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { projectId, syncType = "all" }: DaluxSyncRequest = await req.json();

    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "projectId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let documentsCount = 0;
    let modelsCount = 0;

    // Sync documents from DALUX
    if (syncType === "documents" || syncType === "all") {
      try {
        const daluxResponse = await fetch(
          `${DALUX_API_URL}/api/v1/projects/${projectId}/documents`,
          {
            headers: {
              Authorization: `Bearer ${DALUX_API_KEY}`,
              Accept: "application/json",
            },
          }
        );

        if (daluxResponse.ok) {
          const docs = await daluxResponse.json();

          for (const doc of docs.data || []) {
            const { error } = await supabase
              .from("dalux_documents")
              .upsert(
                {
                  project_id: projectId,
                  external_id: String(doc.id),
                  title: doc.name || doc.title,
                  description: doc.description || null,
                  document_type: doc.type || "plan",
                  file_url: doc.file_url || doc.download_url || null,
                  thumbnail_url: doc.thumbnail_url || null,
                  version: doc.version || "1.0",
                  phase: doc.phase || null,
                  raw_data: doc,
                  synced_at: new Date().toISOString(),
                },
                { onConflict: "external_id" }
              );

            if (!error) documentsCount++;
          }
        }
      } catch (err) {
        console.error("Error syncing DALUX documents:", err);
      }
    }

    // Sync 3D/BIM models from DALUX
    if (syncType === "models" || syncType === "all") {
      try {
        const daluxResponse = await fetch(
          `${DALUX_API_URL}/api/v1/projects/${projectId}/models`,
          {
            headers: {
              Authorization: `Bearer ${DALUX_API_KEY}`,
              Accept: "application/json",
            },
          }
        );

        if (daluxResponse.ok) {
          const models = await daluxResponse.json();

          for (const model of models.data || []) {
            const { error } = await supabase
              .from("dalux_models")
              .upsert(
                {
                  project_id: projectId,
                  external_id: String(model.id),
                  name: model.name || model.title,
                  description: model.description || null,
                  model_type: model.format || "ifc",
                  file_url: model.file_url || model.download_url || null,
                  viewer_url: model.viewer_url || model.web_viewer || null,
                  thumbnail_url: model.thumbnail_url || null,
                  file_size: model.file_size || null,
                  raw_data: model,
                  synced_at: new Date().toISOString(),
                },
                { onConflict: "external_id" }
              );

            if (!error) modelsCount++;
          }
        }
      } catch (err) {
        console.error("Error syncing DALUX models:", err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        configured: true,
        synced: {
          documents: documentsCount,
          models: modelsCount,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in dalux-sync:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
