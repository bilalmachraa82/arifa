import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown,
  Users,
  FileText,
  Euro,
  Target,
  ArrowRight,
  BarChart3,
  Clock,
  FolderOpen,
  CheckCircle2,
  AlertCircle,
  Zap,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  Calendar
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList } from "recharts";
import { format, subDays, subMonths, eachDayOfInterval, eachMonthOfInterval } from "date-fns";
import { pt } from "date-fns/locale";

interface KPIData {
  totalLeads: number;
  previousLeads: number;
  totalQuotes: number;
  previousQuotes: number;
  acceptedQuotes: number;
  rejectedQuotes: number;
  pendingQuotes: number;
  totalClients: number;
  conversionRate: number;
  averageQuoteValue: number;
  totalRevenue: number;
  previousRevenue: number;
  pipelineValue: number;
  leadsBySegment: { name: string; value: number; color: string }[];
  quotesByStatus: { name: string; value: number; fill: string }[];
  leadsOverTime: { date: string; leads: number; quotes: number }[];
  activeProjects: { id: string; title: string; status: string; progress: number; client: string }[];
  funnelData: { name: string; value: number; fill: string }[];
}

const COLORS = {
  accent: "hsl(var(--accent))",
  coral: "#ED6E65",
  yellow: "#E6B21E",
  green: "#10B981",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  gray: "#6B7280"
};

const SEGMENT_COLORS: Record<string, string> = {
  privado: COLORS.accent,
  empresas: COLORS.coral,
  investidores: COLORS.yellow,
  outro: COLORS.gray
};

const STATUS_COLORS: Record<string, string> = {
  draft: COLORS.gray,
  sent: COLORS.blue,
  viewed: COLORS.purple,
  accepted: COLORS.green,
  rejected: COLORS.coral,
  expired: "#9CA3AF"
};

const periods = [
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "1y", label: "1 ano" },
];

