import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Search, FileText, HardHat, Paintbrush, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MilestoneCard } from "./MilestoneCard";
import { cn } from "@/lib/utils";

interface Milestone {
  id: string;
  name: string;
  description: string | null;
  phase: string;
  target_date: string | null;
  completed_date: string | null;
  is_completed: boolean;
  sort_order: number;
  project_id: string;
}

interface Project {
  id: string;
  title: string;
}

const phaseConfig: Record<string, { name: string; icon: any; color: string; bgColor: string }> = {
  study: { 
    name: "Estudo", 
    icon: Search, 
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
  },
  design: { 
    name: "Projeto", 
    icon: FileText, 
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800"
  },
  construction: { 
    name: "Construção", 
    icon: HardHat, 
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800"
  },
  finishing: { 
    name: "Finalização", 
    icon: Paintbrush, 
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800"
  },
  delivery: { 
    name: "Entrega", 
    icon: CheckCircle, 
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
  },
};

const phases = ["study", "design", "construction", "finishing", "delivery"];

export function MilestonesKanban() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    name: "",
    description: "",
    phase: "study",
    target_date: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchMilestones();
      
      // Subscribe to realtime updates
      const channel = supabase
        .channel(`milestones-${selectedProject}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'project_milestones',
            filter: `project_id=eq.${selectedProject}`,
          },
          () => {
            fetchMilestones();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedProject]);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("id, title")
      .not("client_id", "is", null)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar projetos");
      console.error(error);
    } else {
      setProjects(data || []);
      if (data && data.length > 0 && !selectedProject) {
        setSelectedProject(data[0].id);
      }
    }
    setLoading(false);
  }

  async function fetchMilestones() {
    if (!selectedProject) return;

    const { data, error } = await supabase
      .from("project_milestones")
      .select("*")
      .eq("project_id", selectedProject)
      .order("phase")
      .order("sort_order");

    if (error) {
      toast.error("Erro ao carregar milestones");
      console.error(error);
    } else {
      setMilestones(data || []);
    }
  }

  function getMilestonesByPhase(phase: string) {
    return milestones
      .filter((m) => m.phase === phase)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeMilestone = milestones.find((m) => m.id === activeId);
    if (!activeMilestone) return;

    // Check if dropped on a phase column
    if (phases.includes(overId)) {
      // Move to new phase
      if (activeMilestone.phase !== overId) {
        const targetMilestones = getMilestonesByPhase(overId);
        const newSortOrder = targetMilestones.length;

        const { error } = await supabase
          .from("project_milestones")
          .update({ phase: overId, sort_order: newSortOrder })
          .eq("id", activeId);

        if (error) {
          toast.error("Erro ao mover milestone");
          console.error(error);
        } else {
          toast.success(`Milestone movido para ${phaseConfig[overId].name}`);
        }
      }
    } else {
      // Reorder within the same phase or move to another milestone's position
      const overMilestone = milestones.find((m) => m.id === overId);
      if (!overMilestone) return;

      if (activeMilestone.phase === overMilestone.phase) {
        // Same phase - reorder
        const phaseMilestones = getMilestonesByPhase(activeMilestone.phase);
        const oldIndex = phaseMilestones.findIndex((m) => m.id === activeId);
        const newIndex = phaseMilestones.findIndex((m) => m.id === overId);

        const reordered = arrayMove(phaseMilestones, oldIndex, newIndex);
        
        // Update sort_order for all affected milestones
        for (let i = 0; i < reordered.length; i++) {
          if (reordered[i].sort_order !== i) {
            await supabase
              .from("project_milestones")
              .update({ sort_order: i })
              .eq("id", reordered[i].id);
          }
        }
        
        fetchMilestones();
      } else {
        // Different phase - move to that phase
        const targetMilestones = getMilestonesByPhase(overMilestone.phase);
        const newIndex = targetMilestones.findIndex((m) => m.id === overId);

        const { error } = await supabase
          .from("project_milestones")
          .update({ phase: overMilestone.phase, sort_order: newIndex })
          .eq("id", activeId);

        if (error) {
          toast.error("Erro ao mover milestone");
          console.error(error);
        } else {
          toast.success(`Milestone movido para ${phaseConfig[overMilestone.phase].name}`);
        }
      }
    }
  }

  async function handleToggleComplete(id: string, completed: boolean) {
    const { error } = await supabase
      .from("project_milestones")
      .update({ 
        is_completed: completed,
        completed_date: completed ? new Date().toISOString().split("T")[0] : null
      })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar milestone");
      console.error(error);
    } else {
      toast.success(completed ? "Milestone concluído!" : "Milestone reaberto");
      
      // Send notification if completed
      if (completed) {
        try {
          await supabase.functions.invoke("send-milestone-notification", {
            body: { type: "completed", milestoneId: id },
          });
        } catch (e) {
          console.error("Error sending notification:", e);
        }
      }
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja eliminar este milestone?")) return;

    const { error } = await supabase
      .from("project_milestones")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao eliminar milestone");
      console.error(error);
    } else {
      toast.success("Milestone eliminado");
    }
  }

  async function handleAddMilestone() {
    if (!newMilestone.name.trim() || !selectedProject) return;

    const phaseMilestones = getMilestonesByPhase(newMilestone.phase);
    const sortOrder = phaseMilestones.length;

    const { error } = await supabase
      .from("project_milestones")
      .insert({
        project_id: selectedProject,
        name: newMilestone.name,
        description: newMilestone.description || null,
        phase: newMilestone.phase,
        target_date: newMilestone.target_date || null,
        sort_order: sortOrder,
      });

    if (error) {
      toast.error("Erro ao criar milestone");
      console.error(error);
    } else {
      toast.success("Milestone criado!");
      setNewMilestone({ name: "", description: "", phase: "study", target_date: "" });
      setDialogOpen(false);
    }
  }

  const activeMilestone = activeId ? milestones.find((m) => m.id === activeId) : null;

  if (loading) {
    return <div className="flex items-center justify-center p-8">A carregar...</div>;
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">
          Não existem projetos com clientes atribuídos.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Atribua um cliente a um projeto para usar o Kanban de milestones.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Selecionar projeto" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Milestone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={newMilestone.name}
                  onChange={(e) => setNewMilestone({ ...newMilestone, name: e.target.value })}
                  placeholder="Nome do milestone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phase">Fase</Label>
                <Select
                  value={newMilestone.phase}
                  onValueChange={(value) => setNewMilestone({ ...newMilestone, phase: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {phases.map((phase) => (
                      <SelectItem key={phase} value={phase}>
                        {phaseConfig[phase].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
                  placeholder="Descrição opcional"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target_date">Data Limite</Label>
                <Input
                  id="target_date"
                  type="date"
                  value={newMilestone.target_date}
                  onChange={(e) => setNewMilestone({ ...newMilestone, target_date: e.target.value })}
                />
              </div>
              <Button onClick={handleAddMilestone} className="w-full">
                Criar Milestone
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {phases.map((phase) => {
            const config = phaseConfig[phase];
            const phaseMilestones = getMilestonesByPhase(phase);
            const Icon = config.icon;
            const completedCount = phaseMilestones.filter((m) => m.is_completed).length;

            return (
              <div
                key={phase}
                className={cn(
                  "rounded-lg border p-3 min-h-[400px] flex flex-col",
                  config.bgColor
                )}
              >
                {/* Column Header */}
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                  <Icon className={cn("h-4 w-4", config.color)} />
                  <span className="font-medium text-sm">{config.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {completedCount}/{phaseMilestones.length}
                  </span>
                </div>

                {/* Milestones */}
                <ScrollArea className="flex-1">
                  <SortableContext
                    items={phaseMilestones.map((m) => m.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 pr-2">
                      {phaseMilestones.map((milestone) => (
                        <MilestoneCard
                          key={milestone.id}
                          milestone={milestone}
                          onToggleComplete={handleToggleComplete}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  
                  {phaseMilestones.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Sem milestones
                    </div>
                  )}
                </ScrollArea>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeMilestone && (
            <div className="bg-card border rounded-lg p-3 shadow-lg opacity-90">
              <p className="font-medium text-sm">{activeMilestone.name}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
