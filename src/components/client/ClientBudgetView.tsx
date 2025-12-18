import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wallet, TrendingUp, AlertCircle, Check, X, Clock, Euro } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Budget {
  id: string;
  original_budget: number | null;
  current_budget: number | null;
  spent_amount: number | null;
  currency: string | null;
}

interface ChangeOrder {
  id: string;
  order_number: string;
  title: string;
  description: string | null;
  reason: string | null;
  amount: number;
  impact_schedule: string | null;
  status: string | null;
  requires_client_approval: boolean | null;
  requested_at: string | null;
}

interface ClientBudgetViewProps {
  projectId: string;
  projectTitle: string;
}

const ClientBudgetView = ({ projectId, projectTitle }: ClientBudgetViewProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ChangeOrder | null>(null);
  const [clientNotes, setClientNotes] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    const [budgetResult, ordersResult] = await Promise.all([
      supabase
        .from("project_budgets")
        .select("*")
        .eq("project_id", projectId)
        .single(),
      supabase
        .from("project_change_orders")
        .select("*")
        .eq("project_id", projectId)
        .order("requested_at", { ascending: false })
    ]);

    if (budgetResult.data) {
      setBudget(budgetResult.data);
    }
    if (ordersResult.data) {
      setChangeOrders(ordersResult.data);
    }
    setLoading(false);
  };

  const handleApproval = async (approved: boolean) => {
    if (!selectedOrder || !user) return;

    setProcessing(true);
    const { error } = await supabase
      .from("project_change_orders")
      .update({
        status: approved ? "approved" : "rejected",
        client_approved_at: approved ? new Date().toISOString() : null,
        client_notes: clientNotes || null,
        decided_at: new Date().toISOString()
      })
      .eq("id", selectedOrder.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar a sua resposta.",
        variant: "destructive"
      });
    } else {
      toast({
        title: approved ? "Alteração aprovada" : "Alteração rejeitada",
        description: approved 
          ? "A alteração foi aprovada e será aplicada ao projeto."
          : "A alteração foi rejeitada."
      });
      fetchData();
      setSelectedOrder(null);
      setClientNotes("");
    }
    setProcessing(false);
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "—";
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: budget?.currency || "EUR"
    }).format(value);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" />Aprovado</Badge>;
      case "rejected":
        return <Badge variant="destructive"><X className="h-3 w-3 mr-1" />Rejeitado</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pendente</Badge>;
    }
  };

  const pendingOrders = changeOrders.filter(o => o.status === "pending" && o.requires_client_approval);
  const spentPercentage = budget?.current_budget && budget?.spent_amount
    ? (budget.spent_amount / budget.current_budget) * 100
    : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          A carregar informações de orçamento...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      {budget && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Orçamento - {projectTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <p className="text-sm text-muted-foreground">Orçamento Original</p>
                <p className="text-2xl font-bold">{formatCurrency(budget.original_budget)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Orçamento Atual</p>
                <p className="text-2xl font-bold flex items-center gap-2">
                  {formatCurrency(budget.current_budget)}
                  {budget.current_budget && budget.original_budget && 
                   budget.current_budget > budget.original_budget && (
                    <TrendingUp className="h-5 w-5 text-amber-500" />
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Gasto</p>
                <p className="text-2xl font-bold">{formatCurrency(budget.spent_amount)}</p>
              </div>
            </div>

            {budget.current_budget && budget.spent_amount !== null && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso do orçamento</span>
                  <span>{spentPercentage.toFixed(0)}%</span>
                </div>
                <Progress value={spentPercentage} className="h-3" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pending Approvals Alert */}
      {pendingOrders.length > 0 && (
        <Card className="border-amber-500 bg-amber-500/10">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-medium">
                  {pendingOrders.length} alteraç{pendingOrders.length > 1 ? "ões" : "ão"} a aguardar a sua aprovação
                </p>
                <p className="text-sm text-muted-foreground">
                  Por favor reveja as alterações propostas abaixo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Orders */}
      {changeOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Alterações e Extras</CardTitle>
            <CardDescription>
              Histórico de alterações ao projeto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {changeOrders.map((order) => (
                <div 
                  key={order.id}
                  className={`p-4 rounded-lg border ${
                    order.status === "pending" && order.requires_client_approval
                      ? "border-amber-500 bg-amber-500/5"
                      : ""
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{order.order_number}</Badge>
                        {getStatusBadge(order.status)}
                      </div>
                      <h4 className="font-medium">{order.title}</h4>
                      {order.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {order.description}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        {order.reason && (
                          <span>Motivo: {order.reason}</span>
                        )}
                        {order.impact_schedule && (
                          <span>Impacto: {order.impact_schedule}</span>
                        )}
                        {order.requested_at && (
                          <span>
                            {format(new Date(order.requested_at), "d MMM yyyy", { locale: pt })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1 text-lg font-semibold">
                        <Euro className="h-4 w-4" />
                        {order.amount.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                      </div>
                      {order.status === "pending" && order.requires_client_approval && (
                        <Button 
                          size="sm" 
                          onClick={() => setSelectedOrder(order)}
                        >
                          Responder
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!budget && changeOrders.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sem informações de orçamento</h3>
            <p className="text-muted-foreground text-center max-w-md">
              As informações de orçamento do projeto aparecerão aqui quando disponíveis.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Approval Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar Alteração</DialogTitle>
            <DialogDescription>
              Reveja a alteração proposta e confirme a sua decisão.
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{selectedOrder.title}</h4>
                {selectedOrder.description && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedOrder.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm">
                  <span className="font-semibold">
                    Valor: €{selectedOrder.amount.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                  </span>
                  {selectedOrder.impact_schedule && (
                    <span>Impacto: {selectedOrder.impact_schedule}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Notas (opcional)</label>
                <Textarea
                  placeholder="Adicione comentários ou questões..."
                  value={clientNotes}
                  onChange={(e) => setClientNotes(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => handleApproval(false)}
              disabled={processing}
            >
              <X className="h-4 w-4 mr-2" />
              Rejeitar
            </Button>
            <Button
              onClick={() => handleApproval(true)}
              disabled={processing}
            >
              <Check className="h-4 w-4 mr-2" />
              Aprovar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientBudgetView;
