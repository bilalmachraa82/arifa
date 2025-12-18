import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSignature, Plus, RefreshCw, Download, Eye, Send, Loader2 } from "lucide-react";
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
  quote_id: string | null;
  client_id: string | null;
  client?: {
    full_name: string | null;
    email: string | null;
  };
  quote?: {
    quote_number: string;
    project_title: string;
  };
}

interface Quote {
  id: string;
  quote_number: string;
  project_title: string;
  status: string | null;
  client_id: string | null;
  client?: {
    full_name: string | null;
    email: string | null;
  };
}

export function AdminContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [acceptedQuotes, setAcceptedQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchContracts();
    fetchAcceptedQuotes();
  }, []);

  const fetchContracts = async () => {
    try {
      const { data, error } = await supabase
        .from("contracts")
        .select(`
          *,
          client:profiles!contracts_client_id_fkey(full_name, email),
          quote:quotes!contracts_quote_id_fkey(quote_number, project_title)
        `)
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

  const fetchAcceptedQuotes = async () => {
    try {
      // Get quotes that are accepted but don't have a contract yet
      const { data: existingContracts } = await supabase
        .from("contracts")
        .select("quote_id");

      const existingQuoteIds = existingContracts?.map(c => c.quote_id).filter(Boolean) || [];

      const { data, error } = await supabase
        .from("quotes")
        .select(`
          id,
          quote_number,
          project_title,
          status,
          client_id,
          client:profiles!quotes_client_id_fkey(full_name, email)
        `)
        .eq("status", "accepted")
        .not("id", "in", existingQuoteIds.length > 0 ? `(${existingQuoteIds.join(",")})` : "(00000000-0000-0000-0000-000000000000)");

      if (error) throw error;
      setAcceptedQuotes(data || []);
    } catch (error: any) {
      console.error("Error fetching quotes:", error);
    }
  };

  const createContract = async () => {
    if (!selectedQuoteId) {
      toast.error("Selecione uma cotação");
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-boldsign-contract", {
        body: { quote_id: selectedQuoteId },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast.success("Contrato criado e enviado para assinatura!");
      setDialogOpen(false);
      setSelectedQuoteId("");
      fetchContracts();
      fetchAcceptedQuotes();
    } catch (error: any) {
      console.error("Error creating contract:", error);
      toast.error(`Erro ao criar contrato: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      draft: { label: "Rascunho", variant: "outline" },
      pending: { label: "Pendente", variant: "secondary" },
      signed: { label: "Assinado", variant: "default" },
      declined: { label: "Recusado", variant: "destructive" },
      expired: { label: "Expirado", variant: "destructive" },
      cancelled: { label: "Cancelado", variant: "destructive" },
    };

    const config = statusConfig[status] || { label: status, variant: "outline" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const resendContract = async (contract: Contract) => {
    toast.info("Funcionalidade de reenvio em desenvolvimento");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Contratos</h2>
          <p className="text-muted-foreground">Gerir contratos e assinaturas digitais</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchContracts}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={acceptedQuotes.length === 0}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Contrato
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Contrato</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cotação Aceite</label>
                  <Select value={selectedQuoteId} onValueChange={setSelectedQuoteId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma cotação" />
                    </SelectTrigger>
                    <SelectContent>
                      {acceptedQuotes.map((quote) => (
                        <SelectItem key={quote.id} value={quote.id}>
                          {quote.quote_number} - {quote.project_title} ({quote.client?.full_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={createContract} disabled={creating || !selectedQuoteId} className="w-full">
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      A criar contrato...
                    </>
                  ) : (
                    <>
                      <FileSignature className="h-4 w-4 mr-2" />
                      Criar e Enviar para Assinatura
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {acceptedQuotes.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <p className="text-sm">
              <strong>{acceptedQuotes.length}</strong> cotação(ões) aceite(s) sem contrato.
              Crie um contrato para iniciar o processo de assinatura.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Lista de Contratos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileSignature className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum contrato encontrado</p>
              <p className="text-sm">Crie um contrato a partir de uma cotação aceite</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Cotação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.title}</TableCell>
                    <TableCell>
                      <div>
                        <p>{contract.client?.full_name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{contract.client?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{contract.quote?.quote_number || "—"}</TableCell>
                    <TableCell>{getStatusBadge(contract.status)}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">
                          {format(new Date(contract.created_at), "dd/MM/yyyy", { locale: pt })}
                        </p>
                        {contract.signed_at && (
                          <p className="text-xs text-green-600">
                            Assinado: {format(new Date(contract.signed_at), "dd/MM/yyyy", { locale: pt })}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {contract.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => resendContract(contract)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        {contract.signed_document_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a href={contract.signed_document_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
