import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Lightbulb, 
  Compass, 
  Boxes, 
  LineChart, 
  HardHat, 
  Leaf,
  CheckCircle2,
  Clock,
  Users,
  Target
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

const services = [
  {
    id: "consultoria",
    icon: Lightbulb,
    titlePt: "Consultoria Estratégica e Viabilidade",
    titleEn: "Strategic Consulting and Feasibility",
    descriptionPt: "Análise detalhada da viabilidade do seu projeto antes de qualquer investimento significativo. Avaliamos localização, regulamentos, custos estimados e potencial de retorno.",
    descriptionEn: "Detailed feasibility analysis of your project before any significant investment. We evaluate location, regulations, estimated costs and return potential.",
    featuresPt: [
      "Estudo de viabilidade económica e financeira",
      "Análise de mercado e concorrência",
      "Avaliação de terrenos e localizações",
      "Consultoria em licenciamento e regulamentos",
      "Planeamento estratégico de projeto",
      "Due diligence técnica para investidores"
    ],
    featuresEn: [
      "Economic and financial feasibility study",
      "Market and competition analysis",
      "Land and location assessment",
      "Licensing and regulatory consulting",
      "Strategic project planning",
      "Technical due diligence for investors"
    ],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "design",
    icon: Compass,
    titlePt: "Design Arquitetónico e Técnico",
    titleEn: "Architectural and Technical Design",
    descriptionPt: "Criação de projetos que combinam estética, funcionalidade e viabilidade técnica. Do conceito ao projeto de execução, cada detalhe é pensado para o seu sucesso.",
    descriptionEn: "Creating projects that combine aesthetics, functionality and technical feasibility. From concept to execution project, every detail is designed for your success.",
    featuresPt: [
      "Projeto de arquitetura e interiores",
      "Design de mobiliário personalizado",
      "Projetos de especialidades (AVAC, eletricidade, etc.)",
      "Renderização 3D fotorrealista",
      "Documentação técnica completa",
      "Acompanhamento do licenciamento"
    ],
    featuresEn: [
      "Architecture and interior design",
      "Custom furniture design",
      "Specialty projects (HVAC, electrical, etc.)",
      "Photorealistic 3D rendering",
      "Complete technical documentation",
      "Licensing follow-up"
    ],
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "bim",
    icon: Boxes,
    titlePt: "Modelação e Coordenação BIM",
    titleEn: "BIM Modeling and Coordination",
    descriptionPt: "Implementação completa de Building Information Modeling para digitalização inteligente do seu projeto. Reduza erros, otimize recursos e melhore a colaboração.",
    descriptionEn: "Complete Building Information Modeling implementation for intelligent digitization of your project. Reduce errors, optimize resources and improve collaboration.",
    featuresPt: [
      "Modelação BIM 3D/4D/5D",
      "Coordenação de especialidades",
      "Deteção e resolução de conflitos",
      "Quantificação automática de materiais",
      "Gestão documental integrada",
      "Entrega de modelo as-built"
    ],
    featuresEn: [
      "BIM 3D/4D/5D modeling",
      "Specialty coordination",
      "Clash detection and resolution",
      "Automatic material quantification",
      "Integrated document management",
      "As-built model delivery"
    ],
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "simulacoes",
    icon: LineChart,
    titlePt: "Análise Preditiva e Simulações",
    titleEn: "Predictive Analysis and Simulations",
    descriptionPt: "Simulações avançadas para validar decisões de design antes da construção. Análise térmica, acústica, de iluminação e estrutural para otimização de desempenho.",
    descriptionEn: "Advanced simulations to validate design decisions before construction. Thermal, acoustic, lighting and structural analysis for performance optimization.",
    featuresPt: [
      "Simulação energética e térmica",
      "Análise de iluminação natural e artificial",
      "Simulação acústica",
      "Análise de fluxos de pessoas",
      "Cálculo estrutural e sísmico",
      "Certificação energética"
    ],
    featuresEn: [
      "Energy and thermal simulation",
      "Natural and artificial lighting analysis",
      "Acoustic simulation",
      "People flow analysis",
      "Structural and seismic calculation",
      "Energy certification"
    ],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "construcao",
    icon: HardHat,
    titlePt: "Gestão de Construção",
    titleEn: "Construction Management",
    descriptionPt: "Acompanhamento profissional de obra para garantir qualidade, prazos e orçamento. Somos os seus olhos no terreno, protegendo o seu investimento.",
    descriptionEn: "Professional construction monitoring to ensure quality, deadlines and budget. We are your eyes on the ground, protecting your investment.",
    featuresPt: [
      "Fiscalização e gestão de obra",
      "Coordenação de empreiteiros",
      "Controlo de qualidade",
      "Gestão de cronograma e orçamento",
      "Reuniões de obra semanais",
      "Relatórios de progresso detalhados"
    ],
    featuresEn: [
      "Construction supervision and management",
      "Contractor coordination",
      "Quality control",
      "Schedule and budget management",
      "Weekly site meetings",
      "Detailed progress reports"
    ],
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  },
  {
    id: "sustentabilidade",
    icon: Leaf,
    titlePt: "Eficiência e Sustentabilidade",
    titleEn: "Efficiency and Sustainability",
    descriptionPt: "Soluções para edifícios mais eficientes e sustentáveis. Da certificação LEED/BREEAM à implementação de energias renováveis e economia circular.",
    descriptionEn: "Solutions for more efficient and sustainable buildings. From LEED/BREEAM certification to renewable energy implementation and circular economy.",
    featuresPt: [
      "Consultoria LEED, BREEAM, WELL",
      "Análise de ciclo de vida (LCA)",
      "Sistemas de energias renováveis",
      "Gestão eficiente de água",
      "Materiais sustentáveis e locais",
      "Economia circular na construção"
    ],
    featuresEn: [
      "LEED, BREEAM, WELL consulting",
      "Life cycle analysis (LCA)",
      "Renewable energy systems",
      "Efficient water management",
      "Sustainable and local materials",
      "Circular economy in construction"
    ],
    image: "https://images.unsplash.com/photo-1518173946687-a4c036bc3bba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
  }
];

