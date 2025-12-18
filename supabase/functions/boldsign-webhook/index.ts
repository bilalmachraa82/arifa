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
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = await req.json();
    console.log("BoldSign webhook received:", JSON.stringify(payload, null, 2));

    const { event, document } = payload;

    if (!event || !document?.documentId) {
      console.log("Invalid webhook payload");
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const documentId = document.documentId;

    // Find contract by BoldSign document ID
    const { data: contract, error: findError } = await supabase
      .from("contracts")
      .select("*")
      .eq("boldsign_document_id", documentId)
      .single();

    if (findError || !contract) {
      console.log("Contract not found for document:", documentId);
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Processing event:", event.eventType, "for contract:", contract.id);

    let updateData: Record<string, any> = {};

    switch (event.eventType) {
      case "Sent":
        updateData = { status: "pending" };
        break;

      case "Viewed":
        updateData = {
          metadata: {
            ...contract.metadata,
            viewed_at: new Date().toISOString(),
          },
        };
        break;

      case "Signed":
      case "Completed":
        updateData = {
          status: "signed",
          signed_at: new Date().toISOString(),
        };
        
        // Try to get the signed document URL
        if (document.signedDocumentUrl) {
          updateData.signed_document_url = document.signedDocumentUrl;
        }
        break;

      case "Declined":
        updateData = {
          status: "declined",
          metadata: {
            ...contract.metadata,
            declined_at: new Date().toISOString(),
            decline_reason: document.declineReason || "Não especificado",
          },
        };
        break;

      case "Expired":
        updateData = { status: "expired" };
        break;

      case "Revoked":
        updateData = { status: "cancelled" };
        break;

      default:
        console.log("Unhandled event type:", event.eventType);
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from("contracts")
        .update(updateData)
        .eq("id", contract.id);

      if (updateError) {
        console.error("Error updating contract:", updateError);
      } else {
        console.log("Contract updated successfully:", contract.id);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in boldsign-webhook:", error);
    // Always return 200 to acknowledge receipt
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
