import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Plus, Trash2, Loader2, Eye, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import FileUpload from "./FileUpload";
import DocumentVersionHistory from "./DocumentVersionHistory";

interface Document {
  id: string;
  client_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string | null;
  current_version: number;
}

interface Client {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface Project {
  id: string;
  title: string;
}

const AdminDocuments = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    client_id: "",
    project_id: "",
    title: "",
    description: "",
    file_url: "",
    file_type: "",
    file_size: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [docsRes, clientsRes, projectsRes] = await Promise.all([
      supabase
        .from("client_documents")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("id, full_name, email"),
      supabase
        .from("projects")
        .select("id, title")
        .eq("is_published", true),
    ]);

    setDocuments(docsRes.data || []);
    setClients(clientsRes.data || []);
    setProjects(projectsRes.data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      client_id: "",
      project_id: "",
      title: "",
      description: "",
      file_url: "",
      file_type: "",
      file_size: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("client_documents").insert({
      client_id: formData.client_id,
      project_id: formData.project_id || null,
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      file_url: formData.file_url.trim(),
      file_type: formData.file_type.trim() || null,
      file_size: formData.file_size ? parseInt(formData.file_size) : null,
    });

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Documento adicionado",
        description: "O documento foi partilhado com o cliente.",
      });
      setDialogOpen(false);
      resetForm();
      fetchData();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja eliminar este documento?")) return;

    const { error } = await supabase.from("client_documents").delete().eq("id", id);

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Documento eliminado" });
      fetchData();
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-PT");
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "-";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.full_name || client?.email || "Desconhecido";
  };

  const getProjectTitle = (projectId: string | null) => {
    if (!projectId) return "-";
    const project = projects.find(p => p.id === projectId);
    return project?.title || "-";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documentos de Clientes</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Partilhar Documento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(v) => setFormData({ ...formData, client_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.full_name || client.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Projeto (opcional)</Label>
                <Select
                  value={formData.project_id}
                  onValueChange={(v) => setFormData({ ...formData, project_id: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nenhum projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum projeto</SelectItem>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                />
              </div>

              <FileUpload
                bucket="client-documents"
                folder={formData.client_id || "uploads"}
                label="Ficheiro *"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.dwg,.jpg,.jpeg,.png"
                maxSize={50}
                currentUrl={formData.file_url}
                onUploadComplete={(url, fileName, fileSize) => {
                  const ext = fileName.split(".").pop()?.toLowerCase() || "";
                  setFormData({ 
                    ...formData, 
                    file_url: url,
                    file_type: ext,
                    file_size: fileSize.toString()
                  });
                }}
              />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving || !formData.client_id}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Partilhar
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
        ) : documents.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum documento partilhado.
          </p>
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
              <Collapsible key={doc.id}>
                <Card className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{doc.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            v{doc.current_version || 1}
                          </Badge>
                          {doc.file_type && (
                            <Badge variant="outline" className="text-xs">
                              {doc.file_type.toUpperCase()}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>{getClientName(doc.client_id)}</span>
                          <span>•</span>
                          <span>{getProjectTitle(doc.project_id)}</span>
                          <span>•</span>
                          <span>{formatDate(doc.created_at)}</span>
                          {doc.file_size && (
                            <>
                              <span>•</span>
                              <span>{formatFileSize(doc.file_size)}</span>
                            </>
                          )}
                        </div>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                            {doc.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                  </div>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4 pt-0 border-t">
                      <div className="pt-4">
                        <DocumentVersionHistory
                          documentId={doc.id}
                          documentTitle={doc.title}
                          clientId={doc.client_id}
                          currentVersion={doc.current_version || 1}
                          onVersionUploaded={fetchData}
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDocuments;
