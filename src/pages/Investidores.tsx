import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, FileSearch, Building } from "lucide-react";
import { SegmentTestimonials } from "@/components/SegmentTestimonials";
import { LeadMagnetSection } from "@/components/LeadMagnetSection";
import { SegmentProjects } from "@/components/SegmentProjects";

const services = [
  {
    icon: FileSearch,
    title: "Consultoria Estratégica e Viabilidade",
    description: "Análise técnica e financeira completa com simulações paramétricas para fundamentar decisões de investimento.",
  },
  {
    icon: Building,
    title: "Design Arquitetónico e Técnico",
    description: "Projetos integrados com modelação BIM, coordenação de especialidades e gestão de construção.",
  },
  {
    icon: TrendingUp,
    title: "Eficiência e Sustentabilidade",
    description: "Soluções inovadoras para reduzir riscos, otimizar recursos e garantir ativos de alto desempenho.",
  },
];

const metrics = [
  { value: "€50M+", label: "Valor total de projetos" },
  { value: "25+", label: "Empreendimentos" },
  { value: "18%", label: "ROI médio" },
  { value: "100%", label: "Licenciamentos aprovados" },
];

const process = [
  {
    step: "01",
    title: "Análise de Oportunidade",
    description: "Avaliação do terreno ou edifício, zonamento urbanístico e potencial de valorização.",
  },
  {
    step: "02",
    title: "Estudo de Viabilidade",
    description: "Projeto conceptual com análise de custos, cronograma e projeção de rentabilidade.",
  },
  {
    step: "03",
    title: "Projeto e Licenciamento",
    description: "Desenvolvimento de projeto aprovado pelas entidades, com acompanhamento do processo.",
  },
  {
    step: "04",
    title: "Execução e Entrega",
    description: "Fiscalização da obra, controlo de qualidade e cumprimento de prazos.",
  },
];

export default function Investidores() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium tracking-[0.3em] text-arifa-gold uppercase">
                  Investidores
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-light leading-tight text-foreground">
                  Maximize o{" "}
                  <span className="italic text-arifa-gold">retorno</span>{" "}
                  do seu investimento
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Transformamos oportunidades imobiliárias em projetos rentáveis. 
                Estudos de viabilidade rigorosos, licenciamento eficiente e execução de excelência.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contacto">
                    Solicitar Estudo de Viabilidade
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Edifício de investimento"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-16 bg-arifa-charcoal text-primary-foreground">
        <div className="container-arifa">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="font-display text-4xl md:text-5xl font-light text-arifa-gold">{metric.value}</p>
                <p className="text-sm text-primary-foreground/70 mt-2">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container-arifa">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-gold uppercase mb-4">
              Serviços
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Soluções para investidores
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-card border border-border rounded-sm p-8 hover:shadow-card transition-shadow">
                <div className="w-14 h-14 rounded-full bg-arifa-gold/10 flex items-center justify-center mb-6">
                  <service.icon className="h-6 w-6 text-arifa-gold" />
                </div>
                <h3 className="font-display text-2xl font-medium text-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 lg:py-32 bg-arifa-cream">
        <div className="container-arifa">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-gold uppercase mb-4">
              Metodologia
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Do terreno ao retorno
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-display font-light text-arifa-gold/20 mb-4">{item.step}</div>
                <h3 className="font-display text-xl font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Preview */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium tracking-[0.3em] text-arifa-gold uppercase">
                  Caso de Estudo
                </p>
                <h2 className="font-display text-4xl font-light text-foreground">
                  Empreendimento Tejo View
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Reabilitação de edifício histórico em zona ARU (Área de Reabilitação Urbana) 
                com 12 apartamentos de luxo e 2 espaços comerciais no rés-do-chão.
              </p>
              <div className="grid grid-cols-2 gap-6 py-6 border-y border-border">
                <div>
                  <p className="font-display text-2xl font-medium text-foreground">€2.8M</p>
                  <p className="text-sm text-muted-foreground">Investimento total</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-medium text-foreground">22%</p>
                  <p className="text-sm text-muted-foreground">ROI em 24 meses</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-medium text-foreground">1.850 m²</p>
                  <p className="text-sm text-muted-foreground">Área bruta</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-medium text-foreground">18 meses</p>
                  <p className="text-sm text-muted-foreground">Prazo de construção</p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link to="/portfolio">
                  Ver mais casos de estudo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Empreendimento Tejo View"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <SegmentProjects segment="investidores" />

      {/* Testimonials */}
      <SegmentTestimonials segment="investidores" />

      {/* Lead Magnet */}
      <LeadMagnetSection segment="investidores" />

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-arifa-charcoal text-primary-foreground">
        <div className="container-arifa text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light mb-6">
            Tem uma oportunidade de investimento?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8">
            Solicite um estudo de viabilidade gratuito para o seu terreno ou edifício. 
            Analisamos o potencial e apresentamos cenários de investimento.
          </p>
          <Button variant="accent" size="lg" asChild>
            <Link to="/contacto">
              Solicitar Análise Gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