const processSteps = [
  {
    iconPt: Clock,
    iconEn: Clock,
    titlePt: "1. Consulta Inicial",
    titleEn: "1. Initial Consultation",
    descriptionPt: "Reunião gratuita para entender os seus objetivos, necessidades e orçamento.",
    descriptionEn: "Free meeting to understand your goals, needs and budget."
  },
  {
    iconPt: Target,
    iconEn: Target,
    titlePt: "2. Proposta Personalizada",
    titleEn: "2. Custom Proposal",
    descriptionPt: "Apresentação de proposta detalhada com escopo, cronograma e investimento.",
    descriptionEn: "Detailed proposal presentation with scope, timeline and investment."
  },
  {
    iconPt: Users,
    iconEn: Users,
    titlePt: "3. Desenvolvimento",
    titleEn: "3. Development",
    descriptionPt: "Execução do projeto com acompanhamento contínuo e validações regulares.",
    descriptionEn: "Project execution with continuous monitoring and regular validations."
  },
  {
    iconPt: CheckCircle2,
    iconEn: CheckCircle2,
    titlePt: "4. Entrega",
    titleEn: "4. Delivery",
    descriptionPt: "Entrega completa com toda a documentação e suporte pós-projeto.",
    descriptionEn: "Complete delivery with all documentation and post-project support."
  }
];

export default function Servicos() {
  const { language } = useLanguage();
  const isPt = language === "pt";

  return (
    <Layout>
      <SEO 
        title={isPt ? "Serviços" : "Services"}
        description={isPt 
          ? "Serviços completos de arquitetura: consultoria, design, BIM, simulações, gestão de construção e sustentabilidade."
          : "Complete architecture services: consulting, design, BIM, simulations, construction management and sustainability."
        }
        url="https://arifa.studio/servicos"
        keywords="serviços arquitetura, consultoria arquitetura, BIM, design interiores, gestão construção, sustentabilidade"
      />
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-arifa-warm-white to-background">
        <div className="container-arifa">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium tracking-[0.3em] text-arifa-coral uppercase">
                {isPt ? "Serviços" : "Services"}
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-tight text-foreground">
                {isPt ? "Soluções completas para " : "Complete solutions for "}
                <span className="italic text-arifa-coral">
                  {isPt ? "arquitetura" : "architecture"}
                </span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {isPt 
                ? "Da estratégia à entrega, oferecemos um ecossistema integrado de serviços para transformar a sua visão em realidade."
                : "From strategy to delivery, we offer an integrated ecosystem of services to turn your vision into reality."
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contacto">
                  {isPt ? "Agendar Consulta Gratuita" : "Schedule Free Consultation"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/portfolio">
                  {isPt ? "Ver Portfolio" : "View Portfolio"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container-arifa">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div 
                key={service.id} 
                id={service.id}
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
                  index % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                <div className={`space-y-8 ${index % 2 === 1 ? "lg:col-start-2" : ""}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-arifa-coral/10 flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-arifa-coral" />
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">
                      {isPt ? service.titlePt : service.titleEn}
                    </h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {isPt ? service.descriptionPt : service.descriptionEn}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(isPt ? service.featuresPt : service.featuresEn).map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-arifa-coral flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="minimal" asChild>
                    <Link to="/contacto">
                      {isPt ? "Saber mais" : "Learn more"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                  <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-elevated">
                    <img
                      src={service.image}
                      alt={isPt ? service.titlePt : service.titleEn}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 lg:py-32 bg-arifa-cream">
        <div className="container-arifa">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-coral uppercase mb-4">
              {isPt ? "Como Trabalhamos" : "How We Work"}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
              {isPt ? "O nosso processo" : "Our process"}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-arifa-coral/10 flex items-center justify-center mx-auto">
                  <step.iconPt className="h-7 w-7 text-arifa-coral" />
                </div>
                <h3 className="font-display text-xl font-medium text-foreground">
                  {isPt ? step.titlePt : step.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isPt ? step.descriptionPt : step.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-arifa-charcoal text-primary-foreground">
        <div className="container-arifa text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light mb-6">
            {isPt ? "Pronto para começar?" : "Ready to start?"}
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8">
            {isPt 
              ? "A primeira consulta é gratuita e sem compromisso. Vamos conversar sobre como podemos ajudar no seu projeto."
              : "The first consultation is free and without obligation. Let's talk about how we can help with your project."
            }
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="accent" size="lg" asChild>
              <Link to="/contacto">
                {isPt ? "Agendar Consulta" : "Schedule Consultation"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <a href="tel:+351912345678">
                {isPt ? "Ligar Agora" : "Call Now"}
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}