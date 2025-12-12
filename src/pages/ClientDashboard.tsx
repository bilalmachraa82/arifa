import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FolderOpen, 
  FileText, 
  MessageSquare, 
  Download, 
  Eye,
  Clock,
  MapPin,
  Building2,
  Send,
  Check,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ClientMessageForm from "@/components/client/ClientMessageForm";
import ProjectTimeline from "@/components/client/ProjectTimeline";
import ClientDocumentVersions from "@/components/client/ClientDocumentVersions";
import { MessageAttachmentDisplay, Attachment } from "@/components/chat/MessageAttachments";
import { FolderNavigation } from "@/components/documents/FolderNavigation";
import { FilePreviewDialog } from "@/components/preview";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string | null;
  location: string | null;
  featured_image: string | null;
  description: string | null;
}

interface Document {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
  project_id: string | null;
  folder_id: string | null;
  current_version: number;
}

interface Message {
  id: string;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_id: string;
  project_id: string | null;
  attachments: Attachment[] | null;
}

const ClientDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch client's projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("id, title, slug, category, status, location, featured_image, description")
        .eq("client_id", user.id);

      // Fetch client's documents
      const { data: documentsData } = await supabase
        .from("client_documents")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      // Fetch client's messages
      const { data: messagesData } = await supabase
        .from("client_messages")
        .select("*")
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

      const messagesWithAttachments = (messagesData || []).map((msg) => ({
        ...msg,
        attachments: Array.isArray(msg.attachments) ? (msg.attachments as unknown as Attachment[]) : [],
      }));

      setProjects(projectsData || []);
      setDocuments(documentsData || []);
      setMessages(messagesWithAttachments);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message || message.is_read) return;

    const { error } = await supabase
      .from("client_messages")
      .update({ is_read: true })
      .eq("id", messageId);

    if (!error) {
      setMessages(messages.map(m => 
        m.id === messageId ? { ...m, is_read: true } : m
      ));
    }
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    markMessageAsRead(message.id);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const unreadCount = messages.filter(m => !m.is_read && m.sender_id !== user?.id).length;

  // Filter documents by current folder
  const filteredDocuments = documents.filter(doc => doc.folder_id === currentFolderId);

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Área de Cliente</h1>
              <p className="text-muted-foreground">
                Bem-vindo de volta! Acompanhe os seus projetos e comunicações.
              </p>
            </div>
            <Button onClick={() => setShowMessageForm(true)}>
              <Send className="mr-2 h-4 w-4" />
              Nova Mensagem
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{documents.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Mensagens</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {messages.length}
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} nova{unreadCount > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="projects">
              <FolderOpen className="mr-2 h-4 w-4" />
              Projetos
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="mr-2 h-4 w-4" />
              Documentos
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Mensagens
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects">
            {projects.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sem projetos ativos</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Ainda não tem projetos associados à sua conta. Entre em contacto connosco para iniciar o seu projeto.
                  </p>
                  <Button className="mt-4" onClick={() => navigate("/contacto")}>
                    Iniciar Projeto
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {projects.map((project) => (
                  <div key={project.id} className="space-y-4">
                    {/* Project Header Card */}
                    <Card className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        {project.featured_image && (
                          <div className="md:w-64 h-48 md:h-auto">
                            <img
                              src={project.featured_image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <Badge variant="outline" className="mb-2">
                                {project.category}
                              </Badge>
                              <h3 className="text-xl font-semibold">{project.title}</h3>
                            </div>
                            {project.status && (
                              <Badge 
                                variant={project.status === "Concluído" ? "default" : "secondary"}
                              >
                                {project.status}
                              </Badge>
                            )}
                          </div>
                          
                          {project.description && (
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {project.description}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            {project.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {project.location}
                              </span>
                            )}
                          </div>

                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/portfolio/${project.slug}`)}
                          >
                            Ver Detalhes
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                    
                    {/* Project Timeline */}
                    <ProjectTimeline 
                      projectId={project.id}
                      projectStatus={project.status} 
                      projectTitle={project.title}
                    />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            {/* Folder Navigation */}
            {user && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                <FolderNavigation
                  clientId={user.id}
                  currentFolderId={currentFolderId}
                  onFolderChange={setCurrentFolderId}
                  showCreateButton={false}
                />
              </div>
            )}
            
            {filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {currentFolderId ? "Pasta vazia" : "Sem documentos"}
                  </h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    {currentFolderId 
                      ? "Esta pasta não contém documentos." 
                      : "Ainda não existem documentos partilhados consigo. Os documentos do seu projeto aparecerão aqui."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium">{doc.title}</h4>
                              {doc.current_version > 1 && (
                                <Badge variant="secondary" className="text-xs">
                                  v{doc.current_version}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                              <span>{formatDate(doc.created_at)}</span>
                              {doc.file_size && (
                                <>
                                  <span>•</span>
                                  <span>{formatFileSize(doc.file_size)}</span>
                                </>
                              )}
                              {doc.file_type && (
                                <>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-xs">
                                    {doc.file_type.toUpperCase()}
                                  </Badge>
                                </>
                              )}
                            </div>
                            {doc.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {doc.description}
                              </p>
                            )}
                            
                            {/* Version History */}
                            <ClientDocumentVersions 
                              documentId={doc.id}
                              currentVersion={doc.current_version || 1}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setPreviewDoc(doc)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            asChild
                          >
                            <a href={doc.file_url} download>
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Messages List */}
              <div className="lg:col-span-1 space-y-2">
                {messages.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Sem mensagens</h3>
                      <p className="text-muted-foreground text-center">
                        Ainda não tem mensagens.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  messages.map((message) => (
                    <Card 
                      key={message.id}
                      className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedMessage?.id === message.id ? "border-primary" : ""
                      } ${!message.is_read && message.sender_id !== user?.id ? "border-l-4 border-l-primary" : ""}`}
                      onClick={() => handleViewMessage(message)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className={`font-medium truncate ${
                              !message.is_read && message.sender_id !== user?.id ? "font-semibold" : ""
                            }`}>
                              {message.subject}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {message.content}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {formatDate(message.created_at)}
                            </span>
                            {message.sender_id === user?.id && (
                              <Badge variant="outline" className="text-xs">
                                Enviada
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Message Detail */}
              <div className="lg:col-span-2">
                {selectedMessage ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{selectedMessage.subject}</CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(selectedMessage.created_at)}
                            {selectedMessage.sender_id === user?.id && (
                              <Badge variant="outline" className="ml-2">
                                <Check className="h-3 w-3 mr-1" />
                                Enviada por si
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{selectedMessage.content}</p>
                      </div>
                      
                      {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                        <MessageAttachmentDisplay attachments={selectedMessage.attachments} />
                      )}
                      
                      {selectedMessage.sender_id !== user?.id && (
                        <div className="mt-6 pt-6 border-t">
                          <Button onClick={() => setShowMessageForm(true)}>
                            <Send className="mr-2 h-4 w-4" />
                            Responder
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Selecione uma mensagem para ver os detalhes
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Message Form Dialog */}
      <ClientMessageForm 
        open={showMessageForm} 
        onOpenChange={setShowMessageForm}
        onSuccess={() => {
          fetchData();
          toast({
            title: "Mensagem enviada",
            description: "A sua mensagem foi enviada com sucesso.",
          });
        }}
        projects={projects}
        replyTo={selectedMessage?.sender_id !== user?.id ? selectedMessage : null}
      />
      
      {/* File Preview Dialog */}
      <FilePreviewDialog
        isOpen={!!previewDoc}
        onClose={() => setPreviewDoc(null)}
        fileUrl={previewDoc?.file_url || ""}
        fileName={previewDoc?.title || ""}
        fileType={previewDoc?.file_type || undefined}
        fileSize={previewDoc?.file_size || undefined}
      />
    </Layout>
  );
};

export default ClientDashboard;
