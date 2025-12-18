import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteItem {
  category: string | null;
  description: string;
  unit: string | null;
  quantity: number | null;
  unit_price: number;
  total: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quoteId } = await req.json();
    
    if (!quoteId) {
      throw new Error("Quote ID is required");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch quote with items
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select(`
        *,
        quote_items (*)
      `)
      .eq("id", quoteId)
      .single();

    if (quoteError || !quote) {
      throw new Error("Quote not found");
    }

    // Fetch client info if available
    let clientInfo = null;
    if (quote.client_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email, phone, company")
        .eq("id", quote.client_id)
        .single();
      clientInfo = profile;
    }

    // Fetch lead info if available
    let leadInfo = null;
    if (quote.lead_id) {
      const { data: lead } = await supabase
        .from("leads")
        .select("name, email, phone")
        .eq("id", quote.lead_id)
        .single();
      leadInfo = lead;
    }

    const recipient = clientInfo || leadInfo;

    // Generate HTML for PDF
    const html = generateQuoteHTML(quote, quote.quote_items || [], recipient);

    console.log("Quote PDF HTML generated for:", quote.quote_number);

    return new Response(
      JSON.stringify({ 
        success: true, 
        html,
        quoteNumber: quote.quote_number 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating quote PDF:", errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generateQuoteHTML(
  quote: any, 
  items: QuoteItem[], 
  recipient: any
): string {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value);

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" });

  // Group items by category
  const groupedItems: Record<string, QuoteItem[]> = {};
  items.forEach(item => {
    const category = item.category || "Geral";
    if (!groupedItems[category]) groupedItems[category] = [];
    groupedItems[category].push(item);
  });

  const itemsHTML = Object.entries(groupedItems).map(([category, categoryItems]) => `
    <tr class="category-row">
      <td colspan="5" style="background-color: #f8f9fa; font-weight: bold; padding: 12px 16px; border-bottom: 2px solid #0D3B66;">
        ${category}
      </td>
    </tr>
    ${categoryItems.map(item => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e9ecef;">${item.description}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e9ecef; text-align: center;">${item.unit || "un"}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e9ecef; text-align: right;">${item.quantity || 1}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e9ecef; text-align: right;">${formatCurrency(item.unit_price)}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #e9ecef; text-align: right; font-weight: 500;">${formatCurrency(item.total)}</td>
      </tr>
    `).join("")}
  `).join("");

  return `
<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proposta ${quote.quote_number}</title>
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
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 3px solid #0D3B66;
    }
    
    .logo-section h1 {
      font-size: 32px;
      font-weight: 700;
      color: #0D3B66;
      letter-spacing: -0.5px;
    }
    
    .logo-section p {
      color: #666;
      font-size: 14px;
      margin-top: 4px;
    }
    
    .quote-info {
      text-align: right;
    }
    
    .quote-number {
      font-size: 24px;
      font-weight: 600;
      color: #0D3B66;
    }
    
    .quote-date {
      color: #666;
      font-size: 14px;
      margin-top: 4px;
    }
    
    .valid-until {
      display: inline-block;
      background: #FFC947;
      color: #0D3B66;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 8px;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    
    .info-box h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #999;
      margin-bottom: 12px;
    }
    
    .info-box p {
      margin-bottom: 4px;
    }
    
    .info-box .name {
      font-weight: 600;
      font-size: 18px;
      color: #0D3B66;
    }
    
    .project-section {
      background: linear-gradient(135deg, #0D3B66 0%, #1a5a9e 100%);
      color: white;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 40px;
    }
    
    .project-section h2 {
      font-size: 20px;
      margin-bottom: 8px;
    }
    
    .project-section p {
      opacity: 0.9;
      font-size: 14px;
    }
    
    .project-meta {
      display: flex;
      gap: 24px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.2);
      font-size: 13px;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    
    .items-table th {
      background: #0D3B66;
      color: white;
      padding: 14px 16px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .items-table th:nth-child(2),
    .items-table th:nth-child(3),
    .items-table th:nth-child(4),
    .items-table th:nth-child(5) {
      text-align: right;
    }
    
    .totals {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 40px;
    }
    
    .totals-box {
      width: 300px;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
    }
    
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e9ecef;
    }
    
    .totals-row.total {
      border-bottom: none;
      padding-top: 16px;
      margin-top: 8px;
      border-top: 2px solid #0D3B66;
      font-size: 20px;
      font-weight: 700;
      color: #0D3B66;
    }
    
    .terms-section {
      background: #f8f9fa;
      padding: 24px;
      border-radius: 8px;
      margin-bottom: 40px;
    }
    
    .terms-section h3 {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 12px;
      color: #0D3B66;
    }
    
    .terms-section p {
      font-size: 13px;
      color: #666;
      white-space: pre-line;
    }
    
    .footer {
      text-align: center;
      padding-top: 40px;
      border-top: 1px solid #e9ecef;
    }
    
    .footer p {
      color: #999;
      font-size: 12px;
    }
    
    .signature-area {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin: 40px 0;
    }
    
    .signature-box {
      border-top: 2px solid #0D3B66;
      padding-top: 8px;
      text-align: center;
    }
    
    .signature-box p {
      font-size: 12px;
      color: #666;
    }
    
    @media print {
      .container {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <div class="logo-section">
        <h1>ARIFA STUDIO</h1>
        <p>Arquitetura • Design • Construção</p>
      </div>
      <div class="quote-info">
        <div class="quote-number">${quote.quote_number}</div>
        <div class="quote-date">Emitida a ${formatDate(quote.created_at)}</div>
        <div class="valid-until">Válida até ${formatDate(quote.valid_until)}</div>
      </div>
    </header>

    <div class="info-grid">
      <div class="info-box">
        <h3>De</h3>
        <p class="name">ARIFA Studio</p>
        <p>info@arifa.pt</p>
        <p>+351 XXX XXX XXX</p>
        <p>Lisboa, Portugal</p>
      </div>
      <div class="info-box">
        <h3>Para</h3>
        ${recipient ? `
          <p class="name">${recipient.full_name || recipient.name}</p>
          ${recipient.company ? `<p>${recipient.company}</p>` : ""}
          <p>${recipient.email}</p>
          ${recipient.phone ? `<p>${recipient.phone}</p>` : ""}
        ` : `
          <p class="name">Cliente</p>
        `}
      </div>
    </div>

    <div class="project-section">
      <h2>${quote.project_title}</h2>
      ${quote.project_description ? `<p>${quote.project_description}</p>` : ""}
      <div class="project-meta">
        ${quote.project_location ? `<span>📍 ${quote.project_location}</span>` : ""}
        ${quote.project_category ? `<span>🏠 ${quote.project_category}</span>` : ""}
        ${quote.estimated_duration ? `<span>⏱️ ${quote.estimated_duration}</span>` : ""}
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 40%;">Descrição</th>
          <th style="width: 10%;">Un.</th>
          <th style="width: 10%;">Qtd.</th>
          <th style="width: 20%;">Preço Unit.</th>
          <th style="width: 20%;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-box">
        <div class="totals-row">
          <span>Subtotal</span>
          <span>${formatCurrency(quote.subtotal)}</span>
        </div>
        ${quote.tax_rate ? `
          <div class="totals-row">
            <span>IVA (${quote.tax_rate}%)</span>
            <span>${formatCurrency(quote.tax_amount || 0)}</span>
          </div>
        ` : ""}
        <div class="totals-row total">
          <span>Total</span>
          <span>${formatCurrency(quote.total)}</span>
        </div>
      </div>
    </div>

    ${quote.payment_terms ? `
      <div class="terms-section">
        <h3>Condições de Pagamento</h3>
        <p>${quote.payment_terms}</p>
      </div>
    ` : ""}

    ${quote.terms_conditions ? `
      <div class="terms-section">
        <h3>Termos e Condições</h3>
        <p>${quote.terms_conditions}</p>
      </div>
    ` : ""}

    <div class="signature-area">
      <div class="signature-box">
        <p>ARIFA Studio</p>
      </div>
      <div class="signature-box">
        <p>Cliente</p>
      </div>
    </div>

    <footer class="footer">
      <p>ARIFA Studio • Arquitetura de Excelência</p>
      <p>Este documento foi gerado automaticamente e não requer assinatura física para efeitos de proposta.</p>
    </footer>
  </div>
</body>
</html>
  `;
}
