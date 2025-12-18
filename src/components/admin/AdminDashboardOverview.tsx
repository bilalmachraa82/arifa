import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Users, 
  Mail, 
  TrendingUp, 
  TrendingDown,
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building2,
  History,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
  Eye
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardMetrics {
  totalProjects: number;
  publishedProjects: number;
  projectsByStatus: { name: string; value: number; color: string }[];
  totalLeads: number;
  leadsByStatus: { name: string; value: number; color: string }[];
  leadsBySegment: { name: string; value: number }[];
  conversionRate: number;
  recentLeads: number;
  previousWeekLeads: number;
  totalClients: number;
  todayAuditActions: number;
  recentAuditActions: { action: string; count: number }[];
  leadsOverTime: { date: string; leads: number; name: string }[];
  unreadMessages: number;
  avgLeadScore: number;
  highPriorityLeads: number;
}

const statusColors: Record<string, string> = {
  "new": "hsl(174 45% 45%)",
  "contacted": "hsl(43 74% 49%)",
  "qualified": "hsl(142 42% 45%)",
  "proposal": "hsl(12 76% 61%)",
  "negotiation": "hsl(220 70% 55%)",
  "won": "hsl(142 70% 45%)",
  "lost": "hsl(0 70% 50%)",
};

const projectStatusColors: Record<string, string> = {
  "Em projeto": "hsl(43 74% 49%)",
  "Em construção": "hsl(174 45% 45%)",
  "Concluído": "hsl(142 42% 45%)",
  "Em estudo": "hsl(12 76% 61%)",
};

const segmentLabels: Record<string, string> = {
  "privado": "Privados",
  "empresas": "Empresas",
  "investidores": "Investidores",
};

const statusLabels: Record<string, string> = {
  "new": "Novo",
  "contacted": "Contactado",
  "qualified": "Qualificado",
  "proposal": "Proposta",
  "negotiation": "Negociação",
  "won": "Ganho",
  "lost": "Perdido",
};

