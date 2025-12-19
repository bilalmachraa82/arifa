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
import { Plus, Pencil, Trash2, Loader2, Eye, Sparkles, Copy, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "./FileUpload";
import MultiImageUpload from "./MultiImageUpload";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [generatingUpdate, setGeneratingUpdate] = useState<string | null>(null);
  const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);
  const [weeklyUpdate, setWeeklyUpdate] = useState<{ projectId: string; summary: string } | null>(null);

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

  const generateWeeklyUpdate = async (projectId: string) => {
    setGeneratingUpdate(projectId);
    setWeeklyUpdate(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-weekly-update', {
        body: { projectId, language: 'pt' }
      });

      if (error) throw error;

      setWeeklyUpdate({ projectId, summary: data.summary });
      
      toast({
        title: "Resumo gerado",
        description: "O resumo semanal foi gerado com sucesso.",
      });
    } catch (error: any) {
      console.error('Error generating update:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar o resumo.",
        variant: "destructive",
      });
    } finally {
      setGeneratingUpdate(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado",
      description: "Resumo copiado para a área de transferência.",
    });
  };

  const generateProjectPDF = async (projectId: string, projectTitle: string) => {
    setGeneratingPDF(projectId);

    try {
      const { data, error } = await supabase.functions.invoke('generate-project-report', {
        body: { projectId }
      });

      if (error) throw error;

      if (data.html) {
        // Open HTML in new window for printing/saving as PDF
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(data.html);
          printWindow.document.close();
          printWindow.focus();
        }

        toast({
          title: "Relatório gerado",
          description: "O relatório foi aberto numa nova janela. Use Ctrl+P para guardar como PDF.",
        });
      }
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível gerar o relatório.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPDF(null);
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
                <Collapsible key={project.id}>
                  <TableRow>
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
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => generateWeeklyUpdate(project.id)}
                            disabled={generatingUpdate === project.id}
                            title="Gerar resumo AI"
                          >
                            {generatingUpdate === project.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => generateProjectPDF(project.id, project.title)}
                          disabled={generatingPDF === project.id}
                          title="Gerar Relatório PDF"
                        >
                          {generatingPDF === project.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="h-4 w-4" />
                          )}
                        </Button>
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
                  <CollapsibleContent asChild>
                    <TableRow>
                      <TableCell colSpan={5} className="bg-muted/30 p-4">
                        {weeklyUpdate?.projectId === project.id ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Resumo Semanal AI
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(weeklyUpdate.summary)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Copiar
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-background p-4 rounded-lg border">
                              {weeklyUpdate.summary}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Clique no botão ✨ para gerar um resumo semanal com AI.
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminProjects;
