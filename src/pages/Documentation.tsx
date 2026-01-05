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
  Cpu
} from "lucide-react";
import arifaLogo from "@/assets/arifa-logo.png";

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

        {/* Section 0: Value Proposition */}
        <section className="mb-12 print:mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Porquê Esta Plataforma?</h2>
          </div>

          {/* Main Value Proposition */}
          <Card className="mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6 pb-6">
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

        {/* Section 1: Public Site */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">1. Site Público</h2>
              <p className="text-muted-foreground mt-1">A sua montra digital — primeira impressão que convence e converte visitantes em clientes</p>
            </div>
          </div>
          
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

        {/* Section 2: Client Portal */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">2. Portal do Cliente</h2>
              <p className="text-muted-foreground mt-1">Experiência premium que fideliza — clientes informados são clientes satisfeitos</p>
            </div>
          </div>
          
          <Card className="mb-6 border-purple-500/20 bg-purple-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-purple-700">Vantagem Competitiva</h4>
                  <p className="text-sm text-muted-foreground">Portal exclusivo 24/7 onde os clientes acompanham projetos sem precisar de telefonar ou enviar emails. Visualizam plantas 3D, aprovam documentos, e recebem atualizações automáticas por IA. Reduz chamadas em 60%.</p>
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
                "Barra de thumbnails"
              ]}
            />
            <FeatureCard
              icon={<Rotate3D className="w-5 h-5" />}
              title="Preview de Documentos"
              features={[
                "Visualização inline de PDFs",
                "Preview de Word e Excel",
                "Modelos 3D interativos (GLB/GLTF)",
                "Controlos: rodar, zoom, pan",
                "Download direto"
              ]}
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5" />}
              title="Gestão Documental"
              features={[
                "Pastas organizadas",
                "Histórico de versões completo",
                "Preview inline de ficheiros",
                "Download direto",
                "Tipos: PDF, Word, Excel, 3D"
              ]}
            />
            <FeatureCard
              icon={<MessageSquare className="w-5 h-5" />}
              title="Sistema de Mensagens"
              features={[
                "Chat em tempo real",
                "Indicador 'está a escrever'",
                "Anexos em mensagens",
                "Histórico por projeto",
                "Notificações instantâneas"
              ]}
            />
            <FeatureCard
              icon={<Bot className="w-5 h-5" />}
              title="AI Features"
              features={[
                "Weekly Updates automáticos",
                "Resumos gerados por IA",
                "Chatbot de suporte 24/7",
                "Perguntas sobre o projeto",
                "Powered by Google Gemini"
              ]}
            />
            <FeatureCard
              icon={<Sparkles className="w-5 h-5" />}
              title="Onboarding Inteligente"
              features={[
                "Tour guiado automático",
                "Passos interativos com destaque",
                "Explicação de cada funcionalidade",
                "Possibilidade de reiniciar tour",
                "Primeira experiência memorável"
              ]}
            />
            <FeatureCard
              icon={<TrendingUp className="w-5 h-5" />}
              title="Orçamento"
              features={[
                "Visualização do budget",
                "Orçamento original vs atual",
                "Valor gasto",
                "Change orders",
                "Aprovação de alterações"
              ]}
            />
            <FeatureCard
              icon={<FileText className="w-5 h-5" />}
              title="Contratos"
              features={[
                "Visualização de cotações",
                "Assinatura digital (BoldSign)",
                "Download de contratos assinados",
                "Histórico de documentos",
                "Status em tempo real"
              ]}
            />
          </div>
        </section>

        <Separator className="my-8" />

        {/* Section 3: Admin Panel */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">3. Painel de Administração</h2>
              <p className="text-muted-foreground mt-1">Centro de comando — todas as operações do negócio num único lugar</p>
            </div>
          </div>
          
          <Card className="mb-6 border-orange-500/20 bg-orange-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-700">Vantagem Competitiva</h4>
                  <p className="text-sm text-muted-foreground">CRM visual com Kanban drag & drop, scoring automático de leads por IA, e pipeline de cotações com tracking. Sabe exatamente quem contactar, quando, e com que prioridade. Nunca mais perca uma oportunidade de negócio.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Section 4: Security */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">4. Segurança & Compliance</h2>
              <p className="text-muted-foreground mt-1">Proteção empresarial — dados dos seus clientes protegidos com tecnologia de ponta</p>
            </div>
          </div>
          
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

        {/* Section 5: Technical Features */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">5. Funcionalidades Técnicas</h2>
              <p className="text-muted-foreground mt-1">Tecnologia de ponta — performance, escalabilidade e experiência premium</p>
            </div>
          </div>
          
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

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Edge Functions (16)
              </CardTitle>
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

        {/* Section 6: User Journeys */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ArrowRight className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">6. Fluxos de Trabalho</h2>
              <p className="text-muted-foreground mt-1">Processos automatizados — do primeiro contacto até à entrega do projeto</p>
            </div>
          </div>
          
          <Card className="mb-6 border-indigo-500/20 bg-indigo-500/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-indigo-700">Vantagem Competitiva</h4>
                  <p className="text-sm text-muted-foreground">Fluxos ponta-a-ponta automatizados: leads recebem scoring automático por IA, cotações são enviadas com tracking, contratos são assinados digitalmente, e clientes recebem convite automático para o portal. Zero tarefas manuais repetitivas.</p>
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
                <FlowStep label="Visitante" />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Formulário Contacto" />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Lead Criado" highlight />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="AI Lead Scoring" />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Kanban CRM" />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Criar Cotação" />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Enviar Cotação" />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Cliente Aceita?" highlight />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Criar Contrato" />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Assinatura Digital" />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Enviar Convite" />
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <FlowStep label="Cliente Registado" highlight />
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
                  <FlowStep label="Projeto Criado" highlight />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="1. Preparação" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="2. Conceito" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="3. Coordenação" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="4. Técnico" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="5. Construção" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="6. Entrega" />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <FlowStep label="7. Em Uso" highlight />
                </div>
                
                <div className="flex justify-center">
                  <ArrowDown className="w-6 h-6 text-muted-foreground" />
                </div>
                
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-center">Portal do Cliente</h4>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline">Dashboard</Badge>
                    <Badge variant="outline">Timeline Visual</Badge>
                    <Badge variant="outline">Galeria Fotos</Badge>
                    <Badge variant="outline">Documentos</Badge>
                    <Badge variant="outline">Mensagens</Badge>
                    <Badge variant="outline">AI Updates</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quote Flow */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Fluxo: Sistema de Cotações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Admin
                  </h4>
                  <div className="space-y-1 pl-6">
                    <p className="text-muted-foreground">1. Criar Cotação</p>
                    <p className="text-muted-foreground">2. Adicionar Itens</p>
                    <p className="text-muted-foreground">3. Gerar PDF</p>
                    <p className="text-muted-foreground">4. Enviar Cotação</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-primary" />
                    Sistema
                  </h4>
                  <div className="space-y-1 pl-6">
                    <p className="text-muted-foreground">5. Email com Link</p>
                    <p className="text-muted-foreground">6. Tracking Visualização</p>
                    <p className="text-muted-foreground">7. Notificar Admin</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    Cliente
                  </h4>
                  <div className="space-y-1 pl-6">
                    <p className="text-muted-foreground">8. Visualizar Cotação</p>
                    <p className="text-muted-foreground">9. Aceitar/Rejeitar</p>
                    <p className="text-muted-foreground">10. Assinar Digitalmente</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    BoldSign
                  </h4>
                  <div className="space-y-1 pl-6">
                    <p className="text-muted-foreground">11. Criar Contrato</p>
                    <p className="text-muted-foreground">12. Link Assinatura</p>
                    <p className="text-muted-foreground">13. Webhook Assinado</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Architecture */}
          <Card>
            <CardHeader>
              <CardTitle>Arquitetura do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-center bg-primary/10 rounded-lg py-2">Frontend</h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">React + Vite</Badge>
                    <Badge variant="outline" className="w-full justify-center">Tailwind + shadcn/ui</Badge>
                    <Badge variant="outline" className="w-full justify-center">React Query</Badge>
                    <Badge variant="outline" className="w-full justify-center">Framer Motion</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-center bg-primary/10 rounded-lg py-2">Cloud Backend</h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">PostgreSQL</Badge>
                    <Badge variant="outline" className="w-full justify-center">Auth</Badge>
                    <Badge variant="outline" className="w-full justify-center">Storage</Badge>
                    <Badge variant="outline" className="w-full justify-center">Edge Functions</Badge>
                    <Badge variant="outline" className="w-full justify-center">Realtime</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-center bg-primary/10 rounded-lg py-2">Integrações</h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center">BoldSign (Contratos)</Badge>
                    <Badge variant="outline" className="w-full justify-center">Resend (Email)</Badge>
                    <Badge variant="outline" className="w-full justify-center">Google Gemini AI</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-8" />

        {/* Section 7: Database Schema */}
        <section className="mb-12 print:mb-8 print:break-before-page">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">7. Estrutura de Dados</h2>
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

          {/* Savings Highlight */}
          <Card className="mb-8 bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-500/30">
            <CardContent className="pt-6 pb-6">
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

      {/* Print Styles */}
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

// Flow Step Component
function FlowStep({ label, highlight = false }: { label: string; highlight?: boolean }) {
  return (
    <Badge variant={highlight ? "default" : "outline"} className="whitespace-nowrap">
      {label}
    </Badge>
  );
}