export default function AdminDashboardKPIs() {
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [data, setData] = useState<KPIData>({
    totalLeads: 0,
    previousLeads: 0,
    totalQuotes: 0,
    previousQuotes: 0,
    acceptedQuotes: 0,
    rejectedQuotes: 0,
    pendingQuotes: 0,
    totalClients: 0,
    conversionRate: 0,
    averageQuoteValue: 0,
    totalRevenue: 0,
    previousRevenue: 0,
    pipelineValue: 0,
    leadsBySegment: [],
    quotesByStatus: [],
    leadsOverTime: [],
    activeProjects: [],
    funnelData: [],
  });

  useEffect(() => {
    fetchData();

    // Real-time subscriptions
    const leadsChannel = supabase
      .channel("kpi-leads")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => fetchData())
      .subscribe();

    const quotesChannel = supabase
      .channel("kpi-quotes")
      .on("postgres_changes", { event: "*", schema: "public", table: "quotes" }, () => fetchData())
      .subscribe();

    const projectsChannel = supabase
      .channel("kpi-projects")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(quotesChannel);
      supabase.removeChannel(projectsChannel);
    };
  }, [period]);

  const getDateRange = () => {
    const now = new Date();
    switch (period) {
      case "7d":
        return { start: subDays(now, 7), end: now, prevStart: subDays(now, 14), prevEnd: subDays(now, 7) };
      case "30d":
        return { start: subDays(now, 30), end: now, prevStart: subDays(now, 60), prevEnd: subDays(now, 30) };
      case "90d":
        return { start: subDays(now, 90), end: now, prevStart: subDays(now, 180), prevEnd: subDays(now, 90) };
      case "1y":
        return { start: subMonths(now, 12), end: now, prevStart: subMonths(now, 24), prevEnd: subMonths(now, 12) };
      default:
        return { start: subDays(now, 30), end: now, prevStart: subDays(now, 60), prevEnd: subDays(now, 30) };
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const { start, end, prevStart, prevEnd } = getDateRange();

    try {
      // Parallel fetches for better performance
      const [leadsRes, prevLeadsRes, quotesRes, prevQuotesRes, clientsRes, projectsRes, milestonesRes] = await Promise.all([
        supabase.from("leads").select("*").gte("created_at", start.toISOString()).lte("created_at", end.toISOString()),
        supabase.from("leads").select("id").gte("created_at", prevStart.toISOString()).lt("created_at", prevEnd.toISOString()),
        supabase.from("quotes").select("*").gte("created_at", start.toISOString()).lte("created_at", end.toISOString()),
        supabase.from("quotes").select("id, total, status").gte("created_at", prevStart.toISOString()).lt("created_at", prevEnd.toISOString()),
        supabase.from("user_roles").select("*").eq("role", "client"),
        supabase.from("projects").select("id, title, status, client_id, profiles(full_name)").in("status", ["Em projeto", "Em construção", "Em estudo"]),
        supabase.from("project_milestones").select("project_id, is_completed"),
      ]);

      // Pipeline quotes (sent or viewed)
      const { data: pipelineQuotes } = await supabase.from("quotes").select("total").in("status", ["sent", "viewed"]);

      const leads = leadsRes.data || [];
      const prevLeads = prevLeadsRes.data || [];
      const quotes = quotesRes.data || [];
      const prevQuotes = prevQuotesRes.data || [];
      const clients = clientsRes.data || [];
      const projects = projectsRes.data || [];
      const milestones = milestonesRes.data || [];

      // KPI calculations
      const totalLeads = leads.length;
      const previousLeads = prevLeads.length;
      const totalQuotes = quotes.length;
      const previousQuotes = prevQuotes.length;
      const acceptedQuotes = quotes.filter(q => q.status === "accepted").length;
      const rejectedQuotes = quotes.filter(q => q.status === "rejected").length;
      const pendingQuotes = quotes.filter(q => ["sent", "viewed"].includes(q.status)).length;
      const totalClients = clients.length;

      // Conversion rate: accepted quotes / total leads
      const conversionRate = totalLeads > 0 ? Math.round((acceptedQuotes / totalLeads) * 100) : 0;

      // Revenue from accepted quotes
      const acceptedQuotesData = quotes.filter(q => q.status === "accepted");
      const totalRevenue = acceptedQuotesData.reduce((sum, q) => sum + (q.total || 0), 0);
      const previousRevenue = prevQuotes.filter(q => q.status === "accepted").reduce((sum, q) => sum + (q.total || 0), 0);
      const averageQuoteValue = acceptedQuotesData.length > 0 ? totalRevenue / acceptedQuotesData.length : 0;

      // Pipeline value
      const pipelineValue = pipelineQuotes?.reduce((sum, q) => sum + (q.total || 0), 0) || 0;

      // Leads by segment
      const segmentCounts: Record<string, number> = {};
      leads.forEach(lead => {
        const segment = lead.segment || "outro";
        segmentCounts[segment] = (segmentCounts[segment] || 0) + 1;
      });
      const segmentLabels: Record<string, string> = {
        privado: "Privados",
        empresas: "Empresas",
        investidores: "Investidores",
        outro: "Outros"
      };
      const leadsBySegment = Object.entries(segmentCounts).map(([key, value]) => ({
        name: segmentLabels[key] || key,
        value,
        color: SEGMENT_COLORS[key] || COLORS.gray
      }));

      // Quotes by status
      const statusCounts: Record<string, number> = {};
      quotes.forEach(quote => {
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
        value,
        fill: STATUS_COLORS[status] || COLORS.gray
      }));

      // Leads over time
      const days = period === "1y"
        ? eachMonthOfInterval({ start, end })
        : eachDayOfInterval({ start, end });

      const leadsOverTime = days.map(day => {
        const dayStr = format(day, period === "1y" ? "yyyy-MM" : "yyyy-MM-dd");
        const dayLeads = leads.filter(l => {
          const leadDate = format(new Date(l.created_at), period === "1y" ? "yyyy-MM" : "yyyy-MM-dd");
          return leadDate === dayStr;
        }).length;
        const dayQuotes = quotes.filter(q => {
          const quoteDate = format(new Date(q.created_at), period === "1y" ? "yyyy-MM" : "yyyy-MM-dd");
          return quoteDate === dayStr;
        }).length;

        return {
          date: format(day, period === "1y" ? "MMM" : "d MMM", { locale: pt }),
          leads: dayLeads,
          quotes: dayQuotes,
        };
      });

      // Active projects with progress
      const activeProjects = projects.map(p => {
        const projectMilestones = milestones.filter(m => m.project_id === p.id);
        const completedMilestones = projectMilestones.filter(m => m.is_completed).length;
        const totalMilestones = projectMilestones.length;
        const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

        return {
          id: p.id,
          title: p.title,
          status: p.status || "Em projeto",
          progress,
          client: (p.profiles as { full_name: string } | null)?.full_name || "—"
        };
      }).slice(0, 5);

      // Funnel data
      const funnelData = [
        { name: "Leads", value: totalLeads, fill: COLORS.blue },
        { name: "Cotações", value: totalQuotes, fill: COLORS.yellow },
        { name: "Pendentes", value: pendingQuotes, fill: COLORS.purple },
        { name: "Aceites", value: acceptedQuotes, fill: COLORS.green },
      ];

      setData({
        totalLeads,
        previousLeads,
        totalQuotes,
        previousQuotes,
        acceptedQuotes,
        rejectedQuotes,
        pendingQuotes,
        totalClients,
        conversionRate,
        averageQuoteValue,
        totalRevenue,
        previousRevenue,
        pipelineValue,
        leadsBySegment,
        quotesByStatus,
        leadsOverTime,
        activeProjects,
        funnelData,
      });
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching KPIs:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const leadsGrowth = calculateGrowth(data.totalLeads, data.previousLeads);
  const quotesGrowth = calculateGrowth(data.totalQuotes, data.previousQuotes);
  const revenueGrowth = calculateGrowth(data.totalRevenue, data.previousRevenue);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/3" />
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
      {/* Header with Period Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-accent" />
          <div>
            <h2 className="text-xl font-bold">Dashboard em Tempo Real</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Última atualização: {format(lastUpdate, "HH:mm:ss", { locale: pt })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </Button>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-32">
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
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Leads</p>
                <p className="text-3xl font-bold">{data.totalLeads}</p>
                <div className="flex items-center gap-1 mt-1">
                  {leadsGrowth >= 0 ? (
                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +{leadsGrowth}%
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs gap-1">
                      <ArrowDownRight className="h-3 w-3" />
                      {leadsGrowth}%
                    </Badge>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cotações</p>
                <p className="text-3xl font-bold">{data.totalQuotes}</p>
                <div className="flex items-center gap-1 mt-1">
                  {quotesGrowth >= 0 ? (
                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +{quotesGrowth}%
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs gap-1">
                      <ArrowDownRight className="h-3 w-3" />
                      {quotesGrowth}%
                    </Badge>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa Conversão</p>
                <p className="text-3xl font-bold">{data.conversionRate}%</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Lead → Cliente
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">
                  €{data.totalRevenue.toLocaleString("pt-PT", { minimumFractionDigits: 0 })}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {revenueGrowth >= 0 ? (
                    <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      +{revenueGrowth}%
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs gap-1">
                      <ArrowDownRight className="h-3 w-3" />
                      {revenueGrowth}%
                    </Badge>
                  )}
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Euro className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline & Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pipeline Comercial</p>
                <p className="text-4xl font-bold text-accent">
                  €{data.pipelineValue.toLocaleString("pt-PT", { minimumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.pendingQuotes} cotações pendentes de resposta
                </p>
              </div>
              <Badge className="bg-accent text-accent-foreground gap-1">
                <Clock className="h-3 w-3" />
                Aguarda resposta
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Valor Médio</p>
                <p className="text-2xl font-bold">
                  €{data.averageQuoteValue.toLocaleString("pt-PT", { minimumFractionDigits: 0 })}
                </p>
              </div>
              <Euro className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>{data.acceptedQuotes} aceites</span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <span>{data.rejectedQuotes} rejeitadas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500" />
            Funil de Conversão
          </CardTitle>
          <CardDescription>Jornada do lead ao cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {data.funnelData.map((step, index) => {
              const prevValue = index > 0 ? data.funnelData[index - 1].value : step.value;
              const dropRate = prevValue > 0 ? Math.round((1 - step.value / prevValue) * 100) : 0;

              return (
                <div key={step.name} className="flex items-center flex-1">
                  <div className="flex-1 text-center p-3 md:p-4 rounded-lg" style={{ backgroundColor: `${step.fill}15` }}>
                    <p className="text-2xl md:text-3xl font-bold" style={{ color: step.fill }}>
                      {step.value}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">{step.name}</p>
                    {index > 0 && dropRate > 0 && (
                      <p className="text-xs text-red-500 mt-1">-{dropRate}%</p>
                    )}
                  </div>
                  {index < data.funnelData.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground mx-1 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts & Active Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Leads & Cotações</CardTitle>
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
                    stroke={COLORS.blue}
                    fill={COLORS.blue}
                    fillOpacity={0.3}
                    name="Leads"
                  />
                  <Area
                    type="monotone"
                    dataKey="quotes"
                    stroke={COLORS.yellow}
                    fill={COLORS.yellow}
                    fillOpacity={0.3}
                    name="Cotações"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Projetos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.activeProjects.length > 0 ? (
              <div className="space-y-4">
                {data.activeProjects.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{project.title}</p>
                        <p className="text-xs text-muted-foreground">{project.client}</p>
                      </div>
                      <Badge variant="outline" className="ml-2 flex-shrink-0">
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={project.progress} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {project.progress}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FolderOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p>Sem projetos ativos</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Leads by Segment */}
        <Card>
          <CardHeader className="pb-2">
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
                      {data.leadsBySegment.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Cotações por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {data.quotesByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.quotesByStatus} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={90}
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
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Cotações" />
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
