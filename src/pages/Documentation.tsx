import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Printer, 
  Globe, 
  Users, 
  Shield, 
  Smartphone, 
  Database,
  Bot,
  FileText,
  MessageSquare,
  Camera,
  Calendar,
  BarChart3,
  Briefcase,
  Home,
  Building2,
  TrendingUp,
  Newspaper,
  Mail,
  Palette,
  Languages,
  Zap,
  Lock,
  Cloud,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Target,
  Clock,
  Heart,
  Eye,
  Rotate3D,
  ZoomIn,
  Download,
  Keyboard,
  Play,
  Sparkles,
  UserPlus,
  ShieldCheck,
  FileKey,
  Activity,
  Server,
  Fingerprint,
  Coins,
  X,
  Key,
  Cpu,
  Code,
  Mic,
  AlertCircle
} from "lucide-react";
import arifaLogo from "@/assets/arifa-logo.png";
import screenshotHomepage from "@/assets/screenshot-homepage.png";
import screenshotPortfolio from "@/assets/screenshot-portfolio.png";
import screenshotServicos from "@/assets/screenshot-servicos.png";

export default function Documentation() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Print Button - Hidden on print */}
      <div className="fixed top-4 right-4 z-50 print:hidden">
        <Button onClick={handlePrint} size="lg" className="gap-2 shadow-lg">
          <Printer className="w-5 h-5" />
          Imprimir PDF
        </Button>
      </div>

      <div ref={printRef} className="max-w-5xl mx-auto p-8 print:p-4">
        {/* Header */}
        <header className="text-center mb-12 print:mb-8">
          <img 
            src={arifaLogo} 
            alt="ARIFA Studio" 
            className="h-20 mx-auto mb-6 print:h-16"
          />
          <h1 className="text-4xl font-bold mb-4 print:text-3xl">
            Plataforma Digital ARIFA
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto print:text-lg">
            Solução completa e personalizada para a gestão moderna de projetos de arquitetura.
          </p>
          <p className="text-lg text-primary mt-4 font-medium">
            "A sua imagem, os nossos processos, o sucesso do seu cliente."
          </p>
          <div className="flex justify-center gap-2 mt-6 flex-wrap">
            <Badge variant="secondary" className="text-sm">100% Personalizado</Badge>
            <Badge variant="secondary" className="text-sm">Mobile Ready</Badge>
            <Badge variant="secondary" className="text-sm">IA Integrada</Badge>
            <Badge variant="secondary" className="text-sm">Segurança Empresarial</Badge>
          </div>
        </header>

        <Separator className="my-8" />

        {/* NEW: Para Quem é Esta Plataforma */}
        <section className="mb-12 print:mb-8">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/30">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Para Quem é Esta Plataforma?</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Estúdios de Arquitetura
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ateliers com 1-10 colaboradores que querem profissionalizar a gestão e impressionar clientes
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Problemas que Resolve
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Comunicação dispersa (email, WhatsApp)</li>
                    <li>• Clientes sem visibilidade do progresso</li>
                    <li>• Tempo perdido em tarefas repetitivas</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Resultado Esperado
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Menos emails, mais tempo para projetar</li>
                    <li>• Clientes informados e satisfeitos</li>
                    <li>• Imagem profissional que vende por si</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Section 0: Value Proposition */}
        <section className="mb-12 print:mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Porquê Esta Plataforma?</h2>
          </div>

          {/* Main Value Proposition - Call Highlight */}
          <Card className="mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 call-highlight">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <Mic className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Ler na Call</span>
              </div>
              <h3 className="text-xl font-bold text-center mb-4">Uma Plataforma, Três Benefícios</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">1</div>
                  <h4 className="font-semibold">Profissionalismo</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Apresente os seus projetos com uma experiência digital de excelência que reflete a qualidade do seu trabalho
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">2</div>
                  <h4 className="font-semibold">Eficiência</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatize processos repetitivos, centralize comunicação e reduza tempo gasto em tarefas administrativas
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">3</div>
                  <h4 className="font-semibold">Satisfação</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Clientes informados e envolvidos a cada passo, com acesso 24/7 ao progresso dos seus projetos
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitive Differentiation */}
          <Card className="mb-6 border-green-500/20 bg-green-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <TrendingUp className="w-5 h-5" />
                Diferenciação Competitiva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-3">O que os seus concorrentes fazem:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Enviam PDFs por email e esperam feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Comunicação dispersa por WhatsApp, email, telefone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Clientes sem visibilidade do progresso</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500">✗</span>
                      <span>Documentos perdidos ou desorganizados</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">O que a ARIFA oferece:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Portal dedicado com visualização interativa</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Comunicação centralizada num único local</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Timeline visual com atualizações automáticas por IA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Gestão documental organizada com histórico</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Em Números */}
          <h3 className="text-lg font-semibold mb-4">Plataforma em Números</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
            <Card className="text-center bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
              <CardContent className="pt-4 pb-3">
                <p className="text-3xl font-bold text-blue-600">25</p>
                <p className="text-xs text-muted-foreground">Tabelas de Dados</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
              <CardContent className="pt-4 pb-3">
                <p className="text-3xl font-bold text-green-600">16</p>
                <p className="text-xs text-muted-foreground">Automações</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
              <CardContent className="pt-4 pb-3">
                <p className="text-3xl font-bold text-purple-600">120+</p>
                <p className="text-xs text-muted-foreground">Funcionalidades</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
              <CardContent className="pt-4 pb-3">
                <p className="text-3xl font-bold text-orange-600">20+</p>
                <p className="text-xs text-muted-foreground">Ecrãs</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-pink-500/10 to-pink-600/5 border-pink-500/20">
              <CardContent className="pt-4 pb-3">
                <p className="text-3xl font-bold text-pink-600">100%</p>
                <p className="text-xs text-muted-foreground">Personalizado</p>
              </CardContent>
            </Card>
            <Card className="text-center bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
              <CardContent className="pt-4 pb-3">
                <p className="text-3xl font-bold text-cyan-600">PT/EN</p>
                <p className="text-xs text-muted-foreground">Bilingue</p>
              </CardContent>
            </Card>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center border-green-500/20 bg-green-500/5">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-green-500/10 rounded-full mb-3">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Poupe Tempo</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Menos emails, menos chamadas, menos reuniões desnecessárias
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-blue-500/20 bg-blue-500/5">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-blue-500/10 rounded-full mb-3">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Sempre Acessível</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Clientes acedem pelo telemóvel, a qualquer hora, em qualquer lugar
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-purple-500/20 bg-purple-500/5">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-purple-500/10 rounded-full mb-3">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Clientes Felizes</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Transparência total gera confiança e recomendações
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-orange-500/20 bg-orange-500/5">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-orange-500/10 rounded-full mb-3">
                  <BarChart3 className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Controlo Total</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Visão 360° do negócio: leads, projetos, documentos, pagamentos
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Screenshots Reais da Plataforma */}
        <section className="mb-12 print:mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Camera className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Screenshots Reais da Plataforma</h2>
          </div>

          {/* Authenticity Statement */}
          <Card className="mb-6 border-green-500/30 bg-green-500/5">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <p className="text-sm font-medium text-green-700">
                  Todos os screenshots abaixo são do sistema ARIFA real em funcionamento. 
                  Nenhuma imagem foi gerada por IA ou manipulada.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Homepage Screenshot */}
          <Card className="mb-6 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Homepage - Site Público
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <img 
                src={screenshotHomepage} 
                alt="Screenshot real da Homepage ARIFA" 
                className="w-full h-auto border-b"
              />
            </CardContent>
            <div className="p-4 bg-muted/30">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Hero Animado</Badge>
                <Badge variant="outline">Navegação Inteligente</Badge>
                <Badge variant="outline">Dark/Light Mode</Badge>
                <Badge variant="outline">Multi-idioma</Badge>
                <Badge variant="outline">CTAs Estratégicos</Badge>
              </div>
            </div>
          </Card>

          {/* Portfolio & Services Screenshots */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-purple-500/10">
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <Briefcase className="w-5 h-5" />
                  Portfolio de Projetos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <img 
                  src={screenshotPortfolio} 
                  alt="Screenshot real do Portfolio ARIFA" 
                  className="w-full h-auto"
                />
              </CardContent>
              <div className="p-4 bg-muted/30">
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Filtros por categoria e localização</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Segmentação por tipo de cliente</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Estados visuais dos projetos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Pesquisa instantânea</span>
                  </li>
                </ul>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader className="bg-blue-500/10">
                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Zap className="w-5 h-5" />
                  Página de Serviços
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <img 
                  src={screenshotServicos} 
                  alt="Screenshot real da página de Serviços ARIFA" 
                  className="w-full h-auto"
                />
              </CardContent>
              <div className="p-4 bg-muted/30">
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Apresentação profissional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>CTAs de conversão</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Design responsivo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Animações suaves</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Note about protected areas */}
          <Card className="mt-6 border-dashed border-2">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <Lock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Áreas Protegidas por Autenticação</h4>
                  <p className="text-muted-foreground text-sm mb-3">
                    O <strong>Portal do Cliente</strong> e o <strong>Painel de Administração</strong> são áreas 
                    privadas protegidas por autenticação segura com MFA opcional.
                  </p>
                  <p className="text-xs text-muted-foreground italic mb-4">
                    Capturas reais destas áreas podem ser disponibilizadas na call de apresentação 
                    ou mediante pedido, respeitando a privacidade dos dados de clientes existentes.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-purple-500/10 rounded-lg">
                      <h5 className="font-medium text-purple-700 dark:text-purple-400 flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4" />
                        Portal do Cliente
                      </h5>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Timeline visual do projeto</li>
                        <li>• Galeria de fotos por fase</li>
                        <li>• Documentos com versionamento</li>
                        <li>• Chat em tempo real</li>
                        <li>• AI Weekly Updates</li>
                      </ul>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <h5 className="font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4" />
                        Painel Admin
                      </h5>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li>• Dashboard com KPIs em tempo real</li>
                        <li>• CRM Kanban de leads</li>
                        <li>• Gestão completa de projetos</li>
                        <li>• Sistema de cotações</li>
                        <li>• Audit logs de segurança</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Wireframes Section */}
        <section className="mb-12 print:mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Palette className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Visão Geral das Interfaces</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Homepage Wireframe */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-muted/30">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Site Público
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="bg-background border rounded-lg p-2 text-xs space-y-2">
                  <div className="bg-primary/20 rounded h-16 flex items-center justify-center text-muted-foreground">
                    Hero + Segmentos
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <div className="bg-muted rounded h-12 flex items-center justify-center text-[10px] text-muted-foreground">Privado</div>
                    <div className="bg-muted rounded h-12 flex items-center justify-center text-[10px] text-muted-foreground">Empresas</div>
                    <div className="bg-muted rounded h-12 flex items-center justify-center text-[10px] text-muted-foreground">Investidores</div>
                  </div>
                  <div className="bg-muted/50 rounded h-10 flex items-center justify-center text-muted-foreground">
                    Portfolio
                  </div>
                  <div className="bg-muted/50 rounded h-8 flex items-center justify-center text-muted-foreground">
                    Testemunhos
                  </div>
                  <div className="bg-primary/10 rounded h-6 flex items-center justify-center text-muted-foreground">
                    CTA
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Portal Wireframe */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-muted/30">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Portal Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="bg-background border rounded-lg p-2 text-xs space-y-2">
                  <div className="flex gap-1">
                    <div className="bg-primary/20 rounded w-12 h-20 flex items-center justify-center text-[10px] text-muted-foreground">
                      Nav
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="bg-muted rounded h-5 flex items-center justify-center text-[10px] text-muted-foreground">Header</div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="bg-green-500/20 rounded h-7 flex items-center justify-center text-[10px] text-muted-foreground">Timeline</div>
                        <div className="bg-blue-500/20 rounded h-7 flex items-center justify-center text-[10px] text-muted-foreground">Stats</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="bg-purple-500/20 rounded h-10 flex items-center justify-center text-muted-foreground">
                      Galeria
                    </div>
                    <div className="bg-orange-500/20 rounded h-10 flex items-center justify-center text-muted-foreground">
                      Docs
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded h-8 flex items-center justify-center text-muted-foreground">
                    Mensagens
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Admin Panel Wireframe */}
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 bg-muted/30">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="bg-background border rounded-lg p-2 text-xs space-y-2">
                  <div className="flex gap-1">
                    <div className="bg-primary/20 rounded w-10 h-24 flex items-center justify-center text-[10px] text-muted-foreground">
                      Menu
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="grid grid-cols-3 gap-1">
                        <div className="bg-green-500/20 rounded h-6 flex items-center justify-center text-[10px] text-muted-foreground">KPI</div>
                        <div className="bg-blue-500/20 rounded h-6 flex items-center justify-center text-[10px] text-muted-foreground">KPI</div>
                        <div className="bg-purple-500/20 rounded h-6 flex items-center justify-center text-[10px] text-muted-foreground">KPI</div>
                      </div>
                      <div className="bg-orange-500/20 rounded h-8 flex items-center justify-center text-muted-foreground">
                        Kanban CRM
                      </div>
                      <div className="bg-muted/50 rounded h-6 flex items-center justify-center text-muted-foreground">
                        Tabela
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Wireframes */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Lightbox Wireframe */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Lightbox Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="bg-black/90 rounded-lg p-3 text-xs space-y-2">
                  <div className="flex justify-between items-center text-white/50">
                    <span>← Anterior</span>
                    <div className="flex gap-2">
                      <ZoomIn className="w-4 h-4" />
                      <Rotate3D className="w-4 h-4" />
                      <Play className="w-4 h-4" />
                      <Download className="w-4 h-4" />
                    </div>
                    <span>Próximo →</span>
                  </div>
                  <div className="bg-white/10 rounded h-32 flex items-center justify-center text-white/50">
                    Imagem com Zoom 400%
                  </div>
                  <div className="flex gap-1 justify-center">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-8 h-6 rounded ${i === 2 ? 'bg-white/40 ring-2 ring-primary' : 'bg-white/20'}`}></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CRM Kanban Wireframe */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  CRM Kanban
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="bg-muted/30 rounded-lg p-2 text-xs">
                  <div className="grid grid-cols-4 gap-2">
                    {['Novo', 'Contactado', 'Proposta', 'Fechado'].map((col, i) => (
                      <div key={col} className="space-y-1">
                        <div className={`text-center text-[10px] font-medium py-1 rounded ${
                          i === 0 ? 'bg-blue-500/20 text-blue-600' :
                          i === 1 ? 'bg-yellow-500/20 text-yellow-600' :
                          i === 2 ? 'bg-purple-500/20 text-purple-600' :
                          'bg-green-500/20 text-green-600'
                        }`}>{col}</div>
                        <div className="space-y-1">
                          {[1,2].slice(0, i === 3 ? 1 : 2).map(j => (
                            <div key={j} className="bg-background border rounded p-1 text-[10px] text-muted-foreground">
                              Lead {i+1}.{j}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Section 1: Public Site - with mini summary */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">1. Site Público — O seu cartão de visita digital que vende por si</h2>
              <p className="text-muted-foreground mt-1">A sua montra digital — primeira impressão que convence e converte visitantes em clientes</p>
            </div>
          </div>

          {/* Mini Summary */}
          <Card className="mb-6 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Resumo Rápido</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-blue-500/10">Portfolio que vende 24/7</Badge>
                <Badge variant="secondary" className="bg-blue-500/10">SEO otimizado para Google</Badge>
                <Badge variant="secondary" className="bg-blue-500/10">Segmentação por tipo de cliente</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 border-blue-500/20 bg-blue-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-700">Vantagem Competitiva</h4>
                  <p className="text-sm text-muted-foreground">Site segmentado por tipo de cliente (Privado, Empresas, Investidores) com conteúdo personalizado. Cada visitante vê projetos e mensagens relevantes para si, aumentando taxas de conversão.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <FeatureCard
              icon={<Home className="w-5 h-5" />}
              title="Homepage"
              features={[
                "Hero section com animações",
                "Seletor de segmentos (Privado/Empresas/Investidores)",
                "Portfolio em destaque",
                "Testemunhos em carrossel",
                "Secção About com valores",
                "CTAs estratégicos"
              ]}
            />
            <FeatureCard
              icon={<Building2 className="w-5 h-5" />}
              title="Microsites por Segmento"
              features={[
                "Página dedicada a Clientes Privados",
                "Página dedicada a Empresas",
                "Página dedicada a Investidores",
                "Conteúdo personalizado por audiência",
                "Projetos filtrados por segmento"
              ]}
            />
            <FeatureCard
              icon={<Camera className="w-5 h-5" />}
              title="Portfolio"
              features={[
                "Galeria com filtros por categoria",
                "Filtros por estado (estudo/construção/concluído)",
                "Página de detalhe do projeto",
                "Galeria com lightbox",
                "Lazy loading de imagens"
              ]}
            />
            <FeatureCard
              icon={<Newspaper className="w-5 h-5" />}
              title="Blog"
              features={[
                "Listagem com filtros por categoria",
                "Artigos formatados com rich text",
                "Lead magnets integrados",
                "Sistema de categorias",
                "SEO otimizado por artigo"
              ]}
            />
            <FeatureCard
              icon={<Mail className="w-5 h-5" />}
              title="Contacto"
              features={[
                "Formulário de contacto completo",
                "Seleção de tipo de projeto",
                "Captação automática como lead",
                "Notificação por email",
                "Botão WhatsApp flutuante"
              ]}
            />
            <FeatureCard
              icon={<Briefcase className="w-5 h-5" />}
              title="Serviços"
              features={[
                "Apresentação de serviços",
                "Processo de trabalho",
                "FAQ interativo",
                "CTAs para contacto"
              ]}
            />
          </div>
        </section>

        <Separator className="my-8" />

        {/* Section 2: Client Portal - with mini summary */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">2. Portal do Cliente — Menos telefonemas, mais transparência</h2>
              <p className="text-muted-foreground mt-1">Experiência premium que fideliza — clientes informados são clientes satisfeitos</p>
            </div>
          </div>

          {/* Mini Summary */}
          <Card className="mb-6 bg-gradient-to-r from-purple-500/10 to-purple-600/5 border-purple-500/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700">Resumo Rápido</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-purple-500/10">Menos telefonemas</Badge>
                <Badge variant="secondary" className="bg-purple-500/10">Transparência total</Badge>
                <Badge variant="secondary" className="bg-purple-500/10">Clientes sempre informados</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Call Highlight */}
          <Card className="mb-6 border-purple-500/20 bg-purple-500/5 call-highlight">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">Ler na Call</span>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-purple-700">Vantagem Competitiva</h4>
                  <p className="text-sm text-muted-foreground">Portal exclusivo 24/7 onde os clientes acompanham projetos sem precisar de telefonar ou enviar emails. Visualizam plantas 3D, aprovam documentos, e recebem atualizações automáticas por IA. <strong className="text-purple-700">Reduz chamadas em 60%.</strong></p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-4">
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Dashboard"
              features={[
                "Visão geral de todos os projetos",
                "Estatísticas e progresso",
                "Notificações recentes",
                "Acesso rápido a documentos",
                "Mensagens não lidas"
              ]}
            />
            <FeatureCard
              icon={<Calendar className="w-5 h-5" />}
              title="Timeline Visual"
              features={[
                "Progresso por fases do projeto",
                "Milestones com datas",
                "Indicador de fase atual",
                "Descrição de cada etapa",
                "Fases: Preparação → Entrega"
              ]}
            />
            <FeatureCard
              icon={<Eye className="w-5 h-5" />}
              title="Lightbox Premium"
              features={[
                "Zoom até 400% com scroll",
                "Rotação de imagens (90°)",
                "Slideshow automático (3s)",
                "Download direto de imagens",
                "Navegação por teclado",
                "Gestos touch para mobile",
                "Contador de imagens"
              ]}
            />
            <FeatureCard
              icon={<Camera className="w-5 h-5" />}
              title="Galeria de Fotos"
              features={[
                "Organização por fase do projeto",
                "Filtros por milestone",
                "Metadados (data, descrição)",
                "Integração com lightbox"
              ]}
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5" />}
              title="Documentos"
              features={[
                "Navegação em pastas",
                "Preview inline (PDF, imagens, Office)",
                "Versionamento de ficheiros",
                "Download direto"
              ]}
            />
            <FeatureCard
              icon={<MessageSquare className="w-5 h-5" />}
              title="Mensagens"
              features={[
                "Chat em tempo real",
                "Indicador de digitação",
                "Anexos de ficheiros",
                "Histórico por projeto"
              ]}
            />
            <FeatureCard
              icon={<Bot className="w-5 h-5" />}
              title="IA Integrada"
              features={[
                "AI Weekly Updates automáticos",
                "Chatbot para dúvidas",
                "Resumos inteligentes",
                "Sugestões proativas"
              ]}
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5" />}
              title="Orçamento & Contratos"
              features={[
                "Visualização do orçamento",
                "Acompanhamento de gastos",
                "Contratos com assinatura digital",
                "Alterações de âmbito"
              ]}
            />
          </div>
        </section>

        <Separator className="my-8" />

        {/* Section 3: Admin Panel - with mini summary */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">3. Painel Admin — Controlo total do negócio num só lugar</h2>
              <p className="text-muted-foreground mt-1">O centro de comando — gestão completa de leads, projetos, clientes e conteúdos</p>
            </div>
          </div>

          {/* Mini Summary */}
          <Card className="mb-6 bg-gradient-to-r from-blue-500/10 to-blue-600/5 border-blue-500/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">Resumo Rápido</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-blue-500/10">Visão 360° do negócio</Badge>
                <Badge variant="secondary" className="bg-blue-500/10">CRM visual (Kanban)</Badge>
                <Badge variant="secondary" className="bg-blue-500/10">Zero tarefas repetitivas</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 border-blue-500/20 bg-blue-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-700">Vantagem Competitiva</h4>
                  <p className="text-sm text-muted-foreground">Dashboard completo com KPIs em tempo real, CRM visual com scoring de leads por IA, sistema de cotações com tracking, e gestão documental hierárquica. Tudo o que precisa para gerir o negócio num único lugar.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 gap-4">
            <FeatureCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Dashboard KPIs"
              features={[
                "Métricas em tempo real",
                "Projetos ativos",
                "Pipeline de leads",
                "Conversão de cotações",
                "Gráficos interativos"
              ]}
            />
            <FeatureCard
              icon={<Building2 className="w-5 h-5" />}
              title="Gestão de Projetos"
              features={[
                "CRUD completo",
                "Milestones Kanban (drag & drop)",
                "Atribuição de clientes",
                "Upload múltiplo de imagens",
                "Gestão de fases"
              ]}
            />
            <FeatureCard
              icon={<Users className="w-5 h-5" />}
              title="CRM de Leads"
              features={[
                "Kanban drag & drop",
                "AI Lead Scoring",
                "Histórico de atividades",
                "Filtros avançados",
                "Conversão para cliente"
              ]}
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5" />}
              title="Cotações"
              features={[
                "Criação de cotações",
                "Templates reutilizáveis",
                "Geração de PDF",
                "Envio por email",
                "Tracking de visualização"
              ]}
            />
            <FeatureCard
              icon={<UserPlus className="w-5 h-5" />}
              title="Gestão de Clientes"
              features={[
                "Lista de clientes",
                "Sistema de convites por email",
                "Tracking de convites pendentes",
                "Gestão de permissões",
                "Perfis detalhados"
              ]}
            />
            <FeatureCard
              icon={<Newspaper className="w-5 h-5" />}
              title="Gestão de Blog"
              features={[
                "Editor de artigos",
                "Gestão de categorias",
                "Agendamento",
                "Artigos em destaque",
                "SEO por artigo"
              ]}
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5" />}
              title="Documentos"
              features={[
                "Upload para clientes",
                "Gestão de pastas hierárquicas",
                "Versionamento de ficheiros",
                "Associar a projetos",
                "Preview múltiplos formatos"
              ]}
            />
            <FeatureCard
              icon={<MessageSquare className="w-5 h-5" />}
              title="Mensagens"
              features={[
                "Inbox centralizado",
                "Responder a clientes",
                "Histórico completo",
                "Status lido/não lido",
                "Filtros por projeto"
              ]}
            />
            <FeatureCard
              icon={<Activity className="w-5 h-5" />}
              title="Audit Logs"
              features={[
                "Registo de ações",
                "Login/Logout tracking",
                "Alterações de dados",
                "Filtros por utilizador",
                "Exportação"
              ]}
            />
          </div>
        </section>

        <Separator className="my-8" />

        {/* Section 4: Security - with mini summary */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">4. Segurança — Clientes confiam, dados protegidos</h2>
              <p className="text-muted-foreground mt-1">Proteção empresarial — dados dos seus clientes protegidos com tecnologia de ponta</p>
            </div>
          </div>

          {/* Mini Summary */}
          <Card className="mb-6 bg-gradient-to-r from-green-500/10 to-green-600/5 border-green-500/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-700">Resumo Rápido</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-green-500/10">Dados 100% protegidos</Badge>
                <Badge variant="secondary" className="bg-green-500/10">MFA disponível</Badge>
                <Badge variant="secondary" className="bg-green-500/10">Rastreabilidade completa</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 border-green-500/20 bg-green-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-700">Vantagem Competitiva</h4>
                  <p className="text-sm text-muted-foreground">Segurança ao nível de cada linha de dados (RLS), autenticação de dois fatores, e registo completo de todas as ações (audit trail). Os seus clientes confiam que os dados estão protegidos e você tem rastreabilidade completa.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="text-center border-green-500/20">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-green-500/10 rounded-full mb-3">
                  <Lock className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold">RLS Policies</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Segurança ao nível da linha em todas as tabelas
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-blue-500/20">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-blue-500/10 rounded-full mb-3">
                  <Fingerprint className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">MFA</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Autenticação de 2 fatores disponível
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-purple-500/20">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-purple-500/10 rounded-full mb-3">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Audit Logs</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Rastreabilidade completa de ações
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-orange-500/20">
              <CardContent className="pt-6">
                <div className="inline-flex p-3 bg-orange-500/10 rounded-full mb-3">
                  <FileKey className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold">Roles & Permissões</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Controlo granular de acessos
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Medidas de Segurança Implementadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Row Level Security (RLS) em todas as tabelas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Autenticação segura com email/password</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Suporte a MFA (Autenticação 2 fatores)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Audit logs para rastreabilidade completa</span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Políticas de acesso granulares por role</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Encriptação de dados em trânsito (HTTPS)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Tokens seguros para convites e cotações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Validação de inputs e sanitização</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Section 5: Technical Features - with technical label */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-3xl font-bold">5. Tecnologia Premium — Impressione clientes, simplifique operações</h2>
              </div>
              <p className="text-muted-foreground mt-1">Tecnologia de ponta — performance, escalabilidade e experiência premium</p>
            </div>
          </div>

          {/* Mini Summary */}
          <Card className="mb-6 bg-gradient-to-r from-cyan-500/10 to-cyan-600/5 border-cyan-500/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span className="text-sm font-semibold text-cyan-700">Resumo Rápido</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-cyan-500/10">PWA instalável (sem app store)</Badge>
                <Badge variant="secondary" className="bg-cyan-500/10">Bilingue PT/EN</Badge>
                <Badge variant="secondary" className="bg-cyan-500/10">16 automações 24/7</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6 border-cyan-500/20 bg-cyan-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-cyan-700">Vantagem Competitiva</h4>
                  <p className="text-sm text-muted-foreground">PWA instalável no telemóvel (sem app store), bilingue PT/EN automático, dark mode, e 16 automações serverless que trabalham por si 24/7. Tecnologia moderna que impressiona clientes e simplifica operações.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TechCard icon={<Smartphone />} title="PWA" description="Instalável em mobile, funciona offline" />
            <TechCard icon={<Languages />} title="i18n" description="Português e Inglês" />
            <TechCard icon={<Palette />} title="Dark Mode" description="Tema claro e escuro" />
            <TechCard icon={<Globe />} title="SEO" description="Meta tags, sitemap, Open Graph" />
            <TechCard icon={<Server />} title="16 Edge Functions" description="Backend serverless" />
            <TechCard icon={<Lock />} title="RLS Policies" description="Segurança ao nível da row" />
            <TechCard icon={<Bot />} title="IA Integrada" description="Google Gemini sem API key" />
            <TechCard icon={<Database />} title="Realtime" description="Atualizações em tempo real" />
          </div>

          {/* Technical Section Label */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Edge Functions (16)
                </CardTitle>
                <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Code className="w-3 h-3 mr-1" />
                  Secção Técnica (referência IT)
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                {[
                  "ai-chat",
                  "boldsign-webhook",
                  "create-boldsign-contract",
                  "generate-project-report",
                  "generate-quote-pdf",
                  "generate-weekly-update",
                  "get-boldsign-signing-url",
                  "optimize-image",
                  "score-lead",
                  "send-contact-email",
                  "send-invitation",
                  "send-milestone-notification",
                  "send-quote-email",
                  "send-welcome-email",
                  "sitemap",
                  "validate-invitation"
                ].map((fn) => (
                  <Badge key={fn} variant="outline" className="justify-start font-mono">
                    {fn}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Section 6: User Journeys - with mini summary */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">6. Fluxos Automáticos — Do contacto à entrega sem esforço manual</h2>
              <p className="text-muted-foreground mt-1">Processos automatizados — do primeiro contacto até à entrega do projeto</p>
            </div>
          </div>

          {/* Mini Summary */}
          <Card className="mb-6 bg-gradient-to-r from-indigo-500/10 to-indigo-600/5 border-indigo-500/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">Resumo Rápido</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="bg-indigo-500/10">Lead automático com AI scoring</Badge>
                <Badge variant="secondary" className="bg-indigo-500/10">Cotações com tracking</Badge>
                <Badge variant="secondary" className="bg-indigo-500/10">Convites automáticos</Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Call Highlight */}
          <Card className="mb-6 border-indigo-500/20 bg-indigo-500/5 call-highlight">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Mic className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">Ler na Call</span>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-indigo-700">Vantagem Competitiva</h4>
                  <p className="text-sm text-muted-foreground">Fluxos ponta-a-ponta automatizados: leads recebem scoring automático por IA, cotações são enviadas com tracking, contratos são assinados digitalmente, e clientes recebem convite automático para o portal. <strong className="text-indigo-700">Zero tarefas manuais repetitivas.</strong></p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead to Client Journey */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Fluxo: Lead → Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FlowStep label="Visitante" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Formulário Contacto" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Lead Criado" highlight implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="AI Lead Scoring" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Kanban CRM" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Criar Cotação" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Enviar Cotação" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Cliente Aceita?" highlight implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Criar Contrato" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Assinatura Digital" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Enviar Convite" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Cliente Registado" highlight implemented />
              </div>
            </CardContent>
          </Card>

          {/* Project Lifecycle */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Fluxo: Ciclo de Vida do Projeto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <FlowStep label="Projeto Criado" highlight implemented />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="1. Preparação" implemented />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="2. Conceito" implemented />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="3. Coordenação" implemented />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="4. Técnico" implemented />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="5. Construção" implemented />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="6. Entrega" implemented />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="7. Em Uso" highlight implemented />
                </div>
                
                <div className="flex justify-center">
                  <ArrowDown className="w-6 h-6 text-muted-foreground" />
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="font-medium mb-1">Em cada fase:</p>
                    <p className="text-sm text-muted-foreground">Milestones + Fotos + Documentos</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="font-medium mb-1">Cliente vê:</p>
                    <p className="text-sm text-muted-foreground">Timeline + Progresso + Notificações</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="font-medium mb-1">Admin gere:</p>
                    <p className="text-sm text-muted-foreground">Kanban + Orçamento + Comunicação</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quote Flow */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Fluxo: Cotações & Contratos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FlowStep label="Lead/Cliente" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Criar Cotação" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Adicionar Items" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Gerar PDF" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Enviar Email" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Track Abertura" highlight implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Aceitar/Rejeitar" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Criar Contrato" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Assinatura Digital" highlight implemented />
              </div>
            </CardContent>
          </Card>

          {/* Client Invitation Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Fluxo: Convite de Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <FlowStep label="Admin" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Enviar Convite" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Email Enviado" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Token Validado" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Registo Conta" highlight implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Setup MFA" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Tour Guiado" implemented />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Portal Activo" highlight implemented />
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Section 7: Database - Technical Section */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-3xl font-bold">7. Estrutura de Dados</h2>
                <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <Code className="w-3 h-3 mr-1" />
                  Secção Técnica (referência IT)
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">Base sólida — arquitectura preparada para crescer com o seu negócio</p>
            </div>
          </div>
          
          <Card className="mb-6 border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-emerald-700">Vantagem Competitiva</h4>
                  <p className="text-sm text-muted-foreground">25+ tabelas relacionais com versionamento de documentos, histórico de actividades, e auditoria completa. Base de dados profissional preparada para milhares de projetos e clientes, com performance optimizada e backups automáticos.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Diagrama Entidade-Relacionamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Utilizadores & Projetos</h4>
                  <div className="text-sm space-y-1 bg-muted/50 rounded-lg p-3 font-mono">
                    <p>PROFILES ──┬── PROJECTS</p>
                    <p>           ├── CLIENT_MESSAGES</p>
                    <p>           ├── CLIENT_DOCUMENTS</p>
                    <p>           ├── CONTRACTS</p>
                    <p>           └── QUOTES</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Projetos & Milestones</h4>
                  <div className="text-sm space-y-1 bg-muted/50 rounded-lg p-3 font-mono">
                    <p>PROJECTS ──┬── PROJECT_MILESTONES</p>
                    <p>           ├── PROJECT_PHOTOS</p>
                    <p>           ├── PROJECT_BUDGETS</p>
                    <p>           └── CLIENT_DOCUMENTS</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">CRM</h4>
                  <div className="text-sm space-y-1 bg-muted/50 rounded-lg p-3 font-mono">
                    <p>LEADS ──┬── LEAD_ACTIVITIES</p>
                    <p>        └── QUOTES</p>
                    <p>QUOTES ──┬── QUOTE_ITEMS</p>
                    <p>         └── CONTRACTS</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Documentos</h4>
                  <div className="text-sm space-y-1 bg-muted/50 rounded-lg p-3 font-mono">
                    <p>DOCUMENT_FOLDERS ── CLIENT_DOCUMENTS</p>
                    <p>CLIENT_DOCUMENTS ── DOCUMENT_VERSIONS</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tabelas Core</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• profiles (utilizadores)</p>
                <p>• user_roles (permissões)</p>
                <p>• projects (projetos)</p>
                <p>• project_milestones</p>
                <p>• project_photos</p>
                <p>• project_budgets</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tabelas CRM</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• leads</p>
                <p>• lead_stages</p>
                <p>• lead_activities</p>
                <p>• quotes</p>
                <p>• quote_items</p>
                <p>• quote_templates</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tabelas Suporte</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>• client_documents</p>
                <p>• document_versions</p>
                <p>• document_folders</p>
                <p>• client_messages</p>
                <p>• contracts</p>
                <p>• audit_logs</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Section: Análise de Valor - Orçamento Comparativo */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Coins className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Análise de Valor</h2>
          </div>

          <p className="text-lg text-muted-foreground mb-6">
            Comparação do custo de implementação da plataforma ARIFA vs aquisição de soluções independentes no mercado.
          </p>

          {/* Executive Summary - Call Highlight */}
          <Card className="mb-6 bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-500/30 call-highlight">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-2 mb-4">
                <Mic className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Ler na Call</span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-3">Resumo Executivo</h3>
                <p className="text-lg max-w-2xl mx-auto">
                  No mercado, pagarias aproximadamente <strong className="text-red-600">€20.364/ano</strong> por soluções dispersas 
                  e menos integradas. Com a ARIFA, investes <strong className="text-green-600">€4.888 uma única vez</strong> e ficas 
                  com tudo à medida do teu estúdio. <strong>Sem subscrições mensais, sem surpresas.</strong>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Savings Highlight - Call Highlight */}
          <Card className="mb-8 bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/30 call-highlight">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-2 mb-4 justify-center">
                <Mic className="w-4 h-4 text-green-600" />
                <span className="text-xs font-medium text-green-600 uppercase tracking-wider">Ler na Call</span>
              </div>
              <div className="grid md:grid-cols-3 gap-6 items-center text-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Custo de Mercado</p>
                  <p className="text-3xl font-bold text-red-600 line-through">€20.364</p>
                  <p className="text-xs text-muted-foreground">/ano (soluções separadas)</p>
                </div>
                <div>
                  <div className="inline-flex p-4 bg-green-500/20 rounded-full mb-2">
                    <ArrowDown className="w-8 h-8 text-green-600" />
                  </div>
                  <Badge className="bg-green-600 text-white text-lg px-4 py-1">
                    Poupança 76%
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Plataforma ARIFA</p>
                  <p className="text-4xl font-bold text-green-600">€4.888</p>
                  <p className="text-xs text-muted-foreground">investimento único</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-lg font-medium text-green-700">
                  ROI de 318% • Poupança de €15.476 no 1º ano
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Comparative Table */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Tabela Comparativa de Custos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">Funcionalidade</th>
                      <th className="text-left py-3 px-2">Solução de Mercado</th>
                      <th className="text-right py-3 px-2">Custo/Ano</th>
                      <th className="text-center py-3 px-2">ARIFA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="py-3 px-2 font-medium">Website Premium</td>
                      <td className="py-3 px-2 text-muted-foreground">Squarespace + Desenvolvimento Custom</td>
                      <td className="py-3 px-2 text-right">€1.680</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">Portal do Cliente</td>
                      <td className="py-3 px-2 text-muted-foreground">SuiteDash (Pro)</td>
                      <td className="py-3 px-2 text-right">€648</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">CRM (3 utilizadores)</td>
                      <td className="py-3 px-2 text-muted-foreground">Pipedrive Advanced</td>
                      <td className="py-3 px-2 text-right">€1.368</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">Gestão Documental</td>
                      <td className="py-3 px-2 text-muted-foreground">PandaDoc</td>
                      <td className="py-3 px-2 text-right">€660</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">Assinaturas Digitais</td>
                      <td className="py-3 px-2 text-muted-foreground">DocuSign Essentials</td>
                      <td className="py-3 px-2 text-right">€360</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">Chat em Tempo Real</td>
                      <td className="py-3 px-2 text-muted-foreground">Intercom Essentials</td>
                      <td className="py-3 px-2 text-right">€420</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">Email Automatizado</td>
                      <td className="py-3 px-2 text-muted-foreground">Mailchimp Essentials</td>
                      <td className="py-3 px-2 text-right">€276</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">Analytics</td>
                      <td className="py-3 px-2 text-muted-foreground">Plausible Analytics</td>
                      <td className="py-3 px-2 text-right">€120</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">IA Integrada (BYOK)</td>
                      <td className="py-3 px-2 text-muted-foreground">Gemini 2.5 Flash API</td>
                      <td className="py-3 px-2 text-right">€360</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">Cloud Storage (50GB)</td>
                      <td className="py-3 px-2 text-muted-foreground">AWS S3</td>
                      <td className="py-3 px-2 text-right">€72</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">App Mobile (PWA)</td>
                      <td className="py-3 px-2 text-muted-foreground">Desenvolvimento Custom</td>
                      <td className="py-3 px-2 text-right">€12.000</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">Segurança + MFA</td>
                      <td className="py-3 px-2 text-muted-foreground">Auth0 Essentials</td>
                      <td className="py-3 px-2 text-right">€1.440</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">Multi-idioma (PT/EN)</td>
                      <td className="py-3 px-2 text-muted-foreground">Traduções Profissionais</td>
                      <td className="py-3 px-2 text-right">€600</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-2 font-medium">Integrações</td>
                      <td className="py-3 px-2 text-muted-foreground">Zapier Professional</td>
                      <td className="py-3 px-2 text-right">€360</td>
                      <td className="py-3 px-2 text-center"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                    </tr>
                    <tr className="bg-muted/50 font-bold">
                      <td className="py-4 px-2">TOTAL</td>
                      <td className="py-4 px-2"></td>
                      <td className="py-4 px-2 text-right text-red-600">€20.364/ano</td>
                      <td className="py-4 px-2 text-center text-green-600">€4.888</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                * Preços de mercado pesquisados em Janeiro 2026. Valores podem variar consoante planos e promoções.
              </p>
            </CardContent>
          </Card>

          {/* Included vs Out of Scope */}
          <Card className="mb-8 border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Incluído vs Fora de Escopo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5" />
                    Incluído Neste Projeto
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Site público completo",
                      "Portal cliente completo",
                      "Painel admin completo",
                      "CRM com Kanban",
                      "16 automações edge functions",
                      "IA integrada (BYOK)",
                      "PWA mobile instalável",
                      "Segurança MFA",
                      "Bilingue PT/EN",
                      "60 dias bug-fix pós-lançamento"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 flex items-center gap-2 mb-4">
                    <X className="w-5 h-5" />
                    Fora de Escopo / Extra
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Conteúdos editoriais (textos adicionais)",
                      "Fotografia profissional de projetos",
                      "Sessões de formação adicionais",
                      "Manutenção mensal (opcional €150-250/mês)",
                      "Novas línguas além de PT/EN",
                      "Integração com softwares externos",
                      "Desenvolvimento de novas funcionalidades",
                      "Suporte após 60 dias bug-fix"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BYOK Section */}
          <Card className="mb-8 border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Key className="w-5 h-5" />
                Inteligência Artificial: BYOK (Bring Your Own Key)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Como funciona?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    A plataforma utiliza o modelo <strong>Gemini 2.5 Flash</strong> da Google, o mais recente e avançado.
                    O cliente utiliza a sua própria chave API, mantendo total controlo sobre custos e dados.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Sem custos ocultos de IA</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Controlo total sobre utilização</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Dados processados directamente pela Google</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Escalabilidade sem limites</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Custos Estimados Gemini 2.5 Flash
                  </h4>
                  <Card className="bg-background">
                    <CardContent className="pt-4">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Input (1M tokens)</span>
                          <span className="font-medium">€0.10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Output (1M tokens)</span>
                          <span className="font-medium">€0.40</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uso típico mensal</span>
                          <span className="font-medium text-green-600">€5 - €50</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Baseado em ~100-1000 interações/mês
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Benefits */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Benefícios Adicionais (Incluídos Sem Custo Extra)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Plataforma Unificada</p>
                    <p className="text-xs text-muted-foreground">Sem integrações complexas entre sistemas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Interface Única</p>
                    <p className="text-xs text-muted-foreground">Sem múltiplos logins e dashboards</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Suporte Centralizado</p>
                    <p className="text-xs text-muted-foreground">Um único ponto de contacto técnico</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Atualizações Contínuas</p>
                    <p className="text-xs text-muted-foreground">Novas funcionalidades incluídas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Customização Total</p>
                    <p className="text-xs text-muted-foreground">À medida do seu negócio</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Propriedade dos Dados</p>
                    <p className="text-xs text-muted-foreground">100% controlo sobre a sua informação</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Market Comparison - What you'd need to manage */}
          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <X className="w-5 h-5" />
                O Que Teria de Gerir com Soluções Separadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-lg bg-background">
                  <p className="text-3xl font-bold text-red-600">14+</p>
                  <p className="text-sm text-muted-foreground">Subscrições diferentes</p>
                </div>
                <div className="p-4 rounded-lg bg-background">
                  <p className="text-3xl font-bold text-red-600">14+</p>
                  <p className="text-sm text-muted-foreground">Logins para memorizar</p>
                </div>
                <div className="p-4 rounded-lg bg-background">
                  <p className="text-3xl font-bold text-red-600">14+</p>
                  <p className="text-sm text-muted-foreground">Faturas mensais</p>
                </div>
                <div className="p-4 rounded-lg bg-background">
                  <p className="text-3xl font-bold text-red-600">∞</p>
                  <p className="text-sm text-muted-foreground">Problemas de integração</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sources */}
          <div className="mt-6 text-xs text-muted-foreground">
            <p className="font-medium mb-2">Fontes de Preços (Janeiro 2026):</p>
            <p>Squarespace.com/pricing • Pipedrive.com/pricing • SuiteDash.com/pricing • PandaDoc.com/pricing • DocuSign.com/pricing • Intercom.com/pricing • Mailchimp.com/pricing • Plausible.io/pricing • AWS S3 Pricing • Auth0.com/pricing • Google AI Gemini Pricing</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t mt-12 print:mt-8">
          <img 
            src={arifaLogo} 
            alt="ARIFA Studio" 
            className="h-12 mx-auto mb-4"
          />
          <p className="text-muted-foreground">
            ARIFA Studio © 2026 - Documentação Técnica
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Plataforma desenvolvida à medida
          </p>
        </footer>
      </div>

      {/* Print Styles + Call Highlight Styles */}
      <style>{`
        @media print {
          body { 
            print-color-adjust: exact; 
            -webkit-print-color-adjust: exact;
          }
          .print\\:hidden { display: none !important; }
          .print\\:break-before-page { break-before: page; }
          @page { 
            margin: 1cm; 
            size: A4;
          }
        }
        
        .call-highlight {
          position: relative;
          border-left: 4px solid hsl(var(--primary));
        }
      `}</style>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ 
  icon, 
  title, 
  features 
}: { 
  icon: React.ReactNode; 
  title: string; 
  features: string[] 
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-primary">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 text-sm">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// Tech Card Component
function TechCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string 
}) {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className="inline-flex p-3 bg-primary/10 rounded-full mb-3">
          <span className="w-6 h-6 text-primary">{icon}</span>
        </div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

// Flow Step Component with implemented badge
function FlowStep({ label, highlight = false, implemented = false }: { label: string; highlight?: boolean; implemented?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <Badge variant={highlight ? "default" : "outline"} className="whitespace-nowrap">
        {label}
      </Badge>
      {implemented && (
        <CheckCircle className="w-3 h-3 text-green-500" />
      )}
    </div>
  );
}
