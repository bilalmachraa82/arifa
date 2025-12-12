import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Send, MessageSquare, Clock, User, Paperclip } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageAttachmentUpload, 
  MessageAttachmentDisplay, 
  Attachment 
} from "@/components/chat/MessageAttachments";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

interface Message {
  id: string;
  client_id: string;
  sender_id: string;
  project_id: string | null;
  subject: string;
  content: string;
  is_read: boolean | null;
  created_at: string | null;
  attachments: Attachment[] | null;
}

interface Client {
  id: string;
  full_name: string | null;
  email: string | null;
}

const AdminMessages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const [replyData, setReplyData] = useState({
    subject: "",
    content: "",
  });
  const [replyAttachments, setReplyAttachments] = useState<Attachment[]>([]);
  
  // Typing indicator for admin replies
  const { typingUsers, handleInputChange, stopTyping } = useTypingIndicator(
    selectedMessage?.client_id || "admin-chat"
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [messagesRes, clientsRes] = await Promise.all([
      supabase
        .from("client_messages")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("id, full_name, email"),
    ]);

    const messagesWithAttachments = (messagesRes.data || []).map((msg) => ({
      ...msg,
      attachments: Array.isArray(msg.attachments) ? (msg.attachments as unknown as Attachment[]) : [],
    }));
    
    setMessages(messagesWithAttachments);
    setClients(clientsRes.data || []);
    setLoading(false);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.full_name || client?.email || "Desconhecido";
  };

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleReply = (message: Message) => {
    setSelectedMessage(message);
    setReplyData({
      subject: `Re: ${message.subject}`,
      content: "",
    });
    setReplyAttachments([]);
    setReplyDialogOpen(true);
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !user) return;

    setSending(true);
    stopTyping(); // Stop typing indicator on submit

    const { error } = await supabase.from("client_messages").insert({
      client_id: selectedMessage.client_id,
      sender_id: user.id,
      project_id: selectedMessage.project_id,
      subject: replyData.subject.trim(),
      content: replyData.content.trim(),
      is_read: false,
      attachments: JSON.parse(JSON.stringify(replyAttachments)),
    });

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Resposta enviada",
        description: "A mensagem foi enviada ao cliente.",
      });
      setReplyDialogOpen(false);
      setReplyData({ subject: "", content: "" });
      setReplyAttachments([]);
      fetchData();
    }
    setSending(false);
  };

  const handleReplyContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyData({ ...replyData, content: e.target.value });
    handleInputChange(); // Trigger typing indicator
  };

  // Group messages by client
  const messagesByClient = messages.reduce((acc, message) => {
    const clientId = message.client_id;
    if (!acc[clientId]) {
      acc[clientId] = [];
    }
    acc[clientId].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mensagens de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhuma mensagem recebida.</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
              {Object.entries(messagesByClient).map(([clientId, clientMessages]) => (
                <div key={clientId} className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1 bg-muted/50 rounded text-sm font-medium">
                    <User className="h-4 w-4" />
                    {getClientName(clientId)}
                  </div>
                  {clientMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id
                          ? "bg-primary/10 border border-primary"
                          : "bg-muted/30 hover:bg-muted/50"
                      } ${!message.is_read && message.sender_id !== user?.id ? "border-l-4 border-l-primary" : ""}`}
                      onClick={() => handleViewMessage(message)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm truncate ${
                          !message.is_read && message.sender_id !== user?.id ? "font-semibold" : ""
                        }`}>
                          {message.subject}
                        </p>
                        {message.sender_id === user?.id && (
                          <Badge variant="outline" className="text-xs shrink-0">
                            Enviada
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(message.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <Card>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {selectedMessage.sender_id === user?.id 
                              ? "Enviada para " + getClientName(selectedMessage.client_id)
                              : getClientName(selectedMessage.client_id)
                            }
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(selectedMessage.created_at)}
                          </span>
                        </div>
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
                      <div className="mt-6 pt-4 border-t">
                        <Button onClick={() => handleReply(selectedMessage)}>
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
        )}

        {/* Reply Dialog */}
        <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Responder a {selectedMessage && getClientName(selectedMessage.client_id)}</DialogTitle>
            </DialogHeader>
            <form onSubmit={sendReply} className="space-y-4">
              <div className="space-y-2">
                <Label>Assunto</Label>
                <Input
                  value={replyData.subject}
                  onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Mensagem</Label>
                <Textarea
                  value={replyData.content}
                  onChange={handleReplyContentChange}
                  rows={6}
                  required
                />
                <TypingIndicator typingUsers={typingUsers} />
              </div>
              <MessageAttachmentUpload
                attachments={replyAttachments}
                onAttachmentsChange={setReplyAttachments}
              />
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setReplyDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={sending}>
                  {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Send className="mr-2 h-4 w-4" />
                  Enviar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminMessages;
