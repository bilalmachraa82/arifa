import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Loader2, 
  Trash2, 
  GripVertical,
  FileSearch,
  PenTool,
  HardHat,
  Sparkles,
  Key,
  CheckCircle2,
  Circle,
  Calendar,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Project {
  id: string;
  title: string;
  status: string | null;
}

interface Milestone {
  id: string;
  project_id: string;
  phase: string;
  name: string;
  description: string | null;
  target_date: string | null;
  completed_date: string | null;
  is_completed: boolean;
  sort_order: number;
}

const phaseConfig = {
  study: { name: "Estudo", icon: FileSearch },
  design: { name: "Projeto", icon: PenTool },
  construction: { name: "Construção", icon: HardHat },
  finishing: { name: "Finalização", icon: Sparkles },
  delivery: { name: "Entrega", icon: Key },
};

const AdminMilestones = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    phase: "study",
    name: "",
    description: "",
    target_date: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchMilestones();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, status")
      .not("client_id", "is", null)
      .order("title");

    if (!error && data) {
      setProjects(data);
      if (data.length > 0 && !selectedProject) {
        setSelectedProject(data[0].id);
      }
    }
    setLoading(false);
  };

  const fetchMilestones = async () => {
    if (!selectedProject) return;
    
    const { data, error } = await supabase
      .from("project_milestones")
      .select("*")
      .eq("project_id", selectedProject)
      .order("phase")
      .order("sort_order");

    if (!error) {
      setMilestones(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    setSaving(true);

    const maxSortOrder = milestones
      .filter(m => m.phase === formData.phase)
      .reduce((max, m) => Math.max(max, m.sort_order), -1);

    const { error } = await supabase.from("project_milestones").insert({
      project_id: selectedProject,
      phase: formData.phase,
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      target_date: formData.target_date || null,
      sort_order: maxSortOrder + 1,
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Milestone criado", description: "O milestone foi adicionado ao projeto." });
      setDialogOpen(false);
      setFormData({ phase: "study", name: "", description: "", target_date: "" });
      fetchMilestones();
    }
    setSaving(false);
  };

  const toggleComplete = async (milestone: Milestone) => {
    const { error } = await supabase
      .from("project_milestones")
      .update({
        is_completed: !milestone.is_completed,
        completed_date: !milestone.is_completed ? new Date().toISOString().split("T")[0] : null,
      })
      .eq("id", milestone.id);

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      fetchMilestones();
    }
  };

  const deleteMilestone = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este milestone?")) return;
    
    const { error } = await supabase.from("project_milestones").delete().eq("id", id);
    
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Milestone eliminado" });
      fetchMilestones();
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return format(new Date(dateStr), "d MMM yyyy", { locale: pt });
  };

  // Group milestones by phase
  const milestonesByPhase = Object.entries(phaseConfig).map(([phaseId, config]) => ({
    phaseId,
    ...config,
    milestones: milestones.filter(m => m.phase === phaseId),
  }));

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Milestones de Projetos</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Gerir etapas e datas de entrega dos projetos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={!selectedProject}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Milestone
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Milestone</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Fase *</Label>
                <Select 
                  value={formData.phase} 
                  onValueChange={(v) => setFormData({ ...formData, phase: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(phaseConfig).map(([key, { name, icon: Icon }]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Aprovação do projeto"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalhes sobre este milestone..."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Data Prevista</Label>
                <Input
                  type="date"
                  value={formData.target_date}
                  onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving || !formData.name}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Criar Milestone
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Project Selector */}
        <div className="space-y-2">
          <Label>Selecionar Projeto</Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Escolha um projeto..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2">
                    <span>{project.title}</span>
                    {project.status && (
                      <Badge variant="outline" className="text-xs">
                        {project.status}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !selectedProject ? (
          <p className="text-center text-muted-foreground py-8">
            Selecione um projeto para gerir os milestones
          </p>
        ) : (
          <div className="space-y-6">
            {milestonesByPhase.map(({ phaseId, name, icon: PhaseIcon, milestones: phaseMilestones }) => (
              <div key={phaseId} className="space-y-3">
                <div className="flex items-center gap-2">
                  <PhaseIcon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">{name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {phaseMilestones.filter(m => m.is_completed).length}/{phaseMilestones.length}
                  </Badge>
                </div>

                {phaseMilestones.length === 0 ? (
                  <p className="text-sm text-muted-foreground pl-7">
                    Nenhum milestone nesta fase
                  </p>
                ) : (
                  <div className="space-y-2 pl-7">
                    {phaseMilestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border"
                      >
                        <Checkbox
                          checked={milestone.is_completed}
                          onCheckedChange={() => toggleComplete(milestone)}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <p className={milestone.is_completed ? "line-through text-muted-foreground" : "font-medium"}>
                            {milestone.name}
                          </p>
                          {milestone.description && (
                            <p className="text-sm text-muted-foreground truncate">
                              {milestone.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {milestone.target_date && (
                            <Badge variant="outline" className="text-xs">
                              <Target className="h-3 w-3 mr-1" />
                              {formatDate(milestone.target_date)}
                            </Badge>
                          )}
                          {milestone.completed_date && (
                            <Badge className="text-xs bg-emerald-500">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {formatDate(milestone.completed_date)}
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => deleteMilestone(milestone.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMilestones;
