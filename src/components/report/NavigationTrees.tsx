import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home, Building2, Briefcase, TrendingUp, FolderOpen, FileText, Mail, 
  Settings, User, Bell, LayoutDashboard, MessageSquare, UserPlus, 
  FileCheck, Target, Users2, Building, Landmark, Lock, Shield,
  Calendar, BarChart3, Clock, Image, Folder, Upload, Eye,
  Globe, ChevronRight, ChevronDown, LogIn, Phone, Scale,
  Receipt, Send, Activity, PieChart, BookOpen, Download,
  Milestone, CreditCard, UserCheck, FolderTree
} from "lucide-react";

// Status indicator component
const StatusBadge = ({ status }: { status: "done" | "partial" | "todo" }) => {
  const config = {
    done: { label: "Implementado", className: "bg-green-500/10 text-green-600 border-green-500/20" },
    partial: { label: "Parcial", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    todo: { label: "Por fazer", className: "bg-red-500/10 text-red-600 border-red-500/20" },
  };
  
  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${config[status].className}`}>
      {config[status].label}
    </Badge>
  );
};

// Tree node component
interface TreeNodeProps {
  icon: React.ElementType;
  label: string;
  path?: string;
  status?: "done" | "partial" | "todo";
  children?: React.ReactNode;
  depth?: number;
  isLast?: boolean;
}

const TreeNode = ({ icon: Icon, label, path, status, children, depth = 0, isLast = false }: TreeNodeProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = !!children;
  
  return (
    <div className="relative">
      {/* Vertical connecting line */}
      {depth > 0 && !isLast && (
        <div 
          className="absolute left-0 top-0 bottom-0 border-l-2 border-border"
          style={{ marginLeft: `${(depth - 1) * 24 + 8}px` }}
        />
      )}
      
      <div 
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors group ${hasChildren ? 'cursor-pointer' : ''}`}
        style={{ paddingLeft: `${depth * 24 + 8}px` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {/* Horizontal connector line */}
        {depth > 0 && (
          <div 
            className="absolute h-0.5 bg-border"
            style={{ 
              left: `${(depth - 1) * 24 + 8}px`, 
              width: '16px',
              top: '50%',
              transform: 'translateY(-50%)'
            }}
          />
        )}
        
        {/* Expand/collapse icon */}
        {hasChildren && (
          <span className="text-muted-foreground">
            {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </span>
        )}
        {!hasChildren && <span className="w-3" />}
        
        {/* Node icon */}
        <Icon className="h-4 w-4 shrink-0" />
        
        {/* Label */}
        <span className="text-sm flex-1 truncate">{label}</span>
        
        {/* Path */}
        {path && (
          <code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded hidden group-hover:block">
            {path}
          </code>
        )}
        
        {/* Status */}
        {status && <StatusBadge status={status} />}
      </div>
      
      {/* Children */}
      {hasChildren && isOpen && (
        <div className="relative">
          {children}
        </div>
      )}
    </div>
  );
};

// Public Site Tree
const PublicSiteTree = () => (
  <div className="space-y-0.5">
    <TreeNode icon={Home} label="Homepage" path="/" status="done">
      <TreeNode icon={Globe} label="Hero Section" status="done" depth={1} />
      <TreeNode icon={Users2} label="Segment Selector" status="done" depth={1} />
      <TreeNode icon={FolderOpen} label="Featured Projects" status="done" depth={1} />
      <TreeNode icon={MessageSquare} label="Testimonials" status="done" depth={1} />
      <TreeNode icon={Send} label="CTA Section" status="done" depth={1} isLast />
    </TreeNode>
    
    <TreeNode icon={Users2} label="Segmentos" status="done">
      <TreeNode icon={Home} label="Privados" path="/privado" status="done" depth={1} />
      <TreeNode icon={Building} label="Empresas" path="/empresas" status="done" depth={1} />
      <TreeNode icon={Landmark} label="Investidores" path="/investidores" status="done" depth={1} isLast />
    </TreeNode>
    
    <TreeNode icon={FolderOpen} label="Portfólio" path="/portfolio" status="done">
      <TreeNode icon={Image} label="Galeria com Filtros" status="done" depth={1} />
      <TreeNode icon={Eye} label="Detalhe Projeto" path="/portfolio/:slug" status="done" depth={1} isLast />
    </TreeNode>
    
    <TreeNode icon={FileText} label="Blog" path="/blog" status="done">
      <TreeNode icon={BookOpen} label="Listagem com Filtros" status="done" depth={1} />
      <TreeNode icon={FileText} label="Artigo" path="/blog/:slug" status="done" depth={1} />
      <TreeNode icon={Download} label="Lead Magnets" status="done" depth={1} isLast />
    </TreeNode>
    
    <TreeNode icon={Briefcase} label="Serviços" path="/servicos" status="done" />
    <TreeNode icon={Mail} label="Contacto" path="/contacto" status="done" />
    
    <TreeNode icon={Scale} label="Legal" status="done">
      <TreeNode icon={FileText} label="Termos de Uso" path="/termos" status="done" depth={1} />
      <TreeNode icon={Shield} label="Privacidade" path="/privacidade" status="done" depth={1} isLast />
    </TreeNode>
    
    <TreeNode icon={Settings} label="Utilitários" status="done">
      <TreeNode icon={LogIn} label="Autenticação" path="/auth" status="done" depth={1} />
      <TreeNode icon={Receipt} label="Orçamento Público" path="/cotacao/:token" status="done" depth={1} />
      <TreeNode icon={UserPlus} label="Aceitar Convite" path="/convite/:token" status="done" depth={1} />
      <TreeNode icon={Download} label="Instalar PWA" path="/install" status="done" depth={1} />
      <TreeNode icon={BookOpen} label="Documentação" path="/documentacao" status="done" depth={1} isLast />
    </TreeNode>
  </div>
);

// Client Portal Tree
const ClientPortalTree = () => (
  <div className="space-y-0.5">
    <TreeNode icon={LayoutDashboard} label="Dashboard" path="/dashboard" status="done">
      <TreeNode icon={Activity} label="Visão Geral" status="done" depth={1}>
        <TreeNode icon={FolderOpen} label="Projectos Activos" status="done" depth={2} />
        <TreeNode icon={MessageSquare} label="Mensagens Recentes" status="done" depth={2} />
        <TreeNode icon={FileText} label="Documentos Recentes" status="done" depth={2} isLast />
      </TreeNode>
      
      <TreeNode icon={FolderOpen} label="Projecto (Expandido)" status="done" depth={1}>
        <TreeNode icon={Milestone} label="Timeline Visual" status="done" depth={2} />
        <TreeNode icon={Image} label="Galeria de Fotos" status="done" depth={2} />
        <TreeNode icon={CreditCard} label="Orçamento" status="done" depth={2} />
        <TreeNode icon={FileCheck} label="Contratos" status="done" depth={2} />
        <TreeNode icon={Receipt} label="Alterações de Obra" status="done" depth={2} isLast />
      </TreeNode>
      
      <TreeNode icon={MessageSquare} label="Comunicação" status="done" depth={1}>
        <TreeNode icon={Mail} label="Mensagens" status="done" depth={2} />
        <TreeNode icon={BarChart3} label="AI Weekly Updates" status="done" depth={2} isLast />
      </TreeNode>
      
      <TreeNode icon={Folder} label="Documentos" status="done" depth={1}>
        <TreeNode icon={FolderTree} label="Pastas Organizadas" status="done" depth={2} />
        <TreeNode icon={Clock} label="Histórico de Versões" status="done" depth={2} isLast />
      </TreeNode>
    </TreeNode>
    
    <TreeNode icon={Settings} label="Configurações" path="/dashboard/settings" status="done">
      <TreeNode icon={User} label="Perfil" status="done" depth={1} />
      <TreeNode icon={Bell} label="Notificações" status="done" depth={1} />
      <TreeNode icon={Lock} label="MFA / Segurança" status="done" depth={1} isLast />
    </TreeNode>
  </div>
);

// Admin Panel Tree
const AdminPanelTree = () => (
  <div className="space-y-0.5">
    <TreeNode icon={LayoutDashboard} label="Dashboard Admin" path="/admin" status="done">
      <TreeNode icon={PieChart} label="KPIs & Métricas" status="done" depth={1}>
        <TreeNode icon={BarChart3} label="Dashboard Overview" status="done" depth={2} />
        <TreeNode icon={Activity} label="Métricas Tempo Real" status="done" depth={2} />
        <TreeNode icon={TrendingUp} label="Funil de Conversão" status="done" depth={2} isLast />
      </TreeNode>
      
      <TreeNode icon={Target} label="CRM" status="done" depth={1}>
        <TreeNode icon={UserPlus} label="Leads (Kanban)" status="done" depth={2} />
        <TreeNode icon={Activity} label="Actividades de Leads" status="done" depth={2} />
        <TreeNode icon={Users2} label="Clientes" status="done" depth={2} />
        <TreeNode icon={Mail} label="Convites" status="done" depth={2} isLast />
      </TreeNode>
      
      <TreeNode icon={FolderOpen} label="Projectos" status="done" depth={1}>
        <TreeNode icon={Briefcase} label="Lista / Gestão" status="done" depth={2} />
        <TreeNode icon={Milestone} label="Milestones (Kanban)" status="done" depth={2} />
        <TreeNode icon={Image} label="Fotos de Obra" status="done" depth={2} />
        <TreeNode icon={CreditCard} label="Orçamentos" status="done" depth={2} isLast />
      </TreeNode>
      
      <TreeNode icon={Receipt} label="Orçamentos" status="done" depth={1}>
        <TreeNode icon={FileText} label="Lista de Orçamentos" status="done" depth={2} />
        <TreeNode icon={Send} label="Envio por Email" status="done" depth={2} />
        <TreeNode icon={Download} label="Gerar PDF" status="done" depth={2} isLast />
      </TreeNode>
      
      <TreeNode icon={FileCheck} label="Contratos" status="done" depth={1}>
        <TreeNode icon={Upload} label="Upload de Contratos" status="done" depth={2} />
        <TreeNode icon={UserCheck} label="Assinatura Digital" status="done" depth={2} isLast />
      </TreeNode>
      
      <TreeNode icon={FileText} label="Conteúdos" status="done" depth={1}>
        <TreeNode icon={BookOpen} label="Blog Posts" status="done" depth={2} />
        <TreeNode icon={Folder} label="Documentos" status="done" depth={2} />
        <TreeNode icon={MessageSquare} label="Mensagens" status="done" depth={2} isLast />
      </TreeNode>
      
      <TreeNode icon={Shield} label="Auditoria" status="done" depth={1}>
        <TreeNode icon={Clock} label="Audit Logs" status="done" depth={2} isLast />
      </TreeNode>
    </TreeNode>
  </div>
);

// Legend component
const TreeLegend = () => (
  <div className="flex flex-wrap gap-4 p-4 bg-muted/50 rounded-lg">
    <div className="flex items-center gap-2">
      <StatusBadge status="done" />
      <span className="text-xs text-muted-foreground">Funcionalidade completa</span>
    </div>
    <div className="flex items-center gap-2">
      <StatusBadge status="partial" />
      <span className="text-xs text-muted-foreground">Implementação parcial</span>
    </div>
    <div className="flex items-center gap-2">
      <StatusBadge status="todo" />
      <span className="text-xs text-muted-foreground">Por implementar</span>
    </div>
    <div className="flex items-center gap-2 ml-auto">
      <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded">/path</code>
      <span className="text-xs text-muted-foreground">Hover para ver rota</span>
    </div>
  </div>
);

// Stats component
const TreeStats = ({ title, stats }: { title: string; stats: { label: string; value: number; color: string }[] }) => (
  <div className="mt-4 pt-4 border-t">
    <h4 className="text-xs font-medium text-muted-foreground mb-2">{title}</h4>
    <div className="flex gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          <div className="text-[10px] text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
);

// Main export component
export const NavigationTrees = () => {
  return (
    <div className="space-y-6">
      <TreeLegend />
      
      <Tabs defaultValue="public" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="public" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Site Público</span>
            <span className="sm:hidden">Público</span>
          </TabsTrigger>
          <TabsTrigger value="client" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Portal Cliente</span>
            <span className="sm:hidden">Cliente</span>
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Painel Admin</span>
            <span className="sm:hidden">Admin</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="public" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-blue-500" />
                Árvore do Site Público
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Website público acessível a todos os visitantes
              </p>
            </CardHeader>
            <CardContent>
              <PublicSiteTree />
              <TreeStats 
                title="Estatísticas"
                stats={[
                  { label: "Páginas", value: 15, color: "text-blue-500" },
                  { label: "Rotas", value: 12, color: "text-green-500" },
                  { label: "Segmentos", value: 3, color: "text-accent" },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="client" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-green-500" />
                Árvore do Portal do Cliente
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Área autenticada para clientes acompanharem projectos
              </p>
            </CardHeader>
            <CardContent>
              <ClientPortalTree />
              <TreeStats 
                title="Estatísticas"
                stats={[
                  { label: "Secções", value: 5, color: "text-green-500" },
                  { label: "Features", value: 14, color: "text-blue-500" },
                  { label: "Rotas", value: 2, color: "text-accent" },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin" className="mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-amber-500" />
                Árvore do Painel Admin
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Área de gestão para administradores
              </p>
            </CardHeader>
            <CardContent>
              <AdminPanelTree />
              <TreeStats 
                title="Estatísticas"
                stats={[
                  { label: "Módulos", value: 7, color: "text-amber-500" },
                  { label: "Features", value: 22, color: "text-blue-500" },
                  { label: "Rotas", value: 1, color: "text-green-500" },
                ]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Visual Summary */}
      <Card className="bg-gradient-to-br from-background to-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Resumo da Arquitectura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg border bg-blue-500/5 border-blue-500/20">
              <Globe className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h4 className="font-semibold mb-1">Site Público</h4>
              <p className="text-sm text-muted-foreground mb-3">Marketing & Portfolio</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Páginas principais</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between">
                  <span>Microsites segmento</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Páginas utilitárias</span>
                  <span className="font-medium">4</span>
                </div>
              </div>
            </div>
            
            <div className="text-center p-4 rounded-lg border bg-green-500/5 border-green-500/20">
              <User className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h4 className="font-semibold mb-1">Portal Cliente</h4>
              <p className="text-sm text-muted-foreground mb-3">Acompanhamento de Projectos</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Dashboard principal</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span>Módulos de projecto</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between">
                  <span>Configurações</span>
                  <span className="font-medium">3</span>
                </div>
              </div>
            </div>
            
            <div className="text-center p-4 rounded-lg border bg-amber-500/5 border-amber-500/20">
              <Shield className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <h4 className="font-semibold mb-1">Painel Admin</h4>
              <p className="text-sm text-muted-foreground mb-3">Gestão Completa</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span>Módulos CRM</span>
                  <span className="font-medium">4</span>
                </div>
                <div className="flex justify-between">
                  <span>Módulos de conteúdo</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Funcionalidades</span>
                  <span className="font-medium">22+</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationTrees;
