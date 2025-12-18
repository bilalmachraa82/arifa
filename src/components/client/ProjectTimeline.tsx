import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  FileSearch, 
  PenTool, 
  HardHat, 
  Key,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Layers,
  FileText,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format, isPast, isToday, differenceInDays } from "date-fns";
import { pt } from "date-fns/locale";

interface Milestone {
  id: string;
  name: string;
  description: string | null;
  phase: string;
  target_date: string | null;
  completed_date: string | null;
  is_completed: boolean;
  sort_order: number;
}

interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  ribaStage: string;
  status: "completed" | "current" | "upcoming";
  icon: React.ElementType;
  milestones: Milestone[];
  estimatedDuration?: string;
}

interface ProjectTimelineProps {
  projectId?: string;
  projectStatus: string | null;
  projectTitle: string;
}

// RIBA Plan of Work 2020 adapted phases
const phaseConfig = {
  preparacao: { 
    name: "Preparação", 
    ribaStage: "RIBA 0+1",
    icon: FileSearch, 
    duration: "2-4 semanas" 
  },
  conceito: { 
    name: "Conceito", 
    ribaStage: "RIBA 2",
    icon: Lightbulb, 
    duration: "3-6 semanas" 
  },
  coordenacao: { 
    name: "Coordenação", 
    ribaStage: "RIBA 3",
    icon: Layers, 
    duration: "4-8 semanas" 
  },
  tecnico: { 
    name: "Técnico", 
    ribaStage: "RIBA 4",
    icon: FileText, 
    duration: "6-10 semanas" 
  },
  construcao: { 
    name: "Construção", 
    ribaStage: "RIBA 5",
    icon: HardHat, 
    duration: "6-18 meses" 
  },
  entrega: { 
    name: "Entrega", 
    ribaStage: "RIBA 6",
    icon: Key, 
    duration: "2-4 semanas" 
  },
  uso: { 
    name: "Uso", 
    ribaStage: "RIBA 7",
    icon: Home, 
    duration: "12 meses" 
  },
};

const phaseDescriptions = {
  preparacao: "Definição estratégica e brief do projeto",
  conceito: "Design conceptual e linguagem visual",
  coordenacao: "Coordenação espacial e especialidades",
  tecnico: "Projeto técnico e licenciamento",
  construcao: "Execução da obra",
  entrega: "Handover e documentação final",
  uso: "Acompanhamento pós-ocupação",
};

const defaultMilestones: Record<string, { name: string; description: string }[]> = {
  preparacao: [
    { name: "Reunião inicial", description: "Levantamento de requisitos e expectativas" },
    { name: "Análise do terreno/espaço", description: "Visita técnica e avaliação do local" },
    { name: "Estudo de viabilidade", description: "Análise técnica e financeira" },
    { name: "Brief do projeto", description: "Documentação de requisitos aprovada" },
  ],
  conceito: [
    { name: "Estudo prévio", description: "Conceito e ideias iniciais" },
    { name: "Moodboards e referências", description: "Definição da linguagem visual" },
    { name: "Proposta conceptual", description: "Apresentação do conceito ao cliente" },
  ],
  coordenacao: [
    { name: "Anteprojeto", description: "Desenvolvimento da proposta espacial" },
    { name: "Coordenação de especialidades", description: "Alinhamento com engenharias" },
    { name: "Validação do cliente", description: "Aprovação do anteprojeto" },
  ],
  tecnico: [
    { name: "Projeto de execução", description: "Detalhes técnicos completos" },
    { name: "Mapas de acabamentos", description: "Especificação de materiais" },
    { name: "Licenciamento", description: "Submissão às autoridades" },
    { name: "Caderno de encargos", description: "Documentação para empreiteiros" },
  ],
  construcao: [
    { name: "Preparação do terreno", description: "Demolições e fundações" },
    { name: "Estrutura", description: "Construção estrutural" },
    { name: "Toscos", description: "Paredes e cobertura" },
    { name: "Instalações técnicas", description: "Elétrica, canalização, AVAC" },
    { name: "Acabamentos", description: "Revestimentos e detalhes" },
  ],
  entrega: [
    { name: "Limpeza final", description: "Preparação para entrega" },
    { name: "Inspeções finais", description: "Verificações de qualidade" },
    { name: "Correções e afinações", description: "Ajustes identificados" },
    { name: "Entrega das chaves", description: "Handover formal ao cliente" },
  ],
  uso: [
    { name: "Manual de utilização", description: "Documentação de manutenção" },
    { name: "Visita 3 meses", description: "Acompanhamento pós-ocupação" },
    { name: "Visita 12 meses", description: "Avaliação final e garantias" },
  ],
};

