import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OdooSyncRequest {
  projectId: string;
  syncType?: "contracts" | "invoices" | "all";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ODOO_API_URL = Deno.env.get("ODOO_API_URL");
    const ODOO_API_KEY = Deno.env.get("ODOO_API_KEY");
    const ODOO_DB = Deno.env.get("ODOO_DB");

    if (!ODOO_API_URL || !ODOO_API_KEY) {
      console.log("Odoo credentials not configured - returning mock data info");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Odoo integration ready. Configure ODOO_API_URL and ODOO_API_KEY to enable sync.",
          configured: false,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { projectId, syncType = "all" }: OdooSyncRequest = await req.json();

    if (!projectId) {
      return new Response(
        JSON.stringify({ error: "projectId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let contractsCount = 0;
    let invoicesCount = 0;

    // Sync contracts from Odoo
    if (syncType === "contracts" || syncType === "all") {
      try {
        const odooResponse = await fetch(`${ODOO_API_URL}/api/v1/contracts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ODOO_API_KEY}`,
          },
          body: JSON.stringify({
            db: ODOO_DB,
            project_id: projectId,
          }),
        });

        if (odooResponse.ok) {
          const contracts = await odooResponse.json();

          for (const contract of contracts.data || []) {
            const { error } = await supabase
              .from("odoo_contracts")
              .upsert(
                {
                  project_id: projectId,
                  external_id: String(contract.id),
                  contract_number: contract.name,
                  title: contract.display_name || contract.name,
                  description: contract.notes || null,
                  total_amount: contract.amount_total || 0,
                  paid_amount: contract.amount_paid || 0,
                  start_date: contract.date_start || null,
                  end_date: contract.date_end || null,
                  status: contract.state || "active",
                  raw_data: contract,
                  synced_at: new Date().toISOString(),
                },
                { onConflict: "external_id" }
              );

            if (!error) contractsCount++;
          }
        }
      } catch (err) {
        console.error("Error syncing Odoo contracts:", err);
      }
    }

    // Sync invoices from Odoo
    if (syncType === "invoices" || syncType === "all") {
      try {
        const odooResponse = await fetch(`${ODOO_API_URL}/api/v1/invoices`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ODOO_API_KEY}`,
          },
          body: JSON.stringify({
            db: ODOO_DB,
            project_id: projectId,
          }),
        });

        if (odooResponse.ok) {
          const invoices = await odooResponse.json();

          for (const invoice of invoices.data || []) {
            const { error } = await supabase
              .from("odoo_invoices")
              .upsert(
                {
                  project_id: projectId,
                  external_id: String(invoice.id),
                  invoice_number: invoice.name,
                  description: invoice.narration || null,
                  amount: invoice.amount_untaxed || 0,
                  tax_amount: invoice.amount_tax || 0,
                  total_amount: invoice.amount_total || 0,
                  issue_date: invoice.invoice_date || null,
                  due_date: invoice.invoice_date_due || null,
                  payment_date: invoice.payment_date || null,
                  payment_status: invoice.payment_state || "pending",
                  raw_data: invoice,
                  synced_at: new Date().toISOString(),
                },
                { onConflict: "external_id" }
              );

            if (!error) invoicesCount++;
          }
        }
      } catch (err) {
        console.error("Error syncing Odoo invoices:", err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        configured: true,
        synced: {
          contracts: contractsCount,
          invoices: invoicesCount,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in odoo-sync:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
