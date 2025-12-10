import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  segment: string;
  service: string;
  message: string;
}

const segmentLabels: Record<string, string> = {
  privado: "Cliente Privado",
  empresa: "Empresa",
  investidor: "Investidor",
};

const serviceLabels: Record<string, string> = {
  consultoria: "Consultoria Estratégica e Viabilidade",
  design: "Design Arquitetónico e Técnico",
  bim: "Modelação e Coordenação BIM",
  simulacoes: "Análise Preditiva e Simulações",
  construcao: "Gestão de Construção",
  sustentabilidade: "Eficiência e Sustentabilidade",
  outro: "Outro",
};

async function sendEmail(apiKey: string, from: string, to: string[], subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Resend API error: ${error}`);
  }
  
  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-contact-email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  
  if (!RESEND_API_KEY) {
    console.log("RESEND_API_KEY not configured - skipping email send");
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Email service not configured. Lead was saved to database." 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }

  try {
    const { name, email, phone, segment, service, message }: ContactEmailRequest = await req.json();

    console.log("Sending contact email for:", email);

    // Send confirmation email to client
    const clientEmailResponse = await sendEmail(
      RESEND_API_KEY,
      "ARIFA Studio <onboarding@resend.dev>",
      [email],
      "Recebemos a sua mensagem - ARIFA Studio",
      `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: 600; color: #1a1a1a; }
            .content { background: #f8f7f4; padding: 30px; border-radius: 4px; }
            h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 400; font-size: 28px; margin-bottom: 20px; }
            .highlight { color: #3d9a8b; }
            .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">ARIFA Studio</div>
            </div>
            <div class="content">
              <h1>Olá ${name},</h1>
              <p>Obrigado por entrar em contacto connosco!</p>
              <p>Recebemos a sua mensagem e iremos analisá-la com atenção. A nossa equipa entrará em contacto consigo <span class="highlight">nas próximas 24 horas</span>.</p>
              <p>Enquanto isso, pode explorar o nosso <a href="https://www.arifa.studio/portfolio" style="color: #3d9a8b;">portfolio</a> ou conhecer melhor os nossos <a href="https://www.arifa.studio" style="color: #3d9a8b;">serviços</a>.</p>
              <p>Cumprimentos,<br><strong>Equipa ARIFA Studio</strong></p>
            </div>
            <div class="footer">
              <p>Avenida de Berna, 31, 2º Dto, sala 9 | 1050-038 Lisboa</p>
              <p>+351 928 272 198 | info@arifa.studio</p>
            </div>
          </div>
        </body>
        </html>
      `
    );

    console.log("Client email sent:", clientEmailResponse);

    // Send notification email to ARIFA Studio
    const notificationEmailResponse = await sendEmail(
      RESEND_API_KEY,
      "Website ARIFA <onboarding@resend.dev>",
      ["info@arifa.studio"],
      `Novo contacto: ${name} - ${segmentLabels[segment] || segment}`,
      `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1a1a1a; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 400; font-size: 24px; }
            .info-box { background: #f8f7f4; padding: 20px; border-radius: 4px; margin: 20px 0; }
            .label { font-weight: 600; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { font-size: 16px; margin-bottom: 15px; }
            .message-box { background: #fff; border: 1px solid #e5e5e5; padding: 20px; border-radius: 4px; margin-top: 20px; }
            .highlight { color: #3d9a8b; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Novo contacto do website</h1>
            <div class="info-box">
              <div class="label">Nome</div>
              <div class="value">${name}</div>
              
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${email}" style="color: #3d9a8b;">${email}</a></div>
              
              ${phone ? `<div class="label">Telefone</div><div class="value"><a href="tel:${phone}" style="color: #3d9a8b;">${phone}</a></div>` : ''}
              
              <div class="label">Segmento</div>
              <div class="value highlight">${segmentLabels[segment] || segment}</div>
              
              <div class="label">Serviço Pretendido</div>
              <div class="value">${serviceLabels[service] || service}</div>
            </div>
            
            <div class="label">Mensagem</div>
            <div class="message-box">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </body>
        </html>
      `
    );

    console.log("Notification email sent:", notificationEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        clientEmail: clientEmailResponse,
        notificationEmail: notificationEmailResponse 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-contact-email function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
