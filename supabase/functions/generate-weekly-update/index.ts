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
    const { projectId, language = 'pt' } = await req.json();
    
    if (!projectId) {
      return new Response(
        JSON.stringify({ error: 'projectId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch project data
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      console.error('Error fetching project:', projectError);
      return new Response(
        JSON.stringify({ error: 'Project not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch recent documents
    const { data: documents } = await supabase
      .from('client_documents')
      .select('title, created_at, current_version')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch recent messages
    const { data: messages } = await supabase
      .from('client_messages')
      .select('subject, created_at')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(5);

    // AI prompt content stays in PT for user-facing output
    const systemPrompt = language === 'pt' 
      ? `És um assistente de arquitetura profissional. Gera um resumo semanal conciso e informativo sobre o progresso de um projeto de arquitetura. 
         O tom deve ser profissional mas acessível, focando em conquistas e próximos passos.
         Formata o texto com parágrafos claros. Máximo 200 palavras.`
      : `You are a professional architecture assistant. Generate a concise and informative weekly summary about an architecture project's progress.
         The tone should be professional but accessible, focusing on achievements and next steps.
         Format with clear paragraphs. Maximum 200 words.`;

    const projectContext = `
Projeto: ${project.title}
Estado atual: ${project.status || 'Em desenvolvimento'}
Categoria: ${project.category}
Segmento: ${project.segment || 'Não especificado'}
Localização: ${project.location || 'Não especificada'}
Área: ${project.area || 'Não especificada'}
Descrição: ${project.description || 'Sem descrição'}

Documentos recentes (últimos 5):
${documents?.map(d => `- ${d.title} (v${d.current_version})`).join('\n') || 'Nenhum documento recente'}

Comunicações recentes (últimas 5):
${messages?.map(m => `- ${m.subject}`).join('\n') || 'Nenhuma mensagem recente'}
`;

    const userPrompt = language === 'pt'
      ? `Gera um resumo semanal para o cliente sobre este projeto de arquitetura:\n\n${projectContext}`
      : `Generate a weekly summary for the client about this architecture project:\n\n${projectContext}`;

    console.log('Generating weekly update for project:', project.title);

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
          { role: 'user', content: userPrompt }
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
          JSON.stringify({ error: 'Credits exhausted. Add credits to your account.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Error generating summary' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content;

    if (!summary) {
      console.error('Empty AI response:', data);
      return new Response(
        JSON.stringify({ error: 'Invalid AI response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Weekly update generated successfully for:', project.title);

    return new Response(
      JSON.stringify({ 
        summary,
        project: {
          id: project.id,
          title: project.title,
          status: project.status
        },
        generatedAt: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-weekly-update function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
