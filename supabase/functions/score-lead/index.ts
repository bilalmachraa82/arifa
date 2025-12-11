import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { leadId } = await req.json();
    
    if (!leadId) {
      return new Response(
        JSON.stringify({ error: 'leadId é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY não configurada');
      return new Response(
        JSON.stringify({ error: 'API key não configurada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch lead data
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      console.error('Erro ao buscar lead:', leadError);
      return new Response(
        JSON.stringify({ error: 'Lead não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `És um especialista em qualificação de leads para um estúdio de arquitetura premium.
Analisa os dados do lead e atribui uma pontuação de 1 a 100 baseada em:
- Segmento (investidores=alto, empresas=médio-alto, privados=médio)
- Clareza e detalhe da mensagem (mais detalhes=mais interesse)
- Tipo de serviço solicitado
- Urgência implícita na mensagem
- Profissionalismo da comunicação

Responde APENAS em JSON válido com este formato exato:
{"score": número entre 1-100, "reason": "explicação breve em português"}`;

    const leadContext = `
Nome: ${lead.name}
Email: ${lead.email}
Telefone: ${lead.phone || 'Não fornecido'}
Segmento: ${lead.segment || 'Não especificado'}
Serviço: ${lead.service || 'Não especificado'}
Mensagem: ${lead.message}
Fonte: ${lead.source || 'website'}
`;

    console.log('Classificando lead:', lead.name);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Classifica este lead:\n${leadContext}` }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da AI Gateway:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente mais tarde.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos esgotados. Adicione créditos à sua conta.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Erro ao classificar lead' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error('Resposta da AI sem conteúdo:', data);
      return new Response(
        JSON.stringify({ error: 'Resposta da AI inválida' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse AI response
    let scoreData;
    try {
      // Clean the response (remove markdown code blocks if present)
      const cleanedResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      scoreData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Erro ao fazer parse da resposta AI:', aiResponse);
      return new Response(
        JSON.stringify({ error: 'Formato de resposta inválido' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const score = Math.min(100, Math.max(1, parseInt(scoreData.score) || 50));
    const reason = scoreData.reason || 'Classificação automática';

    // Update lead with AI score
    const { error: updateError } = await supabase
      .from('leads')
      .update({
        ai_score: score,
        ai_score_reason: reason,
        ai_scored_at: new Date().toISOString()
      })
      .eq('id', leadId);

    if (updateError) {
      console.error('Erro ao atualizar lead:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erro ao guardar pontuação' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Lead classificado com sucesso:', lead.name, 'Score:', score);

    return new Response(
      JSON.stringify({ 
        leadId,
        score,
        reason,
        scoredAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na função score-lead:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
