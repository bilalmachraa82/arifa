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

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  excerpt: string | null;
  is_published: boolean | null;
  is_featured: boolean | null;
  published_at: string | null;
}

const categories = [
  "Arquitetura",
  "Sustentabilidade",
  "Design",
  "Tendências",
  "Projetos",
];

const AdminBlogPosts = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    excerpt: "",
    content: "",
    featured_image: "",
    read_time: "",
    is_published: false,
    is_featured: false,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, category, excerpt, is_published, is_featured, published_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data || []);
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
      slug: editingPost ? formData.slug : generateSlug(title),
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      category: "",
      excerpt: "",
      content: "",
      featured_image: "",
      read_time: "",
      is_published: false,
      is_featured: false,
    });
    setEditingPost(null);
  };

  const handleEdit = async (post: BlogPost) => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", post.id)
      .single();

    if (data) {
      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        category: data.category || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        featured_image: data.featured_image || "",
        read_time: data.read_time || "",
        is_published: data.is_published || false,
        is_featured: data.is_featured || false,
      });
      setEditingPost(post);
      setDialogOpen(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const postData = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category: formData.category || null,
      excerpt: formData.excerpt.trim() || null,
      content: formData.content.trim() || null,
      featured_image: formData.featured_image.trim() || null,
      read_time: formData.read_time.trim() || null,
      is_published: formData.is_published,
      is_featured: formData.is_featured,
      published_at: formData.is_published ? new Date().toISOString() : null,
    };

    let error;
    if (editingPost) {
      ({ error } = await supabase
        .from("blog_posts")
        .update(postData)
        .eq("id", editingPost.id));
    } else {
      ({ error } = await supabase.from("blog_posts").insert(postData));
    }

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: editingPost ? "Artigo atualizado" : "Artigo criado",
        description: "As alterações foram guardadas com sucesso.",
      });
      setDialogOpen(false);
      resetForm();
      fetchPosts();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este artigo?")) return;

    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Artigo eliminado" });
      fetchPosts();
    }
  };

  const togglePublished = async (post: BlogPost) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ 
        is_published: !post.is_published,
        published_at: !post.is_published ? new Date().toISOString() : null
      })
      .eq("id", post.id);

    if (!error) {
      fetchPosts();
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-PT");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Blog Posts</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Artigo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPost ? "Editar Artigo" : "Novo Artigo"}
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
                  <Label>Categoria</Label>
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
                  <Label>Tempo de leitura</Label>
                  <Input
                    value={formData.read_time}
                    onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                    placeholder="ex: 5 min"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Excerto</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Conteúdo (HTML)</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  placeholder="<p>Conteúdo do artigo...</p>"
                />
              </div>

              <div className="space-y-2">
                <Label>Imagem destaque (URL)</Label>
                <Input
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="https://..."
                />
              </div>

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
                  {editingPost ? "Guardar" : "Criar"}
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
                <TableHead>Publicado em</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>
                    {post.category && <Badge variant="outline">{post.category}</Badge>}
                  </TableCell>
                  <TableCell>{formatDate(post.published_at)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={post.is_published || false}
                      onCheckedChange={() => togglePublished(post)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(post)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(post.id)}
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

export default AdminBlogPosts;
