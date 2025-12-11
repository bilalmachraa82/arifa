import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Mail, Phone, Calendar, Building2, Download, Sparkles, TrendingUp, LayoutGrid, List, History } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LeadsKanban from "./LeadsKanban";
import LeadActivities from "./LeadActivities";

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

const statusOptions = [
  { value: "new", label: "Novo", color: "bg-blue-500" },
  { value: "contacted", label: "Contactado", color: "bg-yellow-500" },
  { value: "qualified", label: "Qualificado", color: "bg-green-500" },
  { value: "converted", label: "Convertido", color: "bg-purple-500" },
  { value: "lost", label: "Perdido", color: "bg-red-500" },
];

const AdminLeads = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [scoringLeadId, setScoringLeadId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leads:", error);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (leadId: string, status: string) => {
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", leadId);

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchLeads();
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string | null) => {
    const statusInfo = statusOptions.find(s => s.value === status) || statusOptions[0];
    return (
      <Badge variant="outline" className="gap-1">
        <span className={`w-2 h-2 rounded-full ${statusInfo.color}`} />
        {statusInfo.label}
      </Badge>
    );
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
      <Badge className={`${bgColor} ${textColor} gap-1 border-0`}>
        <TrendingUp className="h-3 w-3" />
        {score}
      </Badge>
    );
  };

  const scoreLead = async (leadId: string) => {
    setScoringLeadId(leadId);
    
    try {
      const { data, error } = await supabase.functions.invoke('score-lead', {
        body: { leadId }
      });

      if (error) throw error;

      toast({
        title: "Lead classificado",
        description: `Score: ${data.score}/100 - ${data.reason}`,
      });

      fetchLeads();
      
      // Update selected lead if it's the one being scored
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => prev ? {
          ...prev,
          ai_score: data.score,
          ai_score_reason: data.reason,
          ai_scored_at: data.scoredAt
        } : null);
      }
    } catch (error: any) {
      console.error('Error scoring lead:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível classificar o lead.",
        variant: "destructive",
      });
    } finally {
      setScoringLeadId(null);
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;

    const headers = ["Nome", "Email", "Telefone", "Segmento", "Serviço", "Mensagem", "Estado", "AI Score", "Fonte", "Data"];
    const csvContent = [
      headers.join(";"),
      ...leads.map(lead => [
        `"${lead.name}"`,
        `"${lead.email}"`,
        `"${lead.phone || ""}"`,
        `"${lead.segment || ""}"`,
        `"${lead.service || ""}"`,
        `"${lead.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${statusOptions.find(s => s.value === lead.status)?.label || "Novo"}"`,
        `"${lead.ai_score || ""}"`,
        `"${lead.source || "website"}"`,
        `"${formatDate(lead.created_at)}"`
      ].join(";"))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_arifa_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportação concluída",
      description: `${leads.length} leads exportados para CSV.`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <CardTitle>Leads / Contactos</CardTitle>
        <div className="flex items-center gap-3">
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "kanban")}>
            <TabsList className="h-9">
              <TabsTrigger value="kanban" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="table" className="gap-2">
                <List className="h-4 w-4" />
                Tabela
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={exportToCSV} disabled={leads.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : leads.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum lead registado.
          </p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Leads List / Kanban */}
            <div className={viewMode === "kanban" ? "lg:col-span-3 xl:col-span-2" : "lg:col-span-2"}>
              {viewMode === "kanban" ? (
                <LeadsKanban
                  leads={leads}
                  onLeadSelect={setSelectedLead}
                  selectedLead={selectedLead}
                  onRefresh={fetchLeads}
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Contacto</TableHead>
                      <TableHead>Segmento</TableHead>
                      <TableHead>AI Score</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow 
                        key={lead.id} 
                        className={`cursor-pointer ${selectedLead?.id === lead.id ? "bg-muted" : ""}`}
                        onClick={() => setSelectedLead(lead)}
                      >
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {lead.email}
                            </span>
                            {lead.phone && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {lead.phone}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.segment && <Badge variant="outline">{lead.segment}</Badge>}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getScoreBadge(lead.ai_score)}
                            {!lead.ai_score && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  scoreLead(lead.id);
                                }}
                                disabled={scoringLeadId === lead.id}
                              >
                                {scoringLeadId === lead.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Sparkles className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={lead.status || "new"}
                            onValueChange={(v) => updateStatus(lead.id, v)}
                          >
                            <SelectTrigger className="w-32" onClick={(e) => e.stopPropagation()}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  <span className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${status.color}`} />
                                    {status.label}
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(lead.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Lead Detail */}
            <div className="lg:col-span-1">
              {selectedLead ? (
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg">{selectedLead.name}</CardTitle>
                    {getStatusBadge(selectedLead.status)}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <a href={`mailto:${selectedLead.email}`} className="hover:underline">
                          {selectedLead.email}
                        </a>
                      </div>
                      {selectedLead.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <a href={`tel:${selectedLead.phone}`} className="hover:underline">
                            {selectedLead.phone}
                          </a>
                        </div>
                      )}
                      {selectedLead.segment && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {selectedLead.segment}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(selectedLead.created_at)}
                      </div>
                    </div>

                    {selectedLead.service && (
                      <div>
                        <p className="text-sm font-medium mb-1">Serviço de interesse:</p>
                        <Badge variant="secondary">{selectedLead.service}</Badge>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium mb-2">Mensagem:</p>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg whitespace-pre-wrap">
                        {selectedLead.message}
                      </p>
                    </div>

                    {/* AI Score Section */}
                    {selectedLead.ai_score ? (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            AI Score
                          </p>
                          {getScoreBadge(selectedLead.ai_score)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedLead.ai_score_reason}
                        </p>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => scoreLead(selectedLead.id)}
                        disabled={scoringLeadId === selectedLead.id}
                      >
                        {scoringLeadId === selectedLead.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Classificar com AI
                      </Button>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" asChild>
                        <a href={`mailto:${selectedLead.email}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Enviar Email
                        </a>
                      </Button>
                      {selectedLead.phone && (
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${selectedLead.phone}`}>
                            <Phone className="mr-2 h-4 w-4" />
                            Ligar
                          </a>
                        </Button>
                      )}
                    </div>

                    <Separator className="my-4" />

                    {/* Lead Activities Timeline */}
                    <LeadActivities leadId={selectedLead.id} leadName={selectedLead.name} />
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-center">
                      Selecione um lead para ver os detalhes
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminLeads;
