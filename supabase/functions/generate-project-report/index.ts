import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId } = await req.json();
    
    if (!projectId) {
      throw new Error("Project ID is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch project with all related data
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select(`
        *,
        profiles:client_id (full_name, email, phone, company)
      `)
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      throw new Error("Project not found");
    }

    // Fetch milestones
    const { data: milestones } = await supabase
      .from("project_milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order");

    // Fetch budget
    const { data: budget } = await supabase
      .from("project_budgets")
      .select("*")
      .eq("project_id", projectId)
      .single();

    // Fetch documents
    const { data: documents } = await supabase
      .from("client_documents")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(10);

    // Fetch photos
    const { data: photos } = await supabase
      .from("project_photos")
      .select("*")
      .eq("project_id", projectId)
      .eq("is_featured", true)
      .order("sort_order")
      .limit(6);

    // Generate HTML for PDF
    const html = generateProjectReportHTML(
      project,
      milestones || [],
      budget,
      documents || [],
      photos || []
    );

    console.log("Project Report HTML generated for:", project.title);

    return new Response(
      JSON.stringify({ 
        success: true, 
        html,
        projectTitle: project.title 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating project report:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateProjectReportHTML(
  project: any,
  milestones: any[],
  budget: any,
  documents: any[],
  photos: any[]
): string {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value || 0);

  const formatDate = (date: string) => 
    date ? new Date(date).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" }) : "N/A";

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      "em_estudo": "Em Estudo",
      "em_construcao": "Em Construção",
      "concluido": "Concluído",
    };
    return labels[status] || status;
  };

  const getPhaseLabel = (phase: string) => {
    const labels: Record<string, string> = {
      "preparacao": "Preparação",
      "conceito": "Conceito",
      "coordenacao": "Coordenação",
      "tecnico": "Técnico",
      "construcao": "Construção",
      "entrega": "Entrega",
      "uso": "Uso",
    };
    return labels[phase] || phase;
  };

  // Group milestones by phase
  const groupedMilestones: Record<string, any[]> = {};
  milestones.forEach(m => {
    const phase = m.phase || "geral";
    if (!groupedMilestones[phase]) groupedMilestones[phase] = [];
    groupedMilestones[phase].push(m);
  });

  const completedMilestones = milestones.filter(m => m.is_completed).length;
  const totalMilestones = milestones.length;
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  const milestonesHTML = Object.entries(groupedMilestones).map(([phase, phaseMilestones]) => `
    <div class="phase-group">
      <h4 class="phase-title">${getPhaseLabel(phase)}</h4>
      ${phaseMilestones.map(m => `
        <div class="milestone ${m.is_completed ? 'completed' : ''}">
          <span class="milestone-check">${m.is_completed ? '✓' : '○'}</span>
          <div class="milestone-content">
            <span class="milestone-name">${m.name}</span>
            ${m.target_date ? `<span class="milestone-date">Prev: ${formatDate(m.target_date)}</span>` : ''}
            ${m.completed_date ? `<span class="milestone-completed">Concluído: ${formatDate(m.completed_date)}</span>` : ''}
          </div>
        </div>
      `).join("")}
    </div>
  `).join("");

  const photosHTML = photos.length > 0 ? `
    <div class="photos-section">
      <h3>📷 Galeria do Projeto</h3>
      <div class="photos-grid">
        ${photos.map(p => `
          <div class="photo-item">
            <img src="${p.image_url}" alt="${p.title || 'Foto do projeto'}" />
            ${p.title ? `<span class="photo-caption">${p.title}</span>` : ''}
          </div>
        `).join("")}
      </div>
    </div>
  ` : '';

  const documentsHTML = documents.length > 0 ? `
    <div class="documents-section">
      <h3>📄 Documentos Recentes</h3>
      <ul class="documents-list">
        ${documents.map(d => `
          <li>
            <span class="doc-title">${d.title}</span>
            <span class="doc-date">${formatDate(d.created_at)}</span>
          </li>
        `).join("")}
      </ul>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório - ${project.title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      background: #ffffff;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
    }
    
    /* Cover */
    .cover {
      background: linear-gradient(135deg, #0D3B66 0%, #1a5a9e 100%);
      color: white;
      padding: 60px 40px;
      margin: -40px -40px 40px -40px;
      text-align: center;
    }
    
    .cover h1 {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    
    .cover .subtitle {
      font-size: 18px;
      opacity: 0.9;
    }
    
    .cover .meta {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin-top: 24px;
      font-size: 14px;
      opacity: 0.8;
    }
    
    .cover .logo {
      margin-bottom: 24px;
      font-size: 14px;
      letter-spacing: 3px;
      text-transform: uppercase;
    }
    
    .status-badge {
      display: inline-block;
      background: #FFC947;
      color: #0D3B66;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      margin-top: 16px;
    }
    
    /* Sections */
    h2 {
      font-size: 24px;
      color: #0D3B66;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #0D3B66;
    }
    
    h3 {
      font-size: 18px;
      color: #0D3B66;
      margin-bottom: 12px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    /* Client Info */
    .client-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 40px;
    }
    
    .client-info h3 {
      margin-bottom: 8px;
    }
    
    .client-info p {
      margin-bottom: 4px;
      color: #666;
    }
    
    .client-info .name {
      font-weight: 600;
      color: #0D3B66;
      font-size: 18px;
    }
    
    /* Progress */
    .progress-section {
      background: linear-gradient(135deg, #0D3B66 0%, #1a5a9e 100%);
      color: white;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 40px;
    }
    
    .progress-bar-container {
      background: rgba(255,255,255,0.2);
      border-radius: 8px;
      height: 12px;
      overflow: hidden;
      margin: 16px 0;
    }
    
    .progress-bar {
      background: #FFC947;
      height: 100%;
      border-radius: 8px;
      transition: width 0.3s ease;
    }
    
    .progress-stats {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
    }
    
    /* Milestones */
    .phase-group {
      margin-bottom: 24px;
    }
    
    .phase-title {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #999;
      margin-bottom: 12px;
    }
    
    .milestone {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    
    .milestone.completed {
      background: #e8f5e9;
    }
    
    .milestone-check {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      border-radius: 50%;
      font-size: 14px;
    }
    
    .milestone.completed .milestone-check {
      background: #4caf50;
      color: white;
    }
    
    .milestone-content {
      flex: 1;
    }
    
    .milestone-name {
      font-weight: 500;
      display: block;
    }
    
    .milestone-date, .milestone-completed {
      font-size: 12px;
      color: #666;
    }
    
    .milestone-completed {
      color: #4caf50;
    }
    
    /* Budget */
    .budget-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .budget-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .budget-card .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .budget-card .value {
      font-size: 24px;
      font-weight: 700;
      color: #0D3B66;
      margin-top: 4px;
    }
    
    .budget-card.spent .value {
      color: #f44336;
    }
    
    .budget-card.remaining .value {
      color: #4caf50;
    }
    
    /* Photos */
    .photos-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    
    .photo-item {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .photo-item img {
      width: 100%;
      height: 150px;
      object-fit: cover;
    }
    
    .photo-caption {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0,0,0,0.6);
      color: white;
      padding: 6px 10px;
      font-size: 11px;
    }
    
    /* Documents */
    .documents-list {
      list-style: none;
    }
    
    .documents-list li {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e9ecef;
    }
    
    .doc-title {
      font-weight: 500;
    }
    
    .doc-date {
      color: #666;
      font-size: 13px;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      padding-top: 40px;
      border-top: 1px solid #e9ecef;
      margin-top: 40px;
    }
    
    .footer p {
      color: #999;
      font-size: 12px;
    }
    
    .generated-date {
      color: #999;
      font-size: 12px;
      margin-top: 8px;
    }
    
    @media print {
      .container {
        padding: 20px;
      }
      .cover {
        margin: -20px -20px 20px -20px;
        padding: 40px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Cover -->
    <div class="cover">
      <div class="logo">ARIFA STUDIO</div>
      <h1>${project.title}</h1>
      <p class="subtitle">${project.description || ''}</p>
      <div class="meta">
        ${project.location ? `<span>📍 ${project.location}</span>` : ''}
        ${project.category ? `<span>🏠 ${project.category}</span>` : ''}
        ${project.area ? `<span>📐 ${project.area}</span>` : ''}
      </div>
      <div class="status-badge">${getStatusLabel(project.status)}</div>
    </div>

    <!-- Client Info -->
    ${project.profiles ? `
      <div class="client-info">
        <h3>👤 Cliente</h3>
        <p class="name">${project.profiles.full_name}</p>
        ${project.profiles.company ? `<p>${project.profiles.company}</p>` : ''}
        <p>${project.profiles.email}</p>
        ${project.profiles.phone ? `<p>${project.profiles.phone}</p>` : ''}
      </div>
    ` : ''}

    <!-- Progress -->
    ${totalMilestones > 0 ? `
      <div class="progress-section">
        <h3 style="color: white; border: none; padding: 0; margin-bottom: 8px;">📈 Progresso do Projeto</h3>
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${progressPercent}%;"></div>
        </div>
        <div class="progress-stats">
          <span>${completedMilestones} de ${totalMilestones} milestones concluídas</span>
          <span>${progressPercent}% completo</span>
        </div>
      </div>
    ` : ''}

    <!-- Budget -->
    ${budget ? `
      <div class="section">
        <h2>💰 Orçamento</h2>
        <div class="budget-grid">
          <div class="budget-card">
            <span class="label">Orçamento Original</span>
            <span class="value">${formatCurrency(budget.original_budget)}</span>
          </div>
          <div class="budget-card spent">
            <span class="label">Gasto</span>
            <span class="value">${formatCurrency(budget.spent_amount)}</span>
          </div>
          <div class="budget-card remaining">
            <span class="label">Disponível</span>
            <span class="value">${formatCurrency((budget.current_budget || budget.original_budget) - (budget.spent_amount || 0))}</span>
          </div>
        </div>
        ${budget.notes ? `<p style="color: #666; font-size: 14px;">${budget.notes}</p>` : ''}
      </div>
    ` : ''}

    <!-- Milestones -->
    ${milestones.length > 0 ? `
      <div class="section">
        <h2>📋 Timeline do Projeto</h2>
        ${milestonesHTML}
      </div>
    ` : ''}

    <!-- Photos -->
    ${photosHTML}

    <!-- Documents -->
    ${documentsHTML}

    <!-- Footer -->
    <footer class="footer">
      <p>ARIFA Studio • Arquitetura de Excelência</p>
      <p class="generated-date">Relatório gerado a ${formatDate(new Date().toISOString())}</p>
    </footer>
  </div>
</body>
</html>
  `;
}