const AdminDashboardOverview = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();

    // Set up real-time subscription for leads
    const leadsChannel = supabase
      .channel("dashboard-leads")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => fetchMetrics()
      )
      .subscribe();

    // Set up real-time subscription for messages
    const messagesChannel = supabase
      .channel("dashboard-messages")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "client_messages" },
        () => fetchMetrics()
      )
      .subscribe();

    // Set up real-time subscription for projects
    const projectsChannel = supabase
      .channel("dashboard-projects")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "projects" },
        () => fetchMetrics()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(leadsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(projectsChannel);
    };
  }, []);

  const fetchMetrics = async () => {
    try {
      const [projectsRes, leadsRes, clientsRes, auditRes, messagesRes] = await Promise.all([
        supabase.from("projects").select("id, status, is_published"),
        supabase.from("leads").select("id, status, segment, created_at, ai_score"),
        supabase.from("profiles").select("id"),
        supabase.from("audit_logs").select("action, created_at").gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        supabase.from("client_messages").select("id, is_read, sender_id").eq("is_read", false),
      ]);

      const projects = projectsRes.data || [];
      const leads = leadsRes.data || [];
      const clients = clientsRes.data || [];
      const auditLogs = auditRes.data || [];
      const messages = messagesRes.data || [];

      // Process projects by status
      const projectStatusCounts: Record<string, number> = {};
      projects.forEach((p) => {
        const status = p.status || "Em projeto";
        projectStatusCounts[status] = (projectStatusCounts[status] || 0) + 1;
      });

      const projectsByStatus = Object.entries(projectStatusCounts).map(([name, value]) => ({
        name,
        value,
        color: projectStatusColors[name] || "hsl(0 0% 50%)",
      }));

      // Process leads by status
      const leadStatusCounts: Record<string, number> = {};
      leads.forEach((l) => {
        const status = l.status || "new";
        leadStatusCounts[status] = (leadStatusCounts[status] || 0) + 1;
      });

      const leadsByStatus = Object.entries(leadStatusCounts).map(([name, value]) => ({
        name: statusLabels[name] || name,
        value,
        color: statusColors[name] || "hsl(0 0% 50%)",
      }));

      // Process leads by segment
      const segmentCounts: Record<string, number> = {};
      leads.forEach((l) => {
        const segment = l.segment || "outro";
        segmentCounts[segment] = (segmentCounts[segment] || 0) + 1;
      });

      const leadsBySegment = Object.entries(segmentCounts).map(([name, value]) => ({
        name: segmentLabels[name] || name,
        value,
      }));

      // Calculate conversion rate
      const wonLeads = leadStatusCounts["won"] || 0;
      const totalLeads = leads.length;
      const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

      // Recent leads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentLeads = leads.filter((l) => new Date(l.created_at || "") > sevenDaysAgo).length;

      // Previous week leads (8-14 days ago)
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      const previousWeekLeads = leads.filter(
        (l) => {
          const date = new Date(l.created_at || "");
          return date > fourteenDaysAgo && date <= sevenDaysAgo;
        }
      ).length;

      // Leads over time (last 30 days grouped by day)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const leadsByDay: Record<string, number> = {};
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        leadsByDay[dateStr] = 0;
      }

      leads.forEach((l) => {
        if (l.created_at) {
          const dateStr = l.created_at.split("T")[0];
          if (leadsByDay[dateStr] !== undefined) {
            leadsByDay[dateStr]++;
          }
        }
      });

      const leadsOverTime = Object.entries(leadsByDay).map(([date, count]) => ({
        date,
        leads: count,
        name: new Date(date).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" }),
      }));

      // Process audit actions
      const auditActionCounts: Record<string, number> = {};
      auditLogs.forEach((log) => {
        const action = log.action || "unknown";
        auditActionCounts[action] = (auditActionCounts[action] || 0) + 1;
      });

      const recentAuditActions = Object.entries(auditActionCounts).map(([action, count]) => ({ action, count }));

      // Calculate average AI score
      const leadsWithScore = leads.filter((l) => l.ai_score !== null);
      const avgLeadScore = leadsWithScore.length > 0 
        ? leadsWithScore.reduce((sum, l) => sum + (l.ai_score || 0), 0) / leadsWithScore.length 
        : 0;

      // High priority leads (score >= 70)
      const highPriorityLeads = leadsWithScore.filter((l) => (l.ai_score || 0) >= 70).length;

      setMetrics({
        totalProjects: projects.length,
        publishedProjects: projects.filter((p) => p.is_published).length,
        projectsByStatus,
        totalLeads,
        leadsByStatus,
        leadsBySegment,
        conversionRate,
        recentLeads,
        previousWeekLeads,
        totalClients: clients.length,
        todayAuditActions: auditLogs.length,
        recentAuditActions,
        leadsOverTime,
        unreadMessages: messages.length,
        avgLeadScore,
        highPriorityLeads,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Erro ao carregar métricas
        </CardContent>
      </Card>
    );
  }

  const chartConfig = {
    projects: { label: "Projetos", color: "hsl(174 45% 45%)" },
    leads: { label: "Leads", color: "hsl(12 76% 61%)" },
  };

  const leadsGrowth = metrics.previousWeekLeads > 0 
    ? ((metrics.recentLeads - metrics.previousWeekLeads) / metrics.previousWeekLeads) * 100 
    : metrics.recentLeads > 0 ? 100 : 0;

  return (
    <div className="space-y-6">
      {/* Real-time indicator */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Atualização em tempo real
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[hsl(174,45%,45%)] hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Projetos</p>
                <p className="text-3xl font-bold">{metrics.totalProjects}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {metrics.publishedProjects} publicados
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(12,76%,61%)] hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                <p className="text-3xl font-bold">{metrics.totalLeads}</p>
                <div className="flex items-center gap-1 mt-1">
                  {leadsGrowth >= 0 ? (
                    <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 text-xs">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +{leadsGrowth.toFixed(0)}%
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 text-xs">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      {leadsGrowth.toFixed(0)}%
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">vs semana anterior</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-[hsl(12,76%,61%)]/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-[hsl(12,76%,61%)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(142,42%,45%)] hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa Conversão</p>
                <p className="text-3xl font-bold">{metrics.conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Leads → Clientes
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[hsl(142,42%,45%)]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[hsl(142,42%,45%)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(43,74%,49%)] hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clientes</p>
                <p className="text-3xl font-bold">{metrics.totalClients}</p>
                <p className="text-xs text-muted-foreground mt-1">Utilizadores registados</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[hsl(43,74%,49%)]/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-[hsl(43,74%,49%)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mensagens Não Lidas</p>
                <p className="text-2xl font-bold">{metrics.unreadMessages}</p>
              </div>
              <Badge variant={metrics.unreadMessages > 0 ? "destructive" : "secondary"}>
                {metrics.unreadMessages > 0 ? "Atenção" : "OK"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leads Prioritários</p>
                <p className="text-2xl font-bold">{metrics.highPriorityLeads}</p>
                <p className="text-xs text-muted-foreground">Score AI ≥ 70</p>
              </div>
              <Zap className="h-6 w-6 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Score Médio AI</p>
                <p className="text-2xl font-bold">{metrics.avgLeadScore.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Qualidade dos leads</p>
              </div>
              <Activity className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ações Hoje</p>
                <p className="text-2xl font-bold">{metrics.todayAuditActions}</p>
                <p className="text-xs text-muted-foreground">Registos auditoria</p>
              </div>
              <History className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Over Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Evolução de Leads (30 dias)</CardTitle>
          <CardDescription>Tendência de novos leads ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <AreaChart data={metrics.leadsOverTime}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(174 45% 45%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(174 45% 45%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 11 }} 
                interval="preserveStartEnd"
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11 }} 
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="leads" 
                stroke="hsl(174 45% 45%)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorLeads)" 
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Status - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Leads por Status</CardTitle>
            <CardDescription>Distribuição atual do pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.leadsByStatus.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[280px]">
                <PieChart>
                  <Pie
                    data={metrics.leadsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {metrics.leadsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                Nenhum lead registado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects by Status - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Projetos por Estado</CardTitle>
            <CardDescription>Estado atual dos projetos</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.projectsByStatus.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[280px]">
                <BarChart data={metrics.projectsByStatus} layout="vertical">
                  <XAxis type="number" tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {metrics.projectsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                Nenhum projeto registado
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Segment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Leads por Segmento</CardTitle>
            <CardDescription>Distribuição por tipo de cliente</CardDescription>
          </CardHeader>
          <CardContent>
            {metrics.leadsBySegment.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[280px]">
                <BarChart data={metrics.leadsBySegment}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="hsl(174 45% 45%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                Nenhum lead registado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Summary with progress bars */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Pipeline de Vendas</CardTitle>
            <CardDescription>Funil de conversão</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.leadsByStatus.map((status) => {
                const percentage = metrics.totalLeads > 0 ? (status.value / metrics.totalLeads) * 100 : 0;
                return (
                  <div key={status.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{status.name}</span>
                      <span className="text-muted-foreground">{status.value} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, backgroundColor: status.color }}
                      />
                    </div>
                  </div>
                );
              })}
              {metrics.leadsByStatus.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">Nenhum lead no pipeline</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
