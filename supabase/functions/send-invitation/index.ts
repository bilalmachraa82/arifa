import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  name: string;
  invitedBy: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          error: "Email service not configured",
          message: "RESEND_API_KEY não está configurado. Configure nas definições do projeto.",
          code: "RESEND_NOT_CONFIGURED"
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, name, invitedBy }: InvitationRequest = await req.json();

    console.log(`Creating invitation for ${email} (${name})`);

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabase
      .from("client_invitations")
      .insert({
        email,
        name,
        invited_by: invitedBy,
        status: "pending",
      })
      .select()
      .single();

    if (inviteError) {
      console.error("Error creating invitation:", inviteError);
      throw new Error(`Failed to create invitation: ${inviteError.message}`);
    }

    console.log("Invitation created:", invitation.id);

    // Build invitation link
    const baseUrl = Deno.env.get("SITE_URL") || "https://kiqxagkbyhdnyjngjstc.lovableproject.com";
    const invitationLink = `${baseUrl}/convite/${invitation.token}`;

    // Send email via Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "ARIFA Studio <onboarding@resend.dev>",
        to: [email],
        subject: "Bem-vindo à ARIFA Studio - Convite para Portal de Cliente",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px;">
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #1a1a1a; font-size: 28px; margin: 0;">ARIFA Studio</h1>
                <p style="color: #666; font-size: 14px; margin-top: 8px;">Arquitetura de Excelência</p>
              </div>
              
              <h2 style="color: #1a1a1a; font-size: 22px; margin-bottom: 20px;">
                Olá ${name},
              </h2>
              
              <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Foi convidado(a) para aceder ao <strong>Portal de Cliente</strong> da ARIFA Studio, 
                onde poderá acompanhar os seus projetos, documentos e comunicar diretamente connosco.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${invitationLink}" 
                   style="display: inline-block; background-color: #1a1a1a; color: #ffffff; 
                          text-decoration: none; padding: 16px 40px; border-radius: 8px; 
                          font-size: 16px; font-weight: 600;">
                  Ativar Conta
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6;">
                Este convite expira em <strong>7 dias</strong>. Se não conseguir clicar no botão, 
                copie e cole o seguinte link no seu navegador:
              </p>
              
              <p style="color: #1a1a1a; font-size: 12px; word-break: break-all; 
                        background-color: #f5f5f5; padding: 12px; border-radius: 4px;">
                ${invitationLink}
              </p>
              
              <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0;">
              
              <p style="color: #999; font-size: 12px; text-align: center;">
                © ${new Date().getFullYear()} ARIFA Studio. Todos os direitos reservados.
              </p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error("Error sending email:", errorData);
      
      // Update invitation status to indicate email failed
      await supabase
        .from("client_invitations")
        .update({ status: "pending" })
        .eq("id", invitation.id);
      
      throw new Error(`Failed to send email: ${errorData}`);
    }

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        invitation: { 
          id: invitation.id, 
          email: invitation.email,
          token: invitation.token 
        } 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
