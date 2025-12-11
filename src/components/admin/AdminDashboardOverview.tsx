import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FolderOpen, 
  Users, 
  Mail, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Building2
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
} from "recharts";

interface DashboardMetrics {
  totalProjects: number;
  publishedProjects: number;
  projectsByStatus: { name: string; value: number; color: string }[];
  totalLeads: number;
  leadsByStatus: { name: string; value: number; color: string }[];
  leadsBySegment: { name: string; value: number }[];
  conversionRate: number;
  recentLeads: number;
  totalClients: number;
}

const statusColors: Record<string, string> = {
  "new": "hsl(174 45% 45%)", // arifa-teal
  "contacted": "hsl(43 74% 49%)", // arifa-gold
  "qualified": "hsl(142 42% 45%)", // arifa-green
  "proposal": "hsl(12 76% 61%)", // arifa-coral
  "negotiation": "hsl(220 70% 55%)", // blue
  "won": "hsl(142 70% 45%)", // green
  "lost": "hsl(0 70% 50%)", // red
};

const projectStatusColors: Record<string, string> = {
  "Em projeto": "hsl(43 74% 49%)", // arifa-gold
  "Em construção": "hsl(174 45% 45%)", // arifa-teal
  "Concluído": "hsl(142 42% 45%)", // arifa-green
  "Em estudo": "hsl(12 76% 61%)", // arifa-coral
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
  }, []);

  const fetchMetrics = async () => {
    try {
      // Fetch projects
      const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, status, is_published");

      if (projectsError) throw projectsError;

      // Fetch leads
      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("id, status, segment, created_at");

      if (leadsError) throw leadsError;

      // Fetch clients (profiles with client role)
      const { data: clients, error: clientsError } = await supabase
        .from("profiles")
        .select("id");

      if (clientsError) throw clientsError;

      // Process projects by status
      const projectStatusCounts: Record<string, number> = {};
      projects?.forEach((p) => {
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
      leads?.forEach((l) => {
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
      leads?.forEach((l) => {
        const segment = l.segment || "outro";
        segmentCounts[segment] = (segmentCounts[segment] || 0) + 1;
      });

      const leadsBySegment = Object.entries(segmentCounts).map(([name, value]) => ({
        name: segmentLabels[name] || name,
        value,
      }));

      // Calculate conversion rate (leads won / total leads)
      const wonLeads = leadStatusCounts["won"] || 0;
      const totalLeads = leads?.length || 0;
      const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0;

      // Recent leads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentLeads = leads?.filter(
        (l) => new Date(l.created_at || "") > sevenDaysAgo
      ).length || 0;

      setMetrics({
        totalProjects: projects?.length || 0,
        publishedProjects: projects?.filter((p) => p.is_published).length || 0,
        projectsByStatus,
        totalLeads,
        leadsByStatus,
        leadsBySegment,
        conversionRate,
        recentLeads,
        totalClients: clients?.length || 0,
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
          {[...Array(4)].map((_, i) => (
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

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[hsl(174,45%,45%)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Projetos
                </p>
                <p className="text-3xl font-bold">{metrics.totalProjects}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics.publishedProjects} publicados
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(12,76%,61%)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Leads
                </p>
                <p className="text-3xl font-bold">{metrics.totalLeads}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +{metrics.recentLeads} esta semana
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[hsl(12,76%,61%)]/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-[hsl(12,76%,61%)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(142,42%,45%)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa Conversão
                </p>
                <p className="text-3xl font-bold">
                  {metrics.conversionRate.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Leads → Clientes
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[hsl(142,42%,45%)]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[hsl(142,42%,45%)]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(43,74%,49%)]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Clientes
                </p>
                <p className="text-3xl font-bold">{metrics.totalClients}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Utilizadores registados
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[hsl(43,74%,49%)]/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-[hsl(43,74%,49%)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Status - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Leads por Status</CardTitle>
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
          </CardHeader>
          <CardContent>
            {metrics.projectsByStatus.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[280px]">
                <BarChart data={metrics.projectsByStatus} layout="vertical">
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="value" 
                    radius={[0, 4, 4, 0]}
                  >
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

      {/* Second Row - Leads by Segment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Leads por Segmento</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.leadsBySegment.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[280px]">
                <BarChart data={metrics.leadsBySegment}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(174 45% 45%)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                Nenhum lead registado
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Pipeline de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.leadsByStatus.map((status) => {
                const percentage = metrics.totalLeads > 0 
                  ? (status.value / metrics.totalLeads) * 100 
                  : 0;
                return (
                  <div key={status.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{status.name}</span>
                      <span className="text-muted-foreground">
                        {status.value} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: status.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {metrics.leadsByStatus.length === 0 && (
                <div className="py-10 text-center text-muted-foreground">
                  Nenhum lead no pipeline
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardOverview;
