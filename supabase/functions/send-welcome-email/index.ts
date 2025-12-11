import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  name: string;
  email: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: WelcomeEmailRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating welcome email for ${name} (${email})`);

    // Generate personalized welcome email content using Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Você é o assistente de comunicação da ARIFA Studio, uma empresa de arquitetura portuguesa de luxo. 
Gere emails profissionais, acolhedores e elegantes em português de Portugal.
O tom deve ser caloroso mas profissional, refletindo a excelência e atenção ao detalhe da marca.
Responda APENAS com o conteúdo HTML do email, sem markdown, sem explicações.`
          },
          {
            role: "user",
            content: `Cria um email de boas-vindas para um novo cliente chamado "${name}".

O email deve:
1. Dar as boas-vindas calorosas à família ARIFA Studio
2. Explicar brevemente que agora têm acesso ao Portal de Cliente exclusivo
3. Mencionar que podem acompanhar o progresso dos seus projetos, comunicar com a equipa e aceder a documentos
4. Incluir um convite para explorar o portal
5. Assinar como "Equipa ARIFA Studio"

Gera o HTML do email com estilos inline elegantes (cores: #1a1a1a para texto, #b8860b para destaques dourados, fundo branco).
Máximo 200 palavras.`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error("Rate limit exceeded, please try again later");
      }
      if (aiResponse.status === 402) {
        throw new Error("Payment required, please add funds");
      }
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    const generatedEmailContent = aiData.choices?.[0]?.message?.content || "";

    console.log("Generated email content successfully");

    // For now, we'll return the generated content
    // In production, this would integrate with Resend to send the email
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (RESEND_API_KEY) {
      // Send email via Resend
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "ARIFA Studio <onboarding@resend.dev>",
          to: [email],
          subject: `Bem-vindo à ARIFA Studio, ${name}!`,
          html: generatedEmailContent,
        }),
      });

      if (!resendResponse.ok) {
        const resendError = await resendResponse.text();
        console.error("Resend error:", resendError);
        // Don't throw - email sending is non-critical
      } else {
        console.log("Welcome email sent successfully via Resend");
      }
    } else {
      console.log("RESEND_API_KEY not configured - email content generated but not sent");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Welcome email processed",
        emailGenerated: true,
        emailSent: !!RESEND_API_KEY
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
