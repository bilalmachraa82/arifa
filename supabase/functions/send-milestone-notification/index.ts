import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const phaseNames: Record<string, string> = {
  study: "Estudo",
  design: "Projeto",
  construction: "Construção",
  finishing: "Finalização",
  delivery: "Entrega",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.json();
    console.log("Received notification request:", body);

    if (body.type === "completed" && body.milestoneId) {
      // Get milestone
      const { data: milestoneData } = await supabase
        .from("project_milestones")
        .select("id, name, phase, project_id")
        .eq("id", body.milestoneId)
        .maybeSingle();

      if (!milestoneData) {
        return new Response(JSON.stringify({ error: "Milestone not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Get project
      const { data: projectData } = await supabase
        .from("projects")
        .select("title, client_id")
        .eq("id", milestoneData.project_id)
        .maybeSingle();

      if (!projectData?.client_id) {
        return new Response(JSON.stringify({ message: "No client assigned" }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      // Get client email
      const { data: profileData } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", projectData.client_id)
        .maybeSingle();

      if (!profileData?.email) {
        return new Response(JSON.stringify({ message: "No client email" }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const phaseName = phaseNames[milestoneData.phase] || milestoneData.phase;

      await resend.emails.send({
        from: "Arifa Studio <notificacoes@resend.dev>",
        to: [profileData.email],
        subject: `✅ Milestone Concluído: ${milestoneData.name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #166534;">🎉 Milestone Concluído!</h1>
            <p>Olá ${profileData.full_name || "Cliente"},</p>
            <p>O milestone <strong>${milestoneData.name}</strong> (${phaseName}) do projeto <strong>${projectData.title}</strong> foi concluído.</p>
            <p>Arifa Studio</p>
          </div>
        `,
      });

      console.log("Email sent successfully");
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
