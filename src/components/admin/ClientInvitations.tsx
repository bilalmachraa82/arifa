import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Send, 
  Loader2, 
  UserPlus, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface Invitation {
  id: string;
  email: string;
  name: string;
  token: string;
  status: string;
  created_at: string;
  expires_at: string;
  accepted_at: string | null;
}

const ClientInvitations = () => {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [resendConfigured, setResendConfigured] = useState<boolean | null>(null);
  
  const [newInvite, setNewInvite] = useState({
    email: "",
    name: "",
  });

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from("client_invitations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (err) {
      console.error("Error fetching invitations:", err);
      toast.error("Erro ao carregar convites");
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvitation = async () => {
    if (!newInvite.email || !newInvite.name) {
      toast.error("Preencha todos os campos");
      return;
    }

    setSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-invitation", {
        body: {
          email: newInvite.email,
          name: newInvite.name,
          invitedBy: user?.id,
        },
      });

      if (error) throw error;

      if (data?.code === "RESEND_NOT_CONFIGURED") {
        setResendConfigured(false);
        toast.error("Serviço de email não configurado");
        return;
      }

      toast.success("Convite enviado com sucesso!");
      setNewInvite({ email: "", name: "" });
      setDialogOpen(false);
      fetchInvitations();
    } catch (err: any) {
      console.error("Error sending invitation:", err);
      
      if (err.message?.includes("RESEND_NOT_CONFIGURED") || err.message?.includes("Email service not configured")) {
        setResendConfigured(false);
      } else {
        toast.error(err.message || "Erro ao enviar convite");
      }
    } finally {
      setSending(false);
    }
  };

  const handleCancelInvitation = async (id: string) => {
    try {
      const { error } = await supabase
        .from("client_invitations")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Convite cancelado");
      fetchInvitations();
    } catch (err) {
      console.error("Error cancelling invitation:", err);
      toast.error("Erro ao cancelar convite");
    }
  };

  const handleResendInvitation = async (invitation: Invitation) => {
    setSending(true);
    
    try {
      // Cancel old invitation and create new one
      await supabase
        .from("client_invitations")
        .update({ status: "cancelled" })
        .eq("id", invitation.id);

      const { data, error } = await supabase.functions.invoke("send-invitation", {
        body: {
          email: invitation.email,
          name: invitation.name,
          invitedBy: user?.id,
        },
      });

      if (error) throw error;

      if (data?.code === "RESEND_NOT_CONFIGURED") {
        setResendConfigured(false);
        toast.error("Serviço de email não configurado");
        return;
      }

      toast.success("Convite reenviado!");
      fetchInvitations();
    } catch (err: any) {
      console.error("Error resending invitation:", err);
      toast.error(err.message || "Erro ao reenviar convite");
    } finally {
      setSending(false);
    }
  };

  const copyInvitationLink = (token: string) => {
    const link = `${window.location.origin}/convite/${token}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  };

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date();
    
    if (status === "accepted") {
      return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Aceite</Badge>;
    }
    if (status === "cancelled") {
      return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelado</Badge>;
    }
    if (isExpired) {
      return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Expirado</Badge>;
    }
    return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pendente</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Resend Configuration Alert */}
      {resendConfigured === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuração Necessária</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              O serviço de envio de emails (Resend) não está configurado. 
              Para enviar convites por email, siga estes passos:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Crie uma conta em{" "}
                <a 
                  href="https://resend.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-medium inline-flex items-center gap-1"
                >
                  resend.com <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                Valide o seu domínio em{" "}
                <a 
                  href="https://resend.com/domains" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-medium inline-flex items-center gap-1"
                >
                  Domains <ExternalLink className="w-3 h-3" />
                </a>
                {" "}(ou use o domínio de teste para começar)
              </li>
              <li>
                Crie uma API Key em{" "}
                <a 
                  href="https://resend.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline font-medium inline-flex items-center gap-1"
                >
                  API Keys <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                Adicione a API Key como <code className="bg-muted px-1 rounded">RESEND_API_KEY</code> nas configurações do projeto
              </li>
            </ol>
            <p className="text-sm mt-2">
              Enquanto isso, pode copiar o link do convite manualmente e enviá-lo ao cliente.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Convites de Clientes</h3>
          <p className="text-sm text-muted-foreground">
            Envie convites para novos clientes acederem ao portal
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Novo Convite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Convidar Novo Cliente</DialogTitle>
              <DialogDescription>
                Envie um convite por email para um novo cliente aceder ao portal.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Cliente</Label>
                <Input
                  id="name"
                  value={newInvite.name}
                  onChange={(e) => setNewInvite({ ...newInvite, name: e.target.value })}
                  placeholder="Ex: João Silva"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newInvite.email}
                  onChange={(e) => setNewInvite({ ...newInvite, email: e.target.value })}
                  placeholder="cliente@exemplo.com"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSendInvitation} disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    A enviar...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Convite
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invitations Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : invitations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Nenhum convite enviado ainda</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">{invitation.name}</TableCell>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell>
                    {getStatusBadge(invitation.status, invitation.expires_at)}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invitation.created_at), "dd MMM yyyy", { locale: pt })}
                  </TableCell>
                  <TableCell>
                    {format(new Date(invitation.expires_at), "dd MMM yyyy", { locale: pt })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyInvitationLink(invitation.token)}
                        title="Copiar link"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      
                      {invitation.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResendInvitation(invitation)}
                            disabled={sending}
                            title="Reenviar convite"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelInvitation(invitation.id)}
                            title="Cancelar convite"
                          >
                            <XCircle className="w-4 h-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ClientInvitations;
