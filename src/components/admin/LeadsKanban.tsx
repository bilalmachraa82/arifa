import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Mail, 
  Phone, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  Loader2,
  GripVertical,
  Building2
} from "lucide-react";
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

interface LeadsKanbanProps {
  leads: Lead[];
  onLeadSelect: (lead: Lead) => void;
  selectedLead: Lead | null;
  onRefresh: () => void;
}

const columns = [
  { id: "new", label: "Novo", color: "bg-blue-500", borderColor: "border-blue-500" },
  { id: "contacted", label: "Contactado", color: "bg-yellow-500", borderColor: "border-yellow-500" },
  { id: "qualified", label: "Qualificado", color: "bg-green-500", borderColor: "border-green-500" },
  { id: "converted", label: "Convertido", color: "bg-purple-500", borderColor: "border-purple-500" },
  { id: "lost", label: "Perdido", color: "bg-red-500", borderColor: "border-red-500" },
];

const LeadsKanban = ({ leads, onLeadSelect, selectedLead, onRefresh }: LeadsKanbanProps) => {
  const { toast } = useToast();
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  const getLeadsByStatus = (status: string) => {
    return leads.filter(lead => (lead.status || "new") === status);
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", lead.id);
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedLead || (draggedLead.status || "new") === newStatus) {
      return;
    }

    setUpdatingLeadId(draggedLead.id);

    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", draggedLead.id);

      if (error) throw error;

      toast({
        title: "Lead atualizado",
        description: `${draggedLead.name} movido para "${columns.find(c => c.id === newStatus)?.label}"`,
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
    return new Date(date).toLocaleDateString("pt-PT", {
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
      {columns.map((column) => {
        const columnLeads = getLeadsByStatus(column.id);
        const isDragOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-72"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={`rounded-lg border-2 transition-colors ${
              isDragOver ? `${column.borderColor} bg-muted/50` : "border-border bg-muted/30"
            }`}>
              {/* Column Header */}
              <div className="p-3 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${column.color}`} />
                    <h3 className="font-medium text-sm">{column.label}</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {columnLeads.length}
                  </Badge>
                </div>
              </div>

              {/* Column Content */}
              <ScrollArea className="h-[500px]">
                <div className="p-2 space-y-2">
                  {columnLeads.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Sem leads
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <Card
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onLeadSelect(lead)}
                        className={`cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${
                          selectedLead?.id === lead.id ? "ring-2 ring-primary" : ""
                        } ${draggedLead?.id === lead.id ? "opacity-50" : ""} ${
                          updatingLeadId === lead.id ? "opacity-70" : ""
                        }`}
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
                              <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
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
                            <div className="flex items-center gap-1">
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
