import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LeadStage {
  id: string;
  name: string;
  color: string;
  border_color: string;
  sort_order: number;
  is_active: boolean;
}

// Default stages fallback if database is empty
const defaultStages: LeadStage[] = [
  { id: "new", name: "Novo", color: "#3b82f6", border_color: "#2563eb", sort_order: 0, is_active: true },
  { id: "contacted", name: "Contactado", color: "#eab308", border_color: "#ca8a04", sort_order: 1, is_active: true },
  { id: "qualified", name: "Qualificado", color: "#22c55e", border_color: "#16a34a", sort_order: 2, is_active: true },
  { id: "converted", name: "Convertido", color: "#a855f7", border_color: "#9333ea", sort_order: 3, is_active: true },
  { id: "lost", name: "Perdido", color: "#ef4444", border_color: "#dc2626", sort_order: 4, is_active: true },
];

// Map old status names to new stage names for compatibility
const statusNameMap: Record<string, string> = {
  new: "Novo",
  contacted: "Contactado",
  qualified: "Qualificado",
  converted: "Convertido",
  lost: "Perdido",
};

export const useLeadStages = () => {
  const [stages, setStages] = useState<LeadStage[]>(defaultStages);
  const [loading, setLoading] = useState(true);

  const fetchStages = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("lead_stages")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching stages:", error);
        return;
      }

      if (data && data.length > 0) {
        setStages(data);
      }
    } catch (error) {
      console.error("Error in fetchStages:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  // Get stage by name (for matching leads status to stages)
  const getStageByName = useCallback(
    (name: string | null): LeadStage => {
      if (!name) return stages[0];
      
      // Try to find by exact name match
      let stage = stages.find((s) => s.name.toLowerCase() === name.toLowerCase());
      
      // Try mapped name for old status values
      if (!stage) {
        const mappedName = statusNameMap[name.toLowerCase()];
        if (mappedName) {
          stage = stages.find((s) => s.name.toLowerCase() === mappedName.toLowerCase());
        }
      }
      
      return stage || stages[0];
    },
    [stages]
  );

  // Get stage name for database update
  const getStageNameForDB = useCallback(
    (stageName: string): string => {
      // If it's an old status key, return as-is for compatibility
      if (statusNameMap[stageName.toLowerCase()]) {
        return stageName.toLowerCase();
      }
      // Otherwise, find the stage and use its name
      const stage = stages.find((s) => s.name === stageName);
      return stage?.name || stageName;
    },
    [stages]
  );

  return {
    stages,
    loading,
    refetch: fetchStages,
    getStageByName,
    getStageNameForDB,
  };
};
