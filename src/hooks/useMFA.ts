import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useMFA() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkMFAStatus = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) {
        console.error("Error checking MFA status:", error);
        return;
      }

      const hasVerifiedTotp = data.totp.some(factor => factor.status === "verified");
      setMfaEnabled(hasVerifiedTotp);
    } catch (error) {
      console.error("Error checking MFA status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkMFAStatus();
  }, []);

  return {
    mfaEnabled,
    loading,
    refreshMFAStatus: checkMFAStatus,
  };
}

export async function checkMFARequired(): Promise<{ required: boolean; factorId: string | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { required: false, factorId: null };

    const { data: factors, error } = await supabase.auth.mfa.listFactors();
    if (error) return { required: false, factorId: null };

    const verifiedFactor = factors.totp.find(f => f.status === "verified");
    if (!verifiedFactor) return { required: false, factorId: null };

    // Check current AAL level
    const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aalError) return { required: false, factorId: null };

    // If current AAL is lower than next required AAL, MFA verification is needed
    if (aalData.currentLevel === "aal1" && aalData.nextLevel === "aal2") {
      return { required: true, factorId: verifiedFactor.id };
    }

    return { required: false, factorId: null };
  } catch (error) {
    console.error("Error checking MFA required:", error);
    return { required: false, factorId: null };
  }
}
