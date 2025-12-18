import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  CheckCircle2,
  Euro,
  Target,
  ArrowRight,
  BarChart3,
  Clock
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval, subMonths } from "date-fns";
import { pt } from "date-fns/locale";

interface KPIData {
  totalLeads: number;
  totalQuotes: number;
  acceptedQuotes: number;
  totalClients: number;
  conversionRate: number;
  averageQuoteValue: number;
  pipelineValue: number;
  leadsBySegment: { name: string; value: number }[];
  quotesByStatus: { name: string; value: number }[];
  leadsOverTime: { date: string; leads: number; quotes: number }[];
  recentActivity: { type: string; title: string; date: string }[];
}

const COLORS = ["#3D7081", "#ED6E65", "#E6B21E", "#4A4A4A", "#10B981"];

const periods = [
  { value: "7d", label: "Últimos 7 dias" },
  { value: "30d", label: "Últimos 30 dias" },
  { value: "90d", label: "Últimos 90 dias" },
  { value: "1y", label: "Último ano" },
];

export default function AdminDashboardKPIs() {
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<KPIData>({
    totalLeads: 0,
    totalQuotes: 0,
    acceptedQuotes: 0,
    totalClients: 0,
    conversionRate: 0,
    averageQuoteValue: 0,
    pipelineValue: 0,
    leadsBySegment: [],
    quotesByStatus: [],
    leadsOverTime: [],
    recentActivity: [],
  });

  useEffect(() => {
    fetchData();
  }, [period]);

  const getDateRange = () => {
    const now = new Date();
    switch (period) {
      case "7d":
        return { start: subDays(now, 7), end: now };
      case "30d":
        return { start: subDays(now, 30), end: now };
      case "90d":
        return { start: subDays(now, 90), end: now };
      case "1y":
        return { start: subMonths(now, 12), end: now };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const { start, end } = getDateRange();

    try {
      // Fetch leads
      const { data: leads } = await supabase
        .from("leads")
        .select("*")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());

      // Fetch quotes
      const { data: quotes } = await supabase
        .from("quotes")
        .select("*")
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString());

      // Fetch all quotes for pipeline
      const { data: allQuotes } = await supabase
        .from("quotes")
        .select("*")
        .in("status", ["sent", "viewed"]);

      // Fetch clients
      const { data: clients } = await supabase
        .from("user_roles")
        .select("*")
        .eq("role", "client");

      // Calculate KPIs
      const totalLeads = leads?.length || 0;
      const totalQuotes = quotes?.length || 0;
      const acceptedQuotes = quotes?.filter(q => q.status === "accepted").length || 0;
      const totalClients = clients?.length || 0;
      
      const conversionRate = totalLeads > 0 
        ? Math.round((acceptedQuotes / totalLeads) * 100) 
        : 0;

      const acceptedQuotesWithValue = quotes?.filter(q => q.status === "accepted") || [];
      const averageQuoteValue = acceptedQuotesWithValue.length > 0
        ? acceptedQuotesWithValue.reduce((sum, q) => sum + q.total, 0) / acceptedQuotesWithValue.length
        : 0;

      const pipelineValue = allQuotes?.reduce((sum, q) => sum + q.total, 0) || 0;

      // Leads by segment
      const segmentCounts: Record<string, number> = {};
      leads?.forEach(lead => {
        const segment = lead.segment || "Não definido";
        segmentCounts[segment] = (segmentCounts[segment] || 0) + 1;
      });
      const leadsBySegment = Object.entries(segmentCounts).map(([name, value]) => ({ name, value }));

      // Quotes by status
      const statusCounts: Record<string, number> = {};
      quotes?.forEach(quote => {
        statusCounts[quote.status] = (statusCounts[quote.status] || 0) + 1;
      });
      const statusLabels: Record<string, string> = {
        draft: "Rascunho",
        sent: "Enviadas",
        viewed: "Visualizadas",
        accepted: "Aceites",
        rejected: "Rejeitadas",
        expired: "Expiradas"
      };
      const quotesByStatus = Object.entries(statusCounts).map(([status, value]) => ({ 
        name: statusLabels[status] || status, 
        value 
      }));

      // Leads over time
      const days = period === "1y" 
        ? eachMonthOfInterval({ start, end })
        : eachDayOfInterval({ start, end });

      const leadsOverTime = days.map(day => {
        const dayStr = format(day, period === "1y" ? "yyyy-MM" : "yyyy-MM-dd");
        const dayLeads = leads?.filter(l => {
          const leadDate = format(new Date(l.created_at), period === "1y" ? "yyyy-MM" : "yyyy-MM-dd");
          return leadDate === dayStr;
        }).length || 0;
        const dayQuotes = quotes?.filter(q => {
          const quoteDate = format(new Date(q.created_at), period === "1y" ? "yyyy-MM" : "yyyy-MM-dd");
          return quoteDate === dayStr;
        }).length || 0;

        return {
          date: format(day, period === "1y" ? "MMM" : "d MMM", { locale: pt }),
          leads: dayLeads,
          quotes: dayQuotes,
        };
      });

      setData({
        totalLeads,
        totalQuotes,
        acceptedQuotes,
        totalClients,
        conversionRate,
        averageQuoteValue,
        pipelineValue,
        leadsBySegment,
        quotesByStatus,
        leadsOverTime,
        recentActivity: [],
      });
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Dashboard de Métricas
        </h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periods.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads</p>
                <p className="text-3xl font-bold">{data.totalLeads}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cotações</p>
                <p className="text-3xl font-bold">{data.totalQuotes}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Conversão</p>
                <p className="text-3xl font-bold">{data.conversionRate}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Valor Médio</p>
                <p className="text-2xl font-bold">
                  €{data.averageQuoteValue.toLocaleString("pt-PT", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Euro className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Value */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pipeline Comercial (Cotações Pendentes)</p>
              <p className="text-4xl font-bold text-accent">
                €{data.pipelineValue.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="text-right">
              <Badge className="bg-accent text-accent-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Aguarda resposta
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Funil de Conversão</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">{data.totalLeads}</p>
              <p className="text-sm text-muted-foreground">Leads</p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 text-center p-4 rounded-lg bg-muted/50">
              <p className="text-3xl font-bold">{data.totalQuotes}</p>
              <p className="text-sm text-muted-foreground">Cotações</p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 text-center p-4 rounded-lg bg-emerald-500/10">
              <p className="text-3xl font-bold text-emerald-600">{data.acceptedQuotes}</p>
              <p className="text-sm text-muted-foreground">Aceites</p>
            </div>
            <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            <div className="flex-1 text-center p-4 rounded-lg bg-accent/10">
              <p className="text-3xl font-bold text-accent">{data.totalClients}</p>
              <p className="text-sm text-muted-foreground">Clientes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads e Cotações ao Longo do Tempo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.leadsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    className="text-xs fill-muted-foreground"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="leads" 
                    stackId="1"
                    stroke="hsl(var(--accent))" 
                    fill="hsl(var(--accent))"
                    fillOpacity={0.3}
                    name="Leads"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="quotes" 
                    stackId="2"
                    stroke="#E6B21E" 
                    fill="#E6B21E"
                    fillOpacity={0.3}
                    name="Cotações"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Leads by Segment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Leads por Segmento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {data.leadsBySegment.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.leadsBySegment}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {data.leadsBySegment.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Sem dados para este período
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quotes by Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Cotações por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              {data.quotesByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.quotesByStatus} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      width={100}
                      className="text-xs fill-muted-foreground"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--accent))" 
                      radius={[0, 4, 4, 0]}
                      name="Cotações"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Sem dados para este período
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
