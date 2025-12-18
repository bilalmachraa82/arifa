import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId, recipientEmail, recipientName } = await req.json();

    if (!quoteId || !recipientEmail) {
      throw new Error("Quote ID and recipient email are required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch quote
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", quoteId)
      .single();

    if (quoteError || !quote) {
      throw new Error("Quote not found");
    }

    // Build public quote URL
    const projectId = Deno.env.get("SUPABASE_PROJECT_ID") || "kiqxagkbyhdnyjngjstc";
    const appUrl = `https://${projectId}.lovable.app`;
    const quoteUrl = `${appUrl}/cotacao/${quote.public_token}`;

    const formatCurrency = (value: number) =>
      new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value);

    const formatDate = (date: string) =>
      new Date(date).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });

    // Send email
    const emailResponse = await resend.emails.send({
      from: "ARIFA Studio <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: `Proposta ${quote.quote_number} - ${quote.project_title}`,
      html: `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0D3B66 0%, #1a5a9e 100%); padding: 40px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; margin: 0 0 8px 0; font-weight: 700;">ARIFA STUDIO</h1>
              <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin: 0;">Arquitetura • Design • Construção</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 16px; color: #333; margin: 0 0 24px 0;">
                Olá${recipientName ? ` ${recipientName}` : ''},
              </p>
              
              <p style="font-size: 16px; color: #333; margin: 0 0 24px 0; line-height: 1.6;">
                É com prazer que lhe enviamos a nossa proposta para o projeto <strong>${quote.project_title}</strong>.
              </p>
              
              <!-- Quote Summary Box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <p style="font-size: 12px; color: #666; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">Referência</p>
                          <p style="font-size: 18px; color: #0D3B66; margin: 0 0 16px 0; font-weight: 600;">${quote.quote_number}</p>
                        </td>
                        <td align="right">
                          <p style="font-size: 12px; color: #666; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 1px;">Valor Total</p>
                          <p style="font-size: 24px; color: #0D3B66; margin: 0; font-weight: 700;">${formatCurrency(quote.total)}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <hr style="border: none; border-top: 1px solid #e9ecef; margin: 16px 0;">
                    
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td>
                          <p style="font-size: 13px; color: #666; margin: 0;">
                            📍 ${quote.project_location || 'Localização a definir'}
                          </p>
                        </td>
                        <td align="right">
                          <p style="font-size: 13px; color: #666; margin: 0;">
                            ⏰ Válida até ${formatDate(quote.valid_until)}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="padding: 16px 0 32px 0;">
                    <a href="${quoteUrl}" style="display: inline-block; background: linear-gradient(135deg, #0D3B66 0%, #1a5a9e 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                      Ver Proposta Completa
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="font-size: 14px; color: #666; margin: 0 0 16px 0; line-height: 1.6;">
                Na proposta poderá consultar todos os detalhes, incluindo o descritivo completo dos trabalhos, condições de pagamento e termos.
              </p>
              
              <p style="font-size: 14px; color: #666; margin: 0; line-height: 1.6;">
                Se tiver alguma questão ou pretender agendar uma reunião para discutir a proposta, não hesite em contactar-nos.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 24px 40px; border-top: 1px solid #e9ecef;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <p style="font-size: 14px; color: #0D3B66; margin: 0 0 4px 0; font-weight: 600;">ARIFA Studio</p>
                    <p style="font-size: 13px; color: #666; margin: 0;">Arquitetura de Excelência</p>
                  </td>
                  <td align="right">
                    <p style="font-size: 13px; color: #666; margin: 0;">info@arifa.pt</p>
                    <p style="font-size: 13px; color: #666; margin: 0;">+351 XXX XXX XXX</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
        
        <!-- Email footer -->
        <p style="font-size: 12px; color: #999; margin-top: 24px; text-align: center;">
          Este email foi enviado automaticamente. Por favor não responda diretamente a este email.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    console.log("Quote email sent:", emailResponse);

    // Update quote status to sent
    await supabase
      .from("quotes")
      .update({ 
        status: "sent",
        sent_at: new Date().toISOString()
      })
      .eq("id", quoteId);

    // Log event
    await supabase
      .from("quote_events")
      .insert({
        quote_id: quoteId,
        event_type: "sent",
        metadata: { recipient_email: recipientEmail }
      });

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending quote email:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
