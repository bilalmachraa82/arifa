import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileSearch, 
  PenTool, 
  HardHat, 
  Key,
  Sparkles,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TimelinePhase {
  id: string;
  name: string;
  description: string;
  status: "completed" | "current" | "upcoming";
  icon: React.ElementType;
  milestones: Milestone[];
  estimatedDuration?: string;
}

interface Milestone {
  id: string;
  name: string;
  completed: boolean;
  date?: string;
}

interface ProjectTimelineProps {
  projectStatus: string | null;
  projectTitle: string;
}

const getPhaseFromStatus = (status: string | null): number => {
  switch (status) {
    case "Concluído":
      return 5;
    case "Em construção":
      return 3;
    case "Em projeto":
      return 2;
    case "Em estudo":
      return 1;
    default:
      return 0;
  }
};

const ProjectTimeline = ({ projectStatus, projectTitle }: ProjectTimelineProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const currentPhaseIndex = getPhaseFromStatus(projectStatus);

  const phases: TimelinePhase[] = [
    {
      id: "study",
      name: "Estudo",
      description: "Análise inicial e viabilidade do projeto",
      status: currentPhaseIndex >= 1 ? (currentPhaseIndex === 1 ? "current" : "completed") : "upcoming",
      icon: FileSearch,
      estimatedDuration: "2-4 semanas",
      milestones: [
        { id: "m1", name: "Reunião inicial", completed: currentPhaseIndex >= 1 },
        { id: "m2", name: "Análise do terreno", completed: currentPhaseIndex >= 1 },
        { id: "m3", name: "Estudo de viabilidade", completed: currentPhaseIndex >= 1 },
        { id: "m4", name: "Proposta comercial", completed: currentPhaseIndex >= 1 },
      ],
    },
    {
      id: "design",
      name: "Projeto",
      description: "Desenvolvimento do projeto de arquitetura",
      status: currentPhaseIndex >= 2 ? (currentPhaseIndex === 2 ? "current" : "completed") : "upcoming",
      icon: PenTool,
      estimatedDuration: "4-8 semanas",
      milestones: [
        { id: "m5", name: "Estudo prévio", completed: currentPhaseIndex >= 2 },
        { id: "m6", name: "Anteprojeto", completed: currentPhaseIndex >= 2 },
        { id: "m7", name: "Projeto de execução", completed: currentPhaseIndex > 2 },
        { id: "m8", name: "Licenciamento", completed: currentPhaseIndex > 2 },
      ],
    },
    {
      id: "construction",
      name: "Construção",
      description: "Execução da obra",
      status: currentPhaseIndex >= 3 ? (currentPhaseIndex === 3 ? "current" : "completed") : "upcoming",
      icon: HardHat,
      estimatedDuration: "6-12 meses",
      milestones: [
        { id: "m9", name: "Preparação do terreno", completed: currentPhaseIndex >= 3 },
        { id: "m10", name: "Estrutura", completed: currentPhaseIndex > 3 },
        { id: "m11", name: "Acabamentos", completed: currentPhaseIndex > 3 },
        { id: "m12", name: "Instalações", completed: currentPhaseIndex > 3 },
      ],
    },
    {
      id: "finishing",
      name: "Finalização",
      description: "Acabamentos finais e verificações",
      status: currentPhaseIndex >= 4 ? (currentPhaseIndex === 4 ? "current" : "completed") : "upcoming",
      icon: Sparkles,
      estimatedDuration: "2-4 semanas",
      milestones: [
        { id: "m13", name: "Limpeza final", completed: currentPhaseIndex >= 5 },
        { id: "m14", name: "Inspeções", completed: currentPhaseIndex >= 5 },
        { id: "m15", name: "Correções finais", completed: currentPhaseIndex >= 5 },
      ],
    },
    {
      id: "delivery",
      name: "Entrega",
      description: "Entrega das chaves e documentação",
      status: currentPhaseIndex >= 5 ? "completed" : "upcoming",
      icon: Key,
      estimatedDuration: "1 semana",
      milestones: [
        { id: "m16", name: "Vistoria final", completed: currentPhaseIndex >= 5 },
        { id: "m17", name: "Entrega de documentação", completed: currentPhaseIndex >= 5 },
        { id: "m18", name: "Entrega das chaves", completed: currentPhaseIndex >= 5 },
      ],
    },
  ];

  // Calculate progress percentage
  const completedPhases = phases.filter(p => p.status === "completed").length;
  const totalPhases = phases.length;
  const targetProgress = (completedPhases / totalPhases) * 100;

  // Animate progress bar
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(targetProgress);
    }, 300);
    return () => clearTimeout(timer);
  }, [targetProgress]);

  const getStatusColor = (status: TimelinePhase["status"]) => {
    switch (status) {
      case "completed":
        return "text-[hsl(142,42%,45%)]";
      case "current":
        return "text-accent";
      case "upcoming":
        return "text-muted-foreground";
    }
  };

  const getStatusBgColor = (status: TimelinePhase["status"]) => {
    switch (status) {
      case "completed":
        return "bg-[hsl(142,42%,45%)]";
      case "current":
        return "bg-accent";
      case "upcoming":
        return "bg-muted";
    }
  };

  const getStatusIcon = (status: TimelinePhase["status"]) => {
    switch (status) {
      case "completed":
        return CheckCircle2;
      case "current":
        return Clock;
      case "upcoming":
        return Circle;
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Timeline do Projeto</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{projectTitle}</p>
          </div>
          <Badge 
            variant={projectStatus === "Concluído" ? "default" : "secondary"}
            className="text-sm"
          >
            {projectStatus || "Em análise"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso geral</span>
            <span className="font-medium">{Math.round(animatedProgress)}%</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-[hsl(142,42%,45%)] transition-all duration-1000 ease-out"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        </div>

        {/* Timeline Phases */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between mb-4">
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
          
          <CollapsibleContent>
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
              
              <div className="space-y-6">
                {phases.map((phase, index) => {
                  const StatusIcon = getStatusIcon(phase.status);
                  const PhaseIcon = phase.icon;
                  const isLast = index === phases.length - 1;
                  
                  return (
                    <div
                      key={phase.id}
                      className={cn(
                        "relative pl-14 animate-fade-in",
                        phase.status === "current" && "opacity-100",
                        phase.status === "upcoming" && "opacity-60"
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Phase Icon Circle */}
                      <div
                        className={cn(
                          "absolute left-3 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300",
                          getStatusBgColor(phase.status),
                          phase.status === "current" && "ring-4 ring-accent/20 animate-pulse"
                        )}
                      >
                        {phase.status === "completed" ? (
                          <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
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
                        phase.status === "current" && "border-accent shadow-md"
                      )}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className={cn(
                              "font-semibold",
                              getStatusColor(phase.status)
                            )}>
                              {phase.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {phase.description}
                            </p>
                          </div>
                          {phase.estimatedDuration && (
                            <Badge variant="outline" className="text-xs whitespace-nowrap ml-2">
                              {phase.estimatedDuration}
                            </Badge>
                          )}
                        </div>

                        {/* Milestones */}
                        <div className="mt-3 space-y-2">
                          {phase.milestones.map((milestone) => (
                            <div
                              key={milestone.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              {milestone.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-[hsl(142,42%,45%)] flex-shrink-0" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              )}
                              <span className={cn(
                                milestone.completed ? "text-foreground" : "text-muted-foreground"
                              )}>
                                {milestone.name}
                              </span>
                              {milestone.date && (
                                <span className="text-xs text-muted-foreground ml-auto">
                                  {milestone.date}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Phase Summary (when collapsed) */}
        {!isExpanded && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {phases.map((phase, index) => {
              const PhaseIcon = phase.icon;
              return (
                <div
                  key={phase.id}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full text-sm whitespace-nowrap transition-all",
                    phase.status === "completed" && "bg-[hsl(142,42%,45%)]/10 text-[hsl(142,42%,45%)]",
                    phase.status === "current" && "bg-accent/10 text-accent ring-2 ring-accent/20",
                    phase.status === "upcoming" && "bg-muted text-muted-foreground"
                  )}
                >
                  <PhaseIcon className="h-4 w-4" />
                  <span>{phase.name}</span>
                  {phase.status === "completed" && (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
