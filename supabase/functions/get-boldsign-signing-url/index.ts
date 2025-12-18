import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { contract_id } = await req.json();

    if (!contract_id) {
      throw new Error("contract_id is required");
    }

    // Get contract
    const { data: contract, error: contractError } = await supabase
      .from("contracts")
      .select(`
        *,
        client:profiles!contracts_client_id_fkey(id, full_name, email)
      `)
      .eq("id", contract_id)
      .single();

    if (contractError || !contract) {
      throw new Error(`Contract not found: ${contractError?.message}`);
    }

    if (!contract.boldsign_document_id) {
      throw new Error("Contract has no BoldSign document ID");
    }

    if (contract.status === "signed") {
      return new Response(
        JSON.stringify({
          success: true,
          status: "signed",
          signed_document_url: contract.signed_document_url,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get embedded signing link from BoldSign
    const signerEmail = contract.client?.email;
    if (!signerEmail) {
      throw new Error("Client email not found");
    }

    const url = new URL("https://api.boldsign.com/v1/document/getEmbeddedSignLink");
    url.searchParams.append("documentId", contract.boldsign_document_id);
    url.searchParams.append("signerEmail", signerEmail);
    url.searchParams.append("redirectUrl", `${Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app')}/cliente`);

    console.log("Getting embedded sign link for:", contract.boldsign_document_id);

    const boldSignResponse = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "X-API-KEY": boldSignApiKey,
      },
    });

    if (!boldSignResponse.ok) {
      const errorText = await boldSignResponse.text();
      console.error("BoldSign API error:", errorText);
      throw new Error(`BoldSign API error: ${boldSignResponse.status} - ${errorText}`);
    }

    const boldSignData = await boldSignResponse.json();
    console.log("BoldSign sign link response:", boldSignData);

    return new Response(
      JSON.stringify({
        success: true,
        signing_url: boldSignData.signLink,
        status: contract.status,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in get-boldsign-signing-url:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
