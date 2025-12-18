import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  Send, 
  FileText,
  Copy,
  ExternalLink,
  Euro,
  Calendar,
  Building2,
  User
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Quote {
  id: string;
  quote_number: string;
  lead_id: string | null;
  client_id: string | null;
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
  sent_at: string | null;
  viewed_at: string | null;
  accepted_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  public_token: string;
  created_at: string;
}

interface QuoteItem {
  id: string;
  quote_id: string;
  category: string | null;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total: number;
  notes: string | null;
  sort_order: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  segment: string | null;
}

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-500/10 text-blue-600",
  viewed: "bg-amber-500/10 text-amber-600",
  accepted: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-destructive/10 text-destructive",
  expired: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  draft: "Rascunho",
  sent: "Enviada",
  viewed: "Visualizada",
  accepted: "Aceite",
  rejected: "Rejeitada",
  expired: "Expirada",
};

const categories = [
  "residencial",
  "comercial",
  "industrial",
  "reabilitação",
  "interiores",
];

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    lead_id: "",
    project_title: "",
    project_description: "",
    project_location: "",
    project_category: "residencial",
    estimated_duration: "",
    payment_terms: "30% no início, 40% na estrutura, 30% na entrega",
    terms_conditions: "",
    valid_until: "",
    tax_rate: 23,
  });

  const [items, setItems] = useState<Partial<QuoteItem>[]>([
    { category: "Honorários", description: "", unit: "vg", quantity: 1, unit_price: 0, total: 0 },
  ]);

  useEffect(() => {
    fetchQuotes();
    fetchLeads();

    const channel = supabase
      .channel('quotes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quotes' },
        () => fetchQuotes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchQuotes = async () => {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar cotações");
    } else {
      setQuotes(data || []);
    }
    setLoading(false);
  };

  const fetchLeads = async () => {
    const { data } = await supabase
      .from("leads")
      .select("id, name, email, segment")
      .order("created_at", { ascending: false });
    
    setLeads(data || []);
  };

  const generateQuoteNumber = async (): Promise<string> => {
    const { data } = await supabase.rpc('generate_quote_number');
    return data || `ARIFA-${new Date().getFullYear()}-0001`;
  };

  const resetForm = () => {
    setFormData({
      lead_id: "",
      project_title: "",
      project_description: "",
      project_location: "",
      project_category: "residencial",
      estimated_duration: "",
      payment_terms: "30% no início, 40% na estrutura, 30% na entrega",
      terms_conditions: "",
      valid_until: "",
      tax_rate: 23,
    });
    setItems([
      { category: "Honorários", description: "", unit: "vg", quantity: 1, unit_price: 0, total: 0 },
    ]);
    setEditingQuote(null);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((acc, item) => acc + (item.total || 0), 0);
    const taxAmount = subtotal * (formData.tax_rate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const updateItemTotal = (index: number, quantity: number, unitPrice: number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      quantity,
      unit_price: unitPrice,
      total: quantity * unitPrice,
    };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([
      ...items,
      { category: "Honorários", description: "", unit: "un", quantity: 1, unit_price: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!formData.project_title || !formData.valid_until) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    const { subtotal, taxAmount, total } = calculateTotals();
    const quoteNumber = editingQuote ? editingQuote.quote_number : await generateQuoteNumber();

    const quoteData = {
      quote_number: quoteNumber,
      lead_id: formData.lead_id || null,
      project_title: formData.project_title,
      project_description: formData.project_description || null,
      project_location: formData.project_location || null,
      project_category: formData.project_category,
      subtotal,
      tax_rate: formData.tax_rate,
      tax_amount: taxAmount,
      total,
      estimated_duration: formData.estimated_duration || null,
      payment_terms: formData.payment_terms || null,
      terms_conditions: formData.terms_conditions || null,
      valid_until: formData.valid_until,
      status: editingQuote?.status || "draft",
    };

    if (editingQuote) {
      const { error } = await supabase
        .from("quotes")
        .update(quoteData)
        .eq("id", editingQuote.id);

      if (error) {
        toast.error("Erro ao atualizar cotação");
        return;
      }

      // Update items
      await supabase.from("quote_items").delete().eq("quote_id", editingQuote.id);
      
      const itemsToInsert = items.map((item, index) => ({
        quote_id: editingQuote.id,
        category: item.category,
        description: item.description || "",
        unit: item.unit || "un",
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        total: item.total || 0,
        sort_order: index,
      }));

      await supabase.from("quote_items").insert(itemsToInsert);

      toast.success("Cotação atualizada com sucesso");
    } else {
      const { data: newQuote, error } = await supabase
        .from("quotes")
        .insert(quoteData)
        .select()
        .single();

      if (error) {
        toast.error("Erro ao criar cotação");
        return;
      }

      // Insert items
      const itemsToInsert = items.map((item, index) => ({
        quote_id: newQuote.id,
        category: item.category,
        description: item.description || "",
        unit: item.unit || "un",
        quantity: item.quantity || 1,
        unit_price: item.unit_price || 0,
        total: item.total || 0,
        sort_order: index,
      }));

      await supabase.from("quote_items").insert(itemsToInsert);

      toast.success("Cotação criada com sucesso");
    }

    setDialogOpen(false);
    resetForm();
    fetchQuotes();
  };

  const handleEdit = async (quote: Quote) => {
    setEditingQuote(quote);
    setFormData({
      lead_id: quote.lead_id || "",
      project_title: quote.project_title,
      project_description: quote.project_description || "",
      project_location: quote.project_location || "",
      project_category: quote.project_category || "residencial",
      estimated_duration: quote.estimated_duration || "",
      payment_terms: quote.payment_terms || "",
      terms_conditions: quote.terms_conditions || "",
      valid_until: quote.valid_until,
      tax_rate: quote.tax_rate,
    });

    // Fetch items
    const { data: quoteItems } = await supabase
      .from("quote_items")
      .select("*")
      .eq("quote_id", quote.id)
      .order("sort_order");

    if (quoteItems && quoteItems.length > 0) {
      setItems(quoteItems);
    }

    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem a certeza que deseja eliminar esta cotação?")) return;

    const { error } = await supabase.from("quotes").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao eliminar cotação");
    } else {
      toast.success("Cotação eliminada");
      fetchQuotes();
    }
  };

  const handleSend = async (quote: Quote) => {
    // Get recipient email from lead
    let recipientEmail = "";
    let recipientName = "";

    if (quote.lead_id) {
      const lead = leads.find(l => l.id === quote.lead_id);
      if (lead) {
        recipientEmail = lead.email;
        recipientName = lead.name;
      }
    }

    if (!recipientEmail) {
      // Fallback: just mark as sent without email
      const { error } = await supabase
        .from("quotes")
        .update({ 
          status: "sent",
          sent_at: new Date().toISOString() 
        })
        .eq("id", quote.id);

      if (error) {
        toast.error("Erro ao enviar cotação");
      } else {
        toast.success("Cotação marcada como enviada (sem email - lead sem email)");
        fetchQuotes();
      }
      return;
    }

    // Send via edge function
    toast.info("A enviar cotação por email...");

    try {
      const { data, error } = await supabase.functions.invoke("send-quote-email", {
        body: {
          quoteId: quote.id,
          recipientEmail,
          recipientName
        }
      });

      if (error) throw error;

      toast.success("Cotação enviada com sucesso por email!");
      fetchQuotes();
    } catch (error) {
      console.error("Error sending quote:", error);
      toast.error("Erro ao enviar cotação por email");
    }
  };

  const copyPublicLink = (token: string) => {
    const url = `${window.location.origin}/cotacao/${token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiado para a área de transferência");
  };

  const filteredQuotes = quotes.filter(q => {
    if (activeTab === "all") return true;
    return q.status === activeTab;
  });

  const { subtotal, taxAmount, total } = calculateTotals();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Cotações
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Cotação
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingQuote ? "Editar Cotação" : "Nova Cotação"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Lead Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Lead (opcional)</Label>
                  <Select
                    value={formData.lead_id}
                    onValueChange={(value) => setFormData({ ...formData, lead_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar lead..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Nenhum</SelectItem>
                      {leads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.name} - {lead.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Validade *</Label>
                  <Input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Project Info */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Informação do Projeto
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Título do Projeto *</Label>
                    <Input
                      value={formData.project_title}
                      onChange={(e) => setFormData({ ...formData, project_title: e.target.value })}
                      placeholder="Ex: Moradia Unifamiliar - Cascais"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={formData.project_category}
                      onValueChange={(value) => setFormData({ ...formData, project_category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Localização</Label>
                    <Input
                      value={formData.project_location}
                      onChange={(e) => setFormData({ ...formData, project_location: e.target.value })}
                      placeholder="Ex: Cascais, Portugal"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Duração Estimada</Label>
                    <Input
                      value={formData.estimated_duration}
                      onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                      placeholder="Ex: 12-18 meses"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={formData.project_description}
                    onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
                    placeholder="Descrição do projeto..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    Itens da Cotação
                  </h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-muted/30 rounded-lg">
                      <div className="col-span-2">
                        <Label className="text-xs">Categoria</Label>
                        <Select
                          value={item.category || ""}
                          onValueChange={(value) => {
                            const newItems = [...items];
                            newItems[index].category = value;
                            setItems(newItems);
                          }}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Honorários">Honorários</SelectItem>
                            <SelectItem value="Especialidades">Especialidades</SelectItem>
                            <SelectItem value="Taxas">Taxas</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-4">
                        <Label className="text-xs">Descrição</Label>
                        <Input
                          className="h-9"
                          value={item.description || ""}
                          onChange={(e) => {
                            const newItems = [...items];
                            newItems[index].description = e.target.value;
                            setItems(newItems);
                          }}
                          placeholder="Descrição do serviço..."
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Un.</Label>
                        <Select
                          value={item.unit || "un"}
                          onValueChange={(value) => {
                            const newItems = [...items];
                            newItems[index].unit = value;
                            setItems(newItems);
                          }}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="un">un</SelectItem>
                            <SelectItem value="vg">vg</SelectItem>
                            <SelectItem value="m2">m²</SelectItem>
                            <SelectItem value="h">h</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Qtd</Label>
                        <Input
                          className="h-9"
                          type="number"
                          min="1"
                          value={item.quantity || 1}
                          onChange={(e) => updateItemTotal(index, parseFloat(e.target.value) || 1, item.unit_price || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Label className="text-xs">Preço Unit. (€)</Label>
                        <Input
                          className="h-9"
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price || ""}
                          onChange={(e) => updateItemTotal(index, item.quantity || 1, parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-1">
                        <Label className="text-xs">Total</Label>
                        <div className="h-9 flex items-center font-medium">
                          €{(item.total || 0).toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>€{subtotal.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">IVA ({formData.tax_rate}%):</span>
                      <span>€{taxAmount.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>€{total.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="space-y-4">
                <h3 className="font-semibold">Condições</h3>
                <div className="space-y-2">
                  <Label>Condições de Pagamento</Label>
                  <Input
                    value={formData.payment_terms}
                    onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                    placeholder="Ex: 30% no início, 40% na estrutura, 30% na entrega"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Termos e Condições</Label>
                  <Textarea
                    value={formData.terms_conditions}
                    onChange={(e) => setFormData({ ...formData, terms_conditions: e.target.value })}
                    placeholder="Termos e condições adicionais..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingQuote ? "Atualizar" : "Criar"} Cotação
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas ({quotes.length})</TabsTrigger>
            <TabsTrigger value="draft">Rascunhos</TabsTrigger>
            <TabsTrigger value="sent">Enviadas</TabsTrigger>
            <TabsTrigger value="accepted">Aceites</TabsTrigger>
            <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma cotação encontrada</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-mono text-sm">
                        {quote.quote_number}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{quote.project_title}</p>
                          {quote.project_location && (
                            <p className="text-sm text-muted-foreground">{quote.project_location}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        €{quote.total.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {format(new Date(quote.valid_until), "d MMM yyyy", { locale: pt })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[quote.status]}>
                          {statusLabels[quote.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyPublicLink(quote.public_token)}
                            title="Copiar link público"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            title="Ver cotação"
                          >
                            <a href={`/cotacao/${quote.public_token}`} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          {quote.status === "draft" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSend(quote)}
                              title="Marcar como enviada"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(quote)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(quote.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
