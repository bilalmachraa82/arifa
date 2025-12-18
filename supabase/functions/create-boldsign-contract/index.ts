import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateContractRequest {
  quote_id: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const boldSignApiKey = Deno.env.get("BOLDSIGN_API_KEY");

    if (!boldSignApiKey) {
      throw new Error("BOLDSIGN_API_KEY not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { quote_id }: CreateContractRequest = await req.json();

    if (!quote_id) {
      throw new Error("quote_id is required");
    }

    // Get quote with client details
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select(`
        *,
        client:profiles!quotes_client_id_fkey(id, full_name, email),
        items:quote_items(*)
      `)
      .eq("id", quote_id)
      .single();

    if (quoteError || !quote) {
      throw new Error(`Quote not found: ${quoteError?.message}`);
    }

    if (!quote.client) {
      throw new Error("Quote has no associated client");
    }

    console.log("Creating contract for quote:", quote.quote_number);

    // Generate contract HTML content
    const contractHtml = generateContractHtml(quote);

    // Create document in BoldSign
    const formData = new FormData();
    
    // Add document configuration
    formData.append("Title", `Contrato - ${quote.project_title}`);
    formData.append("Message", `Por favor assine o contrato para o projeto: ${quote.project_title}`);
    formData.append("EnableSigningOrder", "false");
    formData.append("EnableEmbeddedSigning", "true");
    formData.append("ExpiryDays", "30");
    formData.append("ReminderSettings.EnableAutoReminder", "true");
    formData.append("ReminderSettings.ReminderDays", "3");
    formData.append("ReminderSettings.ReminderCount", "3");

    // Add signer
    formData.append("Signers[0].Name", quote.client.full_name || "Cliente");
    formData.append("Signers[0].EmailAddress", quote.client.email);
    formData.append("Signers[0].SignerType", "Signer");
    formData.append("Signers[0].FormFields[0].FieldType", "Signature");
    formData.append("Signers[0].FormFields[0].PageNumber", "1");
    formData.append("Signers[0].FormFields[0].Bounds.X", "100");
    formData.append("Signers[0].FormFields[0].Bounds.Y", "600");
    formData.append("Signers[0].FormFields[0].Bounds.Width", "200");
    formData.append("Signers[0].FormFields[0].Bounds.Height", "50");
    formData.append("Signers[0].FormFields[0].IsRequired", "true");

    // Add date field
    formData.append("Signers[0].FormFields[1].FieldType", "DateSigned");
    formData.append("Signers[0].FormFields[1].PageNumber", "1");
    formData.append("Signers[0].FormFields[1].Bounds.X", "350");
    formData.append("Signers[0].FormFields[1].Bounds.Y", "620");
    formData.append("Signers[0].FormFields[1].Bounds.Width", "150");
    formData.append("Signers[0].FormFields[1].Bounds.Height", "30");

    // Convert HTML to PDF using simple text file for now
    // In production, you'd use a PDF generation service
    const contractBlob = new Blob([contractHtml], { type: "text/html" });
    formData.append("Files", contractBlob, `contrato-${quote.quote_number}.html`);

    console.log("Sending to BoldSign API...");

    const boldSignResponse = await fetch("https://api.boldsign.com/v1/document/send", {
      method: "POST",
      headers: {
        "X-API-KEY": boldSignApiKey,
      },
      body: formData,
    });

    if (!boldSignResponse.ok) {
      const errorText = await boldSignResponse.text();
      console.error("BoldSign API error:", errorText);
      throw new Error(`BoldSign API error: ${boldSignResponse.status} - ${errorText}`);
    }

    const boldSignData = await boldSignResponse.json();
    console.log("BoldSign response:", boldSignData);

    // Create contract record in database
    const { data: contract, error: contractError } = await supabase
      .from("contracts")
      .insert({
        quote_id: quote.id,
        client_id: quote.client.id,
        title: `Contrato - ${quote.project_title}`,
        boldsign_document_id: boldSignData.documentId,
        status: "pending",
        metadata: {
          quote_number: quote.quote_number,
          total: quote.total,
          boldsign_response: boldSignData,
        },
      })
      .select()
      .single();

    if (contractError) {
      console.error("Error creating contract:", contractError);
      throw new Error(`Error creating contract: ${contractError.message}`);
    }

    console.log("Contract created:", contract.id);

    return new Response(
      JSON.stringify({
        success: true,
        contract_id: contract.id,
        boldsign_document_id: boldSignData.documentId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in create-boldsign-contract:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});

function generateContractHtml(quote: any): string {
  const items = quote.items || [];
  const itemsHtml = items
    .map((item: any) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.description}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity} ${item.unit || 'un'}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">€${item.unit_price?.toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">€${item.total?.toFixed(2)}</td>
      </tr>
    `)
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Contrato - ${quote.project_title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #1a1a1a; border-bottom: 2px solid #333; padding-bottom: 10px; }
    h2 { color: #333; margin-top: 30px; }
    .header { text-align: center; margin-bottom: 40px; }
    .section { margin-bottom: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f5f5f5; padding: 10px; border: 1px solid #ddd; text-align: left; }
    .totals { margin-top: 20px; text-align: right; }
    .signature-area { margin-top: 60px; padding-top: 20px; border-top: 1px solid #ddd; }
    .signature-line { margin-top: 40px; border-top: 1px solid #333; width: 300px; padding-top: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
    <p><strong>Referência:</strong> ${quote.quote_number}</p>
    <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-PT')}</p>
  </div>

  <div class="section">
    <h2>1. IDENTIFICAÇÃO DAS PARTES</h2>
    <p><strong>PRIMEIRO OUTORGANTE (Prestador):</strong> ARIFA - Arquitectura e Design</p>
    <p><strong>SEGUNDO OUTORGANTE (Cliente):</strong> ${quote.client?.full_name || 'Cliente'}</p>
    <p><strong>Email:</strong> ${quote.client?.email || ''}</p>
  </div>

  <div class="section">
    <h2>2. OBJETO DO CONTRATO</h2>
    <p><strong>Projeto:</strong> ${quote.project_title}</p>
    ${quote.project_description ? `<p><strong>Descrição:</strong> ${quote.project_description}</p>` : ''}
    ${quote.project_location ? `<p><strong>Localização:</strong> ${quote.project_location}</p>` : ''}
    ${quote.estimated_duration ? `<p><strong>Duração Estimada:</strong> ${quote.estimated_duration}</p>` : ''}
  </div>

  <div class="section">
    <h2>3. ÂMBITO DOS TRABALHOS</h2>
    <table>
      <thead>
        <tr>
          <th>Descrição</th>
          <th style="text-align: center;">Quantidade</th>
          <th style="text-align: right;">Preço Unit.</th>
          <th style="text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>
    <div class="totals">
      <p><strong>Subtotal:</strong> €${quote.subtotal?.toFixed(2) || '0.00'}</p>
      ${quote.tax_amount ? `<p><strong>IVA (${quote.tax_rate}%):</strong> €${quote.tax_amount?.toFixed(2)}</p>` : ''}
      <p style="font-size: 1.2em;"><strong>TOTAL:</strong> €${quote.total?.toFixed(2) || '0.00'}</p>
    </div>
  </div>

  <div class="section">
    <h2>4. CONDIÇÕES DE PAGAMENTO</h2>
    <p>${quote.payment_terms || 'A definir entre as partes.'}</p>
  </div>

  ${quote.terms_conditions ? `
  <div class="section">
    <h2>5. TERMOS E CONDIÇÕES</h2>
    <p>${quote.terms_conditions}</p>
  </div>
  ` : ''}

  <div class="section">
    <h2>6. VALIDADE</h2>
    <p>Este contrato é válido até ${quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('pt-PT') : '30 dias após a data de emissão'}.</p>
  </div>

  <div class="signature-area">
    <h2>7. ASSINATURAS</h2>
    <p>O presente contrato é assinado eletronicamente pelas partes, tendo o mesmo valor legal que uma assinatura manuscrita.</p>
    
    <div style="display: flex; justify-content: space-between; margin-top: 40px;">
      <div>
        <p><strong>ARIFA - Arquitectura e Design</strong></p>
        <div class="signature-line">Assinatura do Prestador</div>
      </div>
      <div>
        <p><strong>${quote.client?.full_name || 'Cliente'}</strong></p>
        <div class="signature-line">Assinatura do Cliente</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}
