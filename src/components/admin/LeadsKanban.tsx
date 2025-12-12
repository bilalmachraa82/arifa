import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  Loader2,
  GripVertical,
  Plus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LeadStage } from "@/hooks/useLeadStages";

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

interface LeadsKanbanProps {
  leads: Lead[];
  stages: LeadStage[];
  onLeadSelect: (lead: Lead) => void;
  selectedLead: Lead | null;
  onRefresh: () => void;
  getStageByName: (name: string | null) => LeadStage;
}

// Map old status values to stage names
const statusToStageName: Record<string, string> = {
  new: "Novo",
  contacted: "Contactado",
  qualified: "Qualificado",
  converted: "Convertido",
  lost: "Perdido",
};

const LeadsKanban = ({ 
  leads, 
  stages, 
  onLeadSelect, 
  selectedLead, 
  onRefresh,
  getStageByName 
}: LeadsKanbanProps) => {
  const { toast } = useToast();
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  const getLeadsByStage = (stage: LeadStage): Lead[] => {
    return leads.filter((lead) => {
      const leadStage = getStageByName(lead.status);
      return leadStage.name === stage.name;
    });
  };

  const columnStats = useMemo(() => {
    return stages.reduce((acc, stage) => {
      const stageLeads = getLeadsByStage(stage);
      const avgScore = stageLeads.length > 0
        ? Math.round(
            stageLeads.reduce((sum, l) => sum + (l.ai_score || 0), 0) /
              stageLeads.filter((l) => l.ai_score).length || 0
          )
        : 0;
      
      acc[stage.name] = {
        count: stageLeads.length,
        avgScore,
      };
      return acc;
    }, {} as Record<string, { count: number; avgScore: number }>);
  }, [leads, stages]);

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", lead.id);
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedLead(null);
    setDragOverColumn(null);
    
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  };

  const handleDragOver = (e: React.DragEvent, stageName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(stageName);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStage: LeadStage) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedLead) return;

    const currentStage = getStageByName(draggedLead.status);
    if (currentStage.name === targetStage.name) {
      setDraggedLead(null);
      return;
    }

    setUpdatingLeadId(draggedLead.id);

    try {
      // Use lowercase status for compatibility with existing data
      const newStatus = targetStage.name.toLowerCase();
      
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", draggedLead.id);

      if (error) throw error;

      toast({
        title: "Lead atualizado",
        description: `${draggedLead.name} movido para "${targetStage.name}"`,
      });

      onRefresh();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Não foi possível atualizar o lead.",
        variant: "destructive",
      });
    } finally {
      setUpdatingLeadId(null);
      setDraggedLead(null);
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    const d = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias`;
    
    return d.toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "short",
    });
  };

  const getScoreBadge = (score: number | null) => {
    if (score === null) return null;
    
    let bgColor = "bg-muted";
    let textColor = "text-muted-foreground";
    
    if (score >= 80) {
      bgColor = "bg-green-100 dark:bg-green-900/30";
      textColor = "text-green-700 dark:text-green-400";
    } else if (score >= 60) {
      bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
      textColor = "text-yellow-700 dark:text-yellow-400";
    } else if (score >= 40) {
      bgColor = "bg-orange-100 dark:bg-orange-900/30";
      textColor = "text-orange-700 dark:text-orange-400";
    } else {
      bgColor = "bg-red-100 dark:bg-red-900/30";
      textColor = "text-red-700 dark:text-red-400";
    }

    return (
      <Badge className={`${bgColor} ${textColor} gap-1 border-0 text-xs`}>
        <TrendingUp className="h-3 w-3" />
        {score}
      </Badge>
    );
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {stages.map((stage) => {
        const stageLeads = getLeadsByStage(stage);
        const isDragOver = dragOverColumn === stage.name;
        const stats = columnStats[stage.name] || { count: 0, avgScore: 0 };

        return (
          <div
            key={stage.id}
            className="flex-shrink-0 w-72"
            onDragOver={(e) => handleDragOver(e, stage.name)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <div
              className={`rounded-lg border-2 transition-all duration-200 ${
                isDragOver
                  ? "bg-muted/50 scale-[1.02] shadow-lg"
                  : "border-border bg-muted/30"
              }`}
              style={{
                borderColor: isDragOver ? stage.color : undefined,
              }}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <h3 className="font-medium text-sm">{stage.name}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stats.count}
                  </Badge>
                </div>
                {stats.avgScore > 0 && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Média AI: {stats.avgScore}
                  </div>
                )}
              </div>

              {/* Column Content */}
              <ScrollArea className="h-[500px]">
                <div className="p-2 space-y-2">
                  {stageLeads.length === 0 ? (
                    <div 
                      className={`text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg transition-colors ${
                        isDragOver ? "border-primary bg-primary/5" : "border-transparent"
                      }`}
                    >
                      {isDragOver ? (
                        <span className="flex items-center justify-center gap-2">
                          <Plus className="h-4 w-4" />
                          Soltar aqui
                        </span>
                      ) : (
                        "Sem leads"
                      )}
                    </div>
                  ) : (
                    stageLeads.map((lead, index) => (
                      <Card
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onLeadSelect(lead)}
                        className={`cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                          selectedLead?.id === lead.id ? "ring-2 ring-primary shadow-md" : ""
                        } ${draggedLead?.id === lead.id ? "opacity-50 scale-95" : ""} ${
                          updatingLeadId === lead.id ? "opacity-70 pointer-events-none" : ""
                        }`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="font-medium text-sm truncate">
                                {lead.name}
                              </span>
                            </div>
                            {updatingLeadId === lead.id && (
                              <Loader2 className="h-4 w-4 animate-spin flex-shrink-0 text-primary" />
                            )}
                          </div>

                          <div className="space-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                            {lead.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                <span>{lead.phone}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 flex-wrap">
                              {lead.segment && (
                                <Badge variant="outline" className="text-xs">
                                  {lead.segment}
                                </Badge>
                              )}
                              {getScoreBadge(lead.ai_score)}
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(lead.created_at)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeadsKanban;
