import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  MapPin, 
  Clock,
  FileText,
  Euro,
  Building2,
  Phone,
  Mail
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

interface Quote {
  id: string;
  quote_number: string;
  project_title: string;
  project_description: string | null;
  project_location: string | null;
  project_category: string | null;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  estimated_duration: string | null;
  payment_terms: string | null;
  terms_conditions: string | null;
  status: string;
  valid_until: string;
  viewed_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  created_at: string;
}

interface QuoteItem {
  id: string;
  category: string | null;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Rascunho", color: "bg-muted text-muted-foreground", icon: FileText },
  sent: { label: "Aguarda Resposta", color: "bg-blue-500/10 text-blue-600", icon: Clock },
  viewed: { label: "Em Análise", color: "bg-amber-500/10 text-amber-600", icon: Clock },
  accepted: { label: "Aceite", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
  rejected: { label: "Rejeitada", color: "bg-destructive/10 text-destructive", icon: XCircle },
  expired: { label: "Expirada", color: "bg-muted text-muted-foreground", icon: Calendar },
};

export default function QuotePublic() {
  const { token } = useParams<{ token: string }>();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchQuote();
    }
  }, [token]);

  const fetchQuote = async () => {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("public_token", token)
      .single();

    if (error || !data) {
      setError("Cotação não encontrada ou link inválido.");
      setLoading(false);
      return;
    }

    setQuote(data);

    // Fetch items
    const { data: itemsData } = await supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", data.id)
      .order("sort_order");

    setItems(itemsData || []);

    // Mark as viewed if not already
    if (!data.viewed_at && data.status === "sent") {
      await supabase
        .from("quotes")
        .update({ 
          viewed_at: new Date().toISOString(),
          status: "viewed"
        })
        .eq("id", data.id);

      // Log event
      await supabase.from("quote_events").insert({
        quote_id: data.id,
        event_type: "viewed",
        ip_address: null,
      });
    }

    setLoading(false);
  };

  const handleAccept = async () => {
    if (!quote) return;
    setActionLoading(true);

    const { error } = await supabase
      .from("quotes")
      .update({ 
        status: "accepted",
        accepted_at: new Date().toISOString()
      })
      .eq("id", quote.id);

    if (error) {
      toast.error("Erro ao aceitar cotação");
    } else {
      await supabase.from("quote_events").insert({
        quote_id: quote.id,
        event_type: "accepted",
      });

      toast.success("Cotação aceite com sucesso! Entraremos em contacto brevemente.");
      setQuote({ ...quote, status: "accepted", accepted_at: new Date().toISOString() });
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!quote) return;
    setActionLoading(true);

    const { error } = await supabase
      .from("quotes")
      .update({ 
        status: "rejected",
        rejected_at: new Date().toISOString(),
        rejection_reason: rejectionReason || null
      })
      .eq("id", quote.id);

    if (error) {
      toast.error("Erro ao rejeitar cotação");
    } else {
      await supabase.from("quote_events").insert({
        quote_id: quote.id,
        event_type: "rejected",
        metadata: { reason: rejectionReason }
      });

      toast.info("Cotação rejeitada. Obrigado pelo seu feedback.");
      setQuote({ ...quote, status: "rejected", rejected_at: new Date().toISOString() });
    }
    setRejectDialogOpen(false);
    setActionLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="container-arifa py-16">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-10 bg-muted rounded w-1/2"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !quote) {
    return (
      <Layout>
        <SEO 
          title="Cotação - ARIFA Studio" 
          description="Visualize a sua cotação ARIFA Studio"
        />
        <div className="container-arifa py-16">
          <div className="max-w-lg mx-auto text-center">
            <XCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-2">Cotação não encontrada</h1>
            <p className="text-muted-foreground">
              {error || "O link da cotação é inválido ou expirou."}
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  const isExpired = new Date(quote.valid_until) < new Date() && quote.status !== "accepted";
  const canRespond = !isExpired && quote.status !== "accepted" && quote.status !== "rejected";
  const statusInfo = statusConfig[isExpired && quote.status !== "accepted" ? "expired" : quote.status];
  const StatusIcon = statusInfo.icon;

  // Group items by category
  const groupedItems = items.reduce((acc, item) => {
    const category = item.category || "Outros";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {} as Record<string, QuoteItem[]>);

  return (
    <Layout>
      <SEO 
        title={`Cotação ${quote.quote_number} - ARIFA Studio`}
        description={`Cotação para ${quote.project_title}`}
      />

      <div className="container-arifa py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className={statusInfo.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
                <span className="text-sm text-muted-foreground font-mono">
                  {quote.quote_number}
                </span>
              </div>
              <h1 className="text-3xl font-bold">{quote.project_title}</h1>
              {quote.project_location && (
                <p className="flex items-center gap-1.5 text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  {quote.project_location}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">
                  €{quote.total.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Válido até {format(new Date(quote.valid_until), "d 'de' MMMM 'de' yyyy", { locale: pt })}
              </div>
            </div>
          </div>

          {/* Project Description */}
          {quote.project_description && (
            <Card>
              <CardHeader className="pb-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Sobre o Projeto
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {quote.project_description}
                </p>
                {quote.estimated_duration && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      Duração estimada: <strong>{quote.estimated_duration}</strong>
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Items */}
          <Card>
            <CardHeader className="pb-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Euro className="h-4 w-4" />
                Itens da Proposta
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category}>
                  <h3 className="font-medium text-sm text-muted-foreground mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryItems.map((item) => (
                      <div 
                        key={item.id}
                        className="flex justify-between items-start py-2 border-b border-muted last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit} × €{item.unit_price.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <p className="font-medium">
                          €{item.total.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>€{quote.subtotal.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA ({quote.tax_rate}%)</span>
                  <span>€{quote.tax_amount.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>€{quote.total.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          {(quote.payment_terms || quote.terms_conditions) && (
            <Card>
              <CardHeader className="pb-3">
                <h2 className="font-semibold">Condições</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {quote.payment_terms && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Condições de Pagamento</h3>
                    <p className="text-sm text-muted-foreground">{quote.payment_terms}</p>
                  </div>
                )}
                {quote.terms_conditions && (
                  <div>
                    <h3 className="text-sm font-medium mb-1">Termos e Condições</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {quote.terms_conditions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          {canRespond && (
            <Card className="border-2 border-accent">
              <CardContent className="py-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-2">Aceitar esta proposta?</h2>
                  <p className="text-muted-foreground">
                    Ao aceitar, entraremos em contacto para dar início ao projeto.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    size="lg"
                    onClick={handleAccept}
                    disabled={actionLoading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Aceitar Proposta
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setRejectDialogOpen(true)}
                    disabled={actionLoading}
                  >
                    <XCircle className="h-5 w-5 mr-2" />
                    Rejeitar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Status Messages */}
          {quote.status === "accepted" && (
            <Card className="border-emerald-500 bg-emerald-500/5">
              <CardContent className="py-6 text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-600 mb-3" />
                <h2 className="text-xl font-bold text-emerald-600 mb-2">Proposta Aceite!</h2>
                <p className="text-muted-foreground">
                  Obrigado! A nossa equipa entrará em contacto brevemente para dar início ao projeto.
                </p>
              </CardContent>
            </Card>
          )}

          {quote.status === "rejected" && (
            <Card className="border-muted">
              <CardContent className="py-6 text-center">
                <XCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h2 className="text-xl font-bold mb-2">Proposta Rejeitada</h2>
                <p className="text-muted-foreground">
                  Obrigado pelo seu feedback. Se mudar de ideias, não hesite em contactar-nos.
                </p>
              </CardContent>
            </Card>
          )}

          {isExpired && quote.status !== "accepted" && (
            <Card className="border-muted">
              <CardContent className="py-6 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h2 className="text-xl font-bold mb-2">Proposta Expirada</h2>
                <p className="text-muted-foreground">
                  Esta proposta já não é válida. Contacte-nos para uma nova cotação.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Contact */}
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm">
                <span className="text-muted-foreground">Dúvidas? Contacte-nos:</span>
                <a 
                  href="tel:+351123456789" 
                  className="flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +351 123 456 789
                </a>
                <a 
                  href="mailto:info@arifastudio.pt" 
                  className="flex items-center gap-2 hover:text-accent transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  info@arifastudio.pt
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Proposta</DialogTitle>
            <DialogDescription>
              Pode partilhar o motivo da rejeição? Esta informação ajuda-nos a melhorar.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Motivo da rejeição (opcional)..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={actionLoading}
            >
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
