import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Star,
  StarOff,
  Camera,
  Calendar,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Photo {
  id: string;
  project_id: string;
  milestone_id: string | null;
  title: string | null;
  description: string | null;
  image_url: string;
  thumbnail_url: string | null;
  phase: string | null;
  taken_at: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  client_id: string | null;
}

interface Milestone {
  id: string;
  name: string;
  phase: string;
}

const phases = [
  { value: "preparacao", label: "Preparação" },
  { value: "conceito", label: "Conceito" },
  { value: "coordenacao", label: "Coordenação" },
  { value: "tecnico", label: "Técnico" },
  { value: "construcao", label: "Construção" },
  { value: "entrega", label: "Entrega" },
  { value: "uso", label: "Uso" },
];

export default function AdminProjectPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    milestone_id: "",
    phase: "",
    taken_at: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchPhotos();
      fetchMilestones();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("id, title, client_id")
      .not("client_id", "is", null)
      .order("created_at", { ascending: false });
    
    setProjects(data || []);
    if (data && data.length > 0) {
      setSelectedProject(data[0].id);
    }
    setLoading(false);
  };

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("project_photos")
      .select("*")
      .eq("project_id", selectedProject)
      .order("sort_order");

    if (!error) {
      setPhotos(data || []);
    }
  };

  const fetchMilestones = async () => {
    const { data } = await supabase
      .from("project_milestones")
      .select("id, name, phase")
      .eq("project_id", selectedProject)
      .order("phase")
      .order("sort_order");
    
    setMilestones(data || []);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !selectedProject) {
      toast.error("Selecione pelo menos uma imagem");
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split(".").pop();
        const fileName = `${selectedProject}/${Date.now()}-${i}.${fileExt}`;

        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("project-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("project-images")
          .getPublicUrl(fileName);

        // Save to database
        await supabase.from("project_photos").insert({
          project_id: selectedProject,
          title: formData.title || file.name,
          description: formData.description || null,
          milestone_id: formData.milestone_id || null,
          phase: formData.phase || null,
          taken_at: formData.taken_at || null,
          image_url: urlData.publicUrl,
          sort_order: photos.length + i,
        });
      }

      toast.success(`${selectedFiles.length} foto(s) carregada(s) com sucesso`);
      setDialogOpen(false);
      resetForm();
      fetchPhotos();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erro ao carregar fotos");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      milestone_id: "",
      phase: "",
      taken_at: "",
    });
    setSelectedFiles(null);
  };

  const handleDelete = async (photo: Photo) => {
    if (!confirm("Tem a certeza que deseja eliminar esta foto?")) return;

    // Delete from storage
    const fileName = photo.image_url.split("/").pop();
    if (fileName) {
      await supabase.storage
        .from("project-images")
        .remove([`${selectedProject}/${fileName}`]);
    }

    // Delete from database
    const { error } = await supabase
      .from("project_photos")
      .delete()
      .eq("id", photo.id);

    if (error) {
      toast.error("Erro ao eliminar foto");
    } else {
      toast.success("Foto eliminada");
      fetchPhotos();
    }
  };

  const toggleFeatured = async (photo: Photo) => {
    const { error } = await supabase
      .from("project_photos")
      .update({ is_featured: !photo.is_featured })
      .eq("id", photo.id);

    if (error) {
      toast.error("Erro ao atualizar foto");
    } else {
      fetchPhotos();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Galeria de Progresso
        </CardTitle>
        <div className="flex items-center gap-3">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Selecionar projeto..." />
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
              <Button disabled={!selectedProject}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Fotos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Fotos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Imagens *</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setSelectedFiles(e.target.files)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pode selecionar múltiplas imagens
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título da foto..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Fase</Label>
                    <Select
                      value={formData.phase}
                      onValueChange={(value) => setFormData({ ...formData, phase: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {phases.map((phase) => (
                          <SelectItem key={phase.value} value={phase.value}>
                            {phase.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Data da Foto</Label>
                    <Input
                      type="date"
                      value={formData.taken_at}
                      onChange={(e) => setFormData({ ...formData, taken_at: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Milestone (opcional)</Label>
                  <Select
                    value={formData.milestone_id}
                    onValueChange={(value) => setFormData({ ...formData, milestone_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Associar a milestone..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {milestones.map((milestone) => (
                        <SelectItem key={milestone.id} value={milestone.id}>
                          {milestone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpload} disabled={uploading}>
                    {uploading ? (
                      <>Carregando...</>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Carregar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        {!selectedProject ? (
          <div className="text-center py-12 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Selecione um projeto para ver as fotos</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma foto adicionada</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar primeira foto
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="group relative aspect-square rounded-lg overflow-hidden border bg-muted"
              >
                <img
                  src={photo.image_url}
                  alt={photo.title || "Foto do projeto"}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => toggleFeatured(photo)}
                    >
                      {photo.is_featured ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => handleDelete(photo)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-white">
                    {photo.title && (
                      <p className="font-medium text-sm truncate">{photo.title}</p>
                    )}
                    {photo.taken_at && (
                      <p className="text-xs opacity-70 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(photo.taken_at), "d MMM yyyy", { locale: pt })}
                      </p>
                    )}
                    {photo.phase && (
                      <p className="text-xs opacity-70">
                        {phases.find(p => p.value === photo.phase)?.label}
                      </p>
                    )}
                  </div>
                </div>

                {/* Featured badge */}
                {photo.is_featured && (
                  <div className="absolute top-2 left-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
