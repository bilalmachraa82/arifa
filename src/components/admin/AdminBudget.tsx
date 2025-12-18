import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Euro,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Project {
  id: string;
  title: string;
  client_id: string | null;
}

interface Budget {
  id: string;
  project_id: string;
  original_budget: number | null;
  current_budget: number | null;
  spent_amount: number;
  currency: string;
  notes: string | null;
}

interface ChangeOrder {
  id: string;
  project_id: string;
  order_number: string;
  title: string;
  description: string | null;
  reason: string | null;
  amount: number;
  impact_schedule: string | null;
  status: string;
  requested_at: string;
  decided_at: string | null;
  requires_client_approval: boolean;
  client_approved_at: string | null;
  client_notes: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Pendente", color: "bg-amber-500/10 text-amber-600", icon: Clock },
  approved: { label: "Aprovado", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
  rejected: { label: "Rejeitado", color: "bg-destructive/10 text-destructive", icon: XCircle },
};

const reasons = [
  "Pedido do cliente",
  "Alteração de projeto",
  "Imprevisto em obra",
  "Requisito legal",
  "Melhoria de qualidade",
  "Outro",
];

export default function AdminBudget() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [budget, setBudget] = useState<Budget | null>(null);
  const [changeOrders, setChangeOrders] = useState<ChangeOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ChangeOrder | null>(null);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reason: "",
    amount: "",
    impact_schedule: "",
    requires_client_approval: true,
  });

  const [budgetForm, setBudgetForm] = useState({
    original_budget: "",
    spent_amount: "",
    notes: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchBudget();
      fetchChangeOrders();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("id, title, client_id")
      .not("client_id", "is", null)
      .order("created_at", { ascending: false });
    
    setProjects(data || []);
    if (data && data.length > 0) {
      setSelectedProject(data[0].id);
    }
    setLoading(false);
  };

  const fetchBudget = async () => {
    const { data } = await supabase
      .from("project_budgets")
      .select("*")
      .eq("project_id", selectedProject)
      .single();
    
    setBudget(data);
    if (data) {
      setBudgetForm({
        original_budget: data.original_budget?.toString() || "",
        spent_amount: data.spent_amount?.toString() || "0",
        notes: data.notes || "",
      });
    }
  };

  const fetchChangeOrders = async () => {
    const { data } = await supabase
      .from("project_change_orders")
      .select("*")
      .eq("project_id", selectedProject)
      .order("requested_at", { ascending: false });
    
    setChangeOrders(data || []);
  };

  const generateOrderNumber = async (): Promise<string> => {
    const count = changeOrders.length + 1;
    return `CO-${count.toString().padStart(3, "0")}`;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      reason: "",
      amount: "",
      impact_schedule: "",
      requires_client_approval: true,
    });
    setEditingOrder(null);
  };

  const handleSaveBudget = async () => {
    const budgetData = {
      project_id: selectedProject,
      original_budget: parseFloat(budgetForm.original_budget) || 0,
      current_budget: parseFloat(budgetForm.original_budget) || 0,
      spent_amount: parseFloat(budgetForm.spent_amount) || 0,
      notes: budgetForm.notes || null,
    };

    if (budget) {
      const { error } = await supabase
        .from("project_budgets")
        .update(budgetData)
        .eq("id", budget.id);

      if (error) {
        toast.error("Erro ao atualizar orçamento");
        return;
      }
    } else {
      const { error } = await supabase
        .from("project_budgets")
        .insert(budgetData);

      if (error) {
        toast.error("Erro ao criar orçamento");
        return;
      }
    }

    toast.success("Orçamento guardado");
    setBudgetDialogOpen(false);
    fetchBudget();
  };

  const handleSubmitOrder = async () => {
    if (!formData.title || !formData.amount) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const orderNumber = editingOrder ? editingOrder.order_number : await generateOrderNumber();

    const orderData = {
      project_id: selectedProject,
      order_number: orderNumber,
      title: formData.title,
      description: formData.description || null,
      reason: formData.reason || null,
      amount: parseFloat(formData.amount),
      impact_schedule: formData.impact_schedule || null,
      requires_client_approval: formData.requires_client_approval,
      status: editingOrder?.status || "pending",
    };

    if (editingOrder) {
      const { error } = await supabase
        .from("project_change_orders")
        .update(orderData)
        .eq("id", editingOrder.id);

      if (error) {
        toast.error("Erro ao atualizar extra");
        return;
      }
      toast.success("Extra atualizado");
    } else {
      const { error } = await supabase
        .from("project_change_orders")
        .insert(orderData);

      if (error) {
        toast.error("Erro ao criar extra");
        return;
      }
      toast.success("Extra criado");
    }

    setDialogOpen(false);
    resetForm();
    fetchChangeOrders();
  };

  const handleApprove = async (order: ChangeOrder) => {
    const { error } = await supabase
      .from("project_change_orders")
      .update({ 
        status: "approved",
        decided_at: new Date().toISOString()
      })
      .eq("id", order.id);

    if (error) {
      toast.error("Erro ao aprovar extra");
    } else {
      toast.success("Extra aprovado");
      fetchChangeOrders();
      fetchBudget();
    }
  };

  const handleReject = async (order: ChangeOrder) => {
    const { error } = await supabase
      .from("project_change_orders")
      .update({ 
        status: "rejected",
        decided_at: new Date().toISOString()
      })
      .eq("id", order.id);

    if (error) {
      toast.error("Erro ao rejeitar extra");
    } else {
      toast.success("Extra rejeitado");
      fetchChangeOrders();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem a certeza que deseja eliminar este extra?")) return;

    const { error } = await supabase
      .from("project_change_orders")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Erro ao eliminar extra");
    } else {
      toast.success("Extra eliminado");
      fetchChangeOrders();
    }
  };

  const handleEdit = (order: ChangeOrder) => {
    setEditingOrder(order);
    setFormData({
      title: order.title,
      description: order.description || "",
      reason: order.reason || "",
      amount: order.amount.toString(),
      impact_schedule: order.impact_schedule || "",
      requires_client_approval: order.requires_client_approval,
    });
    setDialogOpen(true);
  };

  // Calculate totals
  const approvedExtras = changeOrders
    .filter(o => o.status === "approved")
    .reduce((sum, o) => sum + o.amount, 0);

  const pendingExtras = changeOrders
    .filter(o => o.status === "pending")
    .reduce((sum, o) => sum + o.amount, 0);

  const originalBudget = budget?.original_budget || 0;
  const currentBudget = originalBudget + approvedExtras;
  const spentAmount = budget?.spent_amount || 0;
  const spentPercentage = currentBudget > 0 ? (spentAmount / currentBudget) * 100 : 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Project Selector */}
      <div className="flex items-center gap-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Selecionar projeto..." />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedProject && (
        <>
          {/* Budget Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Euro className="h-5 w-5" />
                Orçamento do Projeto
              </CardTitle>
              <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-2" />
                    {budget ? "Editar" : "Definir"} Orçamento
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Orçamento do Projeto</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Orçamento Original (€)</Label>
                      <Input
                        type="number"
                        value={budgetForm.original_budget}
                        onChange={(e) => setBudgetForm({ ...budgetForm, original_budget: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Valor Gasto (€)</Label>
                      <Input
                        type="number"
                        value={budgetForm.spent_amount}
                        onChange={(e) => setBudgetForm({ ...budgetForm, spent_amount: e.target.value })}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notas</Label>
                      <Textarea
                        value={budgetForm.notes}
                        onChange={(e) => setBudgetForm({ ...budgetForm, notes: e.target.value })}
                        placeholder="Notas sobre o orçamento..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setBudgetDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveBudget}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Orçamento Original</p>
                  <p className="text-2xl font-bold">
                    €{originalBudget.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    Extras Aprovados
                    {approvedExtras > 0 && <TrendingUp className="h-3 w-3 text-amber-500" />}
                  </p>
                  <p className="text-2xl font-bold text-amber-600">
                    +€{approvedExtras.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                  <p className="text-sm text-muted-foreground">Orçamento Atual</p>
                  <p className="text-2xl font-bold text-accent">
                    €{currentBudget.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Gasto</p>
                  <p className="text-2xl font-bold">
                    €{spentAmount.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Utilização do orçamento</span>
                  <span className="font-medium">{Math.round(spentPercentage)}%</span>
                </div>
                <Progress 
                  value={Math.min(spentPercentage, 100)} 
                  className={spentPercentage > 90 ? "bg-destructive/20" : ""}
                />
                {spentPercentage > 90 && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Orçamento quase esgotado
                  </p>
                )}
              </div>

              {pendingExtras > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-amber-600 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    €{pendingExtras.toLocaleString("pt-PT", { minimumFractionDigits: 2 })} em extras pendentes de aprovação
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Extras / Alterações
              </CardTitle>
              <Dialog open={dialogOpen} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Extra
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingOrder ? "Editar Extra" : "Novo Extra"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Título *</Label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: Alteração de revestimento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição</Label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descrição do extra..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Valor (€) *</Label>
                        <Input
                          type="number"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Motivo</Label>
                        <Select
                          value={formData.reason}
                          onValueChange={(value) => setFormData({ ...formData, reason: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar..." />
                          </SelectTrigger>
                          <SelectContent>
                            {reasons.map((reason) => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Impacto no Cronograma</Label>
                      <Input
                        value={formData.impact_schedule}
                        onChange={(e) => setFormData({ ...formData, impact_schedule: e.target.value })}
                        placeholder="Ex: +2 semanas, Sem impacto"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="requires_approval"
                        checked={formData.requires_client_approval}
                        onChange={(e) => setFormData({ ...formData, requires_client_approval: e.target.checked })}
                        className="rounded"
                      />
                      <Label htmlFor="requires_approval" className="text-sm">
                        Requer aprovação do cliente
                      </Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSubmitOrder}>
                      {editingOrder ? "Atualizar" : "Criar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {changeOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum extra registado</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {changeOrders.map((order) => {
                      const status = statusConfig[order.status];
                      const StatusIcon = status.icon;
                      
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-mono text-sm">
                            {order.order_number}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.title}</p>
                              {order.impact_schedule && (
                                <p className="text-xs text-muted-foreground">
                                  Impacto: {order.impact_schedule}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {order.reason}
                          </TableCell>
                          <TableCell className="font-medium">
                            {order.amount >= 0 ? "+" : ""}€{order.amount.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell>
                            <Badge className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-1">
                              {order.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleApprove(order)}
                                    title="Aprovar"
                                  >
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleReject(order)}
                                    title="Rejeitar"
                                  >
                                    <XCircle className="h-4 w-4 text-destructive" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(order)}
                                title="Editar"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(order.id)}
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
