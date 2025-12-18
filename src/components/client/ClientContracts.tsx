import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileSignature, Download, ExternalLink, Loader2, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Contract {
  id: string;
  title: string;
  status: string;
  created_at: string;
  signed_at: string | null;
  signed_document_url: string | null;
  boldsign_document_id: string | null;
}

export function ClientContracts() {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingContractId, setSigningContractId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchContracts();
    }
  }, [user]);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("client_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error: any) {
      console.error("Error fetching contracts:", error);
      toast.error("Erro ao carregar contratos");
    } finally {
      setLoading(false);
    }
  };

  const openSigningUrl = async (contractId: string) => {
    setSigningContractId(contractId);
    try {
      const { data, error } = await supabase.functions.invoke("get-boldsign-signing-url", {
        body: { contract_id: contractId },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.status === "signed") {
        toast.success("Este contrato já foi assinado!");
        fetchContracts();
        return;
      }

      if (data.signing_url) {
        window.open(data.signing_url, "_blank");
      }
    } catch (error: any) {
      console.error("Error getting signing URL:", error);
      toast.error(`Erro ao obter link de assinatura: ${error.message}`);
    } finally {
      setSigningContractId(null);
    }
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
      draft: { icon: <Clock className="h-4 w-4" />, label: "Rascunho", color: "text-muted-foreground" },
      pending: { icon: <Clock className="h-4 w-4" />, label: "Aguarda Assinatura", color: "text-yellow-600" },
      signed: { icon: <CheckCircle className="h-4 w-4" />, label: "Assinado", color: "text-green-600" },
      declined: { icon: <XCircle className="h-4 w-4" />, label: "Recusado", color: "text-destructive" },
      expired: { icon: <XCircle className="h-4 w-4" />, label: "Expirado", color: "text-destructive" },
      cancelled: { icon: <XCircle className="h-4 w-4" />, label: "Cancelado", color: "text-destructive" },
    };
    return config[status] || { icon: <Clock className="h-4 w-4" />, label: status, color: "text-muted-foreground" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const pendingContracts = contracts.filter(c => c.status === "pending");
  const otherContracts = contracts.filter(c => c.status !== "pending");

  return (
    <div className="space-y-6">
      {pendingContracts.length > 0 && (
        <Card className="border-yellow-500/50 bg-yellow-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <FileSignature className="h-5 w-5" />
              Contratos Pendentes de Assinatura
            </CardTitle>
            <CardDescription>
              Tem {pendingContracts.length} contrato(s) à espera da sua assinatura
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingContracts.map((contract) => (
              <div
                key={contract.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg border"
              >
                <div>
                  <h4 className="font-medium">{contract.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Recebido em {format(new Date(contract.created_at), "dd 'de' MMMM 'de' yyyy", { locale: pt })}
                  </p>
                </div>
                <Button
                  onClick={() => openSigningUrl(contract.id)}
                  disabled={signingContractId === contract.id}
                >
                  {signingContractId === contract.id ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileSignature className="h-4 w-4 mr-2" />
                  )}
                  Assinar Contrato
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Todos os Contratos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileSignature className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum contrato encontrado</p>
              <p className="text-sm">Os contratos aparecerão aqui quando forem criados</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contracts.map((contract) => {
                const statusConfig = getStatusConfig(contract.status);
                return (
                  <div
                    key={contract.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{contract.title}</h4>
                        <Badge variant="outline" className={statusConfig.color}>
                          {statusConfig.icon}
                          <span className="ml-1">{statusConfig.label}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Criado em {format(new Date(contract.created_at), "dd/MM/yyyy", { locale: pt })}
                        {contract.signed_at && (
                          <span className="text-green-600 ml-2">
                            • Assinado em {format(new Date(contract.signed_at), "dd/MM/yyyy", { locale: pt })}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {contract.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => openSigningUrl(contract.id)}
                          disabled={signingContractId === contract.id}
                        >
                          {signingContractId === contract.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <ExternalLink className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      {contract.signed_document_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={contract.signed_document_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
