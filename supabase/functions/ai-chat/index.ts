import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  context?: 'public' | 'client';
  projectId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, context = 'public', projectId }: ChatRequest = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build context-aware system prompt (PT content for end-user interaction)
    let systemPrompt = `Você é o assistente virtual da ARIFA Studio, uma empresa portuguesa de arquitetura de luxo sediada em Lisboa.

PERSONALIDADE:
- Profissional, acolhedor e elegante
- Conhecedor de arquitetura e design de interiores
- Responde sempre em português de Portugal
- Tom sofisticado mas acessível

SERVIÇOS DA ARIFA STUDIO:
- Projetos de Arquitetura residencial e comercial
- Design de Interiores personalizado
- Modelação BIM (Building Information Modeling)
- Acompanhamento de obra
- Consultoria em investimento imobiliário

SEGMENTOS:
- Privados: Habitações unifamiliares, apartamentos, remodelações
- Empresas: Escritórios, lojas, hotéis, restaurantes
- Investidores: Projetos de rentabilização, estudos de viabilidade

INFORMAÇÕES DE CONTACTO:
- Website: arifa.studio
- Localização: Lisboa, Portugal
- Disponível de segunda a sexta, 9h-18h

REGRAS:
1. Seja conciso mas informativo (máximo 150 palavras por resposta)
2. Encoraje sempre o contacto para discussões mais aprofundadas
3. Não invente informações sobre projetos específicos
4. Sugira agendar uma consulta para questões complexas
5. Mantenha o foco em arquitetura e serviços relacionados`;

    // Add client-specific context
    if (context === 'client' && projectId) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data: project } = await supabase
        .from('projects')
        .select('title, status, category, description, location')
        .eq('id', projectId)
        .single();

      if (project) {
        systemPrompt += `

CONTEXTO DO CLIENTE:
Está a falar com um cliente que tem um projeto ativo:
- Projeto: ${project.title}
- Estado: ${project.status || 'Em desenvolvimento'}
- Categoria: ${project.category}
- Localização: ${project.location || 'Não especificada'}

Pode responder a questões sobre o processo, fases do projeto, e próximos passos.
Para questões específicas sobre prazos ou valores, sugira contactar o gestor de projeto.`;
      }
    }

    console.log(`AI Chat request - Context: ${context}, Messages: ${messages.length}`);

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
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Credits exhausted.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Error processing message' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      console.error('Empty AI response:', data);
      return new Response(
        JSON.stringify({ error: 'Empty assistant response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('AI Chat response generated successfully');

    return new Response(
      JSON.stringify({
        reply,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