const getPhaseFromStatus = (status: string | null): number => {
  switch (status) {
    case "Concluído": return 7;
    case "Em uso": return 7;
    case "Em entrega": return 6;
    case "Em construção": return 5;
    case "Em projeto técnico": return 4;
    case "Em coordenação": return 3;
    case "Em projeto": return 2;
    case "Em conceito": return 2;
    case "Em estudo": return 1;
    case "Em preparação": return 1;
    default: return 0;
  }
};

const ProjectTimeline = ({ projectId, projectStatus, projectTitle }: ProjectTimelineProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [dbMilestones, setDbMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(false);
  
  const currentPhaseIndex = getPhaseFromStatus(projectStatus);

  useEffect(() => {
    if (projectId) {
      fetchMilestones();
      
      const channel = supabase
        .channel(`milestones-${projectId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'project_milestones',
            filter: `project_id=eq.${projectId}`
          },
          () => fetchMilestones()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [projectId]);

  const fetchMilestones = async () => {
    if (!projectId) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from("project_milestones")
      .select("*")
      .eq("project_id", projectId)
      .order("phase")
      .order("sort_order");

    if (!error && data) {
      setDbMilestones(data);
    }
    setLoading(false);
  };

  const phases: TimelinePhase[] = Object.entries(phaseConfig).map(([phaseId, config], index) => {
    const phaseNumber = index + 1;
    const phaseMilestones = dbMilestones.filter(m => m.phase === phaseId);
    
    const milestones: Milestone[] = phaseMilestones.length > 0
      ? phaseMilestones
      : (defaultMilestones[phaseId] || []).map((m, i) => ({
          id: `default-${phaseId}-${i}`,
          name: m.name,
          description: m.description,
          phase: phaseId,
          target_date: null,
          completed_date: null,
          is_completed: currentPhaseIndex > phaseNumber || 
            (currentPhaseIndex === phaseNumber && i < 2),
          sort_order: i,
        }));

    const allCompleted = milestones.length > 0 && milestones.every(m => m.is_completed);
    const anyCompleted = milestones.some(m => m.is_completed);

    let status: "completed" | "current" | "upcoming";
    if (allCompleted && currentPhaseIndex >= phaseNumber) {
      status = "completed";
    } else if (anyCompleted || currentPhaseIndex === phaseNumber) {
      status = "current";
    } else {
      status = "upcoming";
    }

    return {
      id: phaseId,
      name: config.name,
      ribaStage: config.ribaStage,
      description: phaseDescriptions[phaseId as keyof typeof phaseDescriptions],
      status,
      icon: config.icon,
      milestones,
      estimatedDuration: config.duration,
    };
  });

  const totalMilestones = phases.reduce((acc, p) => acc + p.milestones.length, 0);
  const completedMilestones = phases.reduce(
    (acc, p) => acc + p.milestones.filter(m => m.is_completed).length, 
    0
  );
  const targetProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(targetProgress);
    }, 300);
    return () => clearTimeout(timer);
  }, [targetProgress]);

  const getStatusColor = (status: TimelinePhase["status"]) => {
    switch (status) {
      case "completed": return "text-emerald-600 dark:text-emerald-400";
      case "current": return "text-accent";
      case "upcoming": return "text-muted-foreground";
    }
  };

  const getStatusBgColor = (status: TimelinePhase["status"]) => {
    switch (status) {
      case "completed": return "bg-emerald-600 dark:bg-emerald-500";
      case "current": return "bg-accent";
      case "upcoming": return "bg-muted";
    }
  };

  const formatMilestoneDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return format(new Date(dateStr), "d MMM yyyy", { locale: pt });
  };

  const getMilestoneDateStatus = (targetDate: string | null, isCompleted: boolean) => {
    if (!targetDate || isCompleted) return null;
    const date = new Date(targetDate);
    const daysUntil = differenceInDays(date, new Date());
    
    if (isPast(date) && !isToday(date)) {
      return { status: "overdue", text: "Atrasado", className: "text-destructive" };
    } else if (daysUntil <= 7) {
      return { status: "soon", text: `${daysUntil}d`, className: "text-amber-500" };
    }
    return null;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Timeline do Projeto</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{projectTitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              RIBA Plan of Work
            </Badge>
            <Badge 
              variant={projectStatus === "Concluído" ? "default" : "secondary"}
              className="text-sm"
            >
              {projectStatus || "Em análise"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Progresso geral ({completedMilestones}/{totalMilestones} milestones)
            </span>
            <span className="font-medium">{Math.round(animatedProgress)}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-500 transition-all duration-1000 ease-out"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </div>

        {/* Phase Pills (Quick View) - 7 RIBA phases */}
        <TooltipProvider>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {phases.map((phase) => {
              const PhaseIcon = phase.icon;
              const completedInPhase = phase.milestones.filter(m => m.is_completed).length;
              const totalInPhase = phase.milestones.length;
              
              return (
                <Tooltip key={phase.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer hover:scale-105",
                        phase.status === "completed" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                        phase.status === "current" && "bg-accent/10 text-accent ring-2 ring-accent/30",
                        phase.status === "upcoming" && "bg-muted text-muted-foreground"
                      )}
                    >
                      <PhaseIcon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{phase.name}</span>
                      {phase.status !== "upcoming" && (
                        <span className="text-[10px] opacity-70">
                          {completedInPhase}/{totalInPhase}
                        </span>
                      )}
                      {phase.status === "completed" && (
                        <CheckCircle2 className="h-3 w-3" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{phase.name}</p>
                    <p className="text-xs text-accent">{phase.ribaStage}</p>
                    <p className="text-xs text-muted-foreground">{phase.description}</p>
                    <p className="text-xs mt-1">{completedInPhase} de {totalInPhase} concluídos</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        {/* Timeline Phases */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="text-sm font-medium">
                {isExpanded ? "Esconder detalhes" : "Ver detalhes das fases"}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4">
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-emerald-500/50 to-muted" />
              
              <div className="space-y-6">
                {phases.map((phase, phaseIndex) => {
                  const PhaseIcon = phase.icon;
                  
                  return (
                    <div
                      key={phase.id}
                      className={cn(
                        "relative pl-14 animate-fade-in",
                        phase.status === "upcoming" && "opacity-60"
                      )}
                      style={{ animationDelay: `${phaseIndex * 100}ms` }}
                    >
                      {/* Phase Icon Circle */}
                      <div
                        className={cn(
                          "absolute left-3 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 z-10",
                          getStatusBgColor(phase.status),
                          phase.status === "current" && "ring-4 ring-accent/20"
                        )}
                      >
                        {phase.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        ) : (
                          <PhaseIcon className={cn(
                            "h-4 w-4",
                            phase.status === "current" ? "text-accent-foreground" : "text-muted-foreground"
                          )} />
                        )}
                      </div>

                      {/* Phase Content */}
                      <div className={cn(
                        "bg-card border rounded-lg p-4 transition-all duration-300",
                        phase.status === "current" && "border-accent shadow-lg shadow-accent/5"
                      )}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className={cn("font-semibold text-base", getStatusColor(phase.status))}>
                                {phase.name}
                              </h4>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {phase.ribaStage}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {phase.description}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs whitespace-nowrap ml-2">
                            <Clock className="h-3 w-3 mr-1" />
                            {phase.estimatedDuration}
                          </Badge>
                        </div>

                        {/* Milestones Grid */}
                        <div className="grid gap-2 mt-3">
                          {phase.milestones.map((milestone) => {
                            const dateStatus = getMilestoneDateStatus(milestone.target_date, milestone.is_completed);
                            
                            return (
                              <div
                                key={milestone.id}
                                className={cn(
                                  "flex items-center gap-3 p-2 rounded-md transition-all",
                                  milestone.is_completed 
                                    ? "bg-emerald-500/5" 
                                    : "bg-muted/30 hover:bg-muted/50"
                                )}
                              >
                                <div className={cn(
                                  "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                                  milestone.is_completed 
                                    ? "bg-emerald-500" 
                                    : "border-2 border-muted-foreground/30"
                                )}>
                                  {milestone.is_completed && (
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <p className={cn(
                                    "text-sm font-medium",
                                    milestone.is_completed 
                                      ? "text-foreground" 
                                      : "text-muted-foreground"
                                  )}>
                                    {milestone.name}
                                  </p>
                                  {milestone.description && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      {milestone.description}
                                    </p>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {dateStatus && (
                                    <Badge variant="outline" className={cn("text-xs", dateStatus.className)}>
                                      {dateStatus.text}
                                    </Badge>
                                  )}
                                  {milestone.target_date && (
                                    <span className="text-xs text-muted-foreground">
                                      {formatMilestoneDate(milestone.target_date)}
                                    </span>
                                  )}
                                  {milestone.completed_date && (
                                    <span className="text-xs text-emerald-600">
                                      ✓ {formatMilestoneDate(milestone.completed_date)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
