import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "./FileUpload";
import MultiImageUpload from "./MultiImageUpload";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string | null;
  location: string | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  created_at: string | null;
}

const categories = [
  "Residencial",
  "Comercial",
  "Hotelaria",
  "Reabilitação",
  "Interiores",
];

const statuses = ["Em projeto", "Em obra", "Concluído"];

const AdminProjects = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    status: "Em projeto",
    location: "",
    area: "",
    year: "",
    segment: "",
    description: "",
    full_description: "",
    featured_image: "",
    images: [] as string[],
    is_published: false,
    is_featured: false,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("id, title, slug, category, status, location, is_published, is_featured, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: editingProject ? formData.slug : generateSlug(title),
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      category: "",
      status: "Em projeto",
      location: "",
      area: "",
      year: "",
      segment: "",
      description: "",
      full_description: "",
      featured_image: "",
      images: [],
      is_published: false,
      is_featured: false,
    });
    setEditingProject(null);
  };

  const handleEdit = async (project: Project) => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("id", project.id)
      .single();

    if (data) {
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        category: data.category || "",
        status: data.status || "Em projeto",
        location: data.location || "",
        area: data.area || "",
        year: data.year || "",
        segment: data.segment || "",
        description: data.description || "",
        full_description: data.full_description || "",
        featured_image: data.featured_image || "",
        images: data.images || [],
        is_published: data.is_published || false,
        is_featured: data.is_featured || false,
      });
      setEditingProject(project);
      setDialogOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const projectData = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category: formData.category,
      status: formData.status,
      location: formData.location.trim() || null,
      area: formData.area.trim() || null,
      year: formData.year.trim() || null,
      segment: formData.segment.trim() || null,
      description: formData.description.trim() || null,
      full_description: formData.full_description.trim() || null,
      featured_image: formData.featured_image || null,
      images: formData.images.length > 0 ? formData.images : null,
      is_published: formData.is_published,
      is_featured: formData.is_featured,
    };

    let error;
    if (editingProject) {
      ({ error } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", editingProject.id));
    } else {
      ({ error } = await supabase.from("projects").insert(projectData));
    }

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: editingProject ? "Projeto atualizado" : "Projeto criado",
        description: "As alterações foram guardadas com sucesso.",
      });
      setDialogOpen(false);
      resetForm();
      fetchProjects();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este projeto?")) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Projeto eliminado" });
      fetchProjects();
    }
  };

  const togglePublished = async (project: Project) => {
    const { error } = await supabase
      .from("projects")
      .update({ is_published: !project.is_published })
      .eq("id", project.id);

    if (!error) {
      fetchProjects();
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Projetos</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProject ? "Editar Projeto" : "Novo Projeto"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Título *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug *</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => setFormData({ ...formData, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Localização</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Área</Label>
                  <Input
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="ex: 250 m²"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ano</Label>
                  <Input
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição curta</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição completa</Label>
                <Textarea
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  rows={4}
                />
              </div>

              <FileUpload
                bucket="project-images"
                folder="featured"
                label="Imagem de destaque"
                currentUrl={formData.featured_image}
                onUploadComplete={(url) => setFormData({ ...formData, featured_image: url })}
              />

              <MultiImageUpload
                bucket="project-images"
                folder="gallery"
                label="Galeria de imagens"
                currentImages={formData.images}
                onImagesChange={(urls) => setFormData({ ...formData, images: urls })}
              />

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_published}
                    onCheckedChange={(v) => setFormData({ ...formData, is_published: v })}
                  />
                  <Label>Publicado</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.is_featured}
                    onCheckedChange={(v) => setFormData({ ...formData, is_featured: v })}
                  />
                  <Label>Destaque</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingProject ? "Guardar" : "Criar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Publicado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.category}</Badge>
                  </TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>
                    <Switch
                      checked={project.is_published || false}
                      onCheckedChange={() => togglePublished(project)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`/portfolio/${project.slug}`, "_blank")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProjects;
