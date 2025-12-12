import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  segment: string | null;
  service: string | null;
  message: string;
  status: string | null;
  source: string | null;
  created_at: string | null;
  ai_score: number | null;
  ai_score_reason: string | null;
  ai_scored_at: string | null;
}

interface UseLeadsRealtimeProps {
  onLeadChange: () => void;
  enabled?: boolean;
}

export const useLeadsRealtime = ({ onLeadChange, enabled = true }: UseLeadsRealtimeProps) => {
  const { toast } = useToast();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const setupRealtime = useCallback(() => {
    if (!enabled) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    channelRef.current = supabase
      .channel("leads-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          console.log("Lead change detected:", payload.eventType);
          
          if (payload.eventType === "INSERT") {
            const newLead = payload.new as Lead;
            toast({
              title: "Novo lead recebido",
              description: `${newLead.name} (${newLead.email})`,
            });
          } else if (payload.eventType === "UPDATE") {
            // Silent refresh for updates
          }
          
          onLeadChange();
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });
  }, [enabled, onLeadChange, toast]);

  useEffect(() => {
    setupRealtime();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [setupRealtime]);
};
