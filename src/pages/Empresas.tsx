import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Store, UtensilsCrossed, CheckCircle2 } from "lucide-react";
import { SegmentTestimonials } from "@/components/SegmentTestimonials";
import { LeadMagnetSection } from "@/components/LeadMagnetSection";
import { SegmentProjects } from "@/components/SegmentProjects";

const services = [
  {
    icon: Building2,
    title: "Escritórios & Espaços de Trabalho",
    description: "Design centrado nas pessoas com integração BIM. Espaços que potenciam produtividade, bem-estar e retenção de talento.",
  },
  {
    icon: Store,
    title: "Instalações Educativas & Saúde",
    description: "Escolas, centros de formação e instalações de saúde projetadas para alto desempenho e conforto dos utilizadores.",
  },
  {
    icon: UtensilsCrossed,
    title: "Residências Seniores & Hospitalidade",
    description: "Espaços de vida assistida e hospitalidade com foco em acessibilidade, sustentabilidade e experiência do utilizador.",
  },
];

const benefits = [
  "Digitalização inteligente com BIM integrado",
  "Redução de riscos e otimização de recursos",
  "Análise preditiva e simulações paramétricas",
  "Controlo de qualidade em todas as fases",
  "Ativos de alto desempenho e sustentáveis",
  "Colaboração estratégica de longo prazo",
];

export default function Empresas() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium tracking-[0.3em] text-arifa-coral uppercase">
                  Empresas
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-light leading-tight text-foreground">
                  Espaços que{" "}
                  <span className="italic text-arifa-coral">transformam</span>{" "}
                  negócios
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                O ambiente de trabalho influencia diretamente a performance da sua equipa. 
                Criamos espaços corporativos que inspiram, motivam e retêm talento.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contacto">
                    Solicitar Proposta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Projeto corporativo ARIFA"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container-arifa">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-coral uppercase mb-4">
              Áreas de Atuação
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Soluções para empresas
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-card border border-border rounded-sm p-8 hover:shadow-card transition-shadow">
                <div className="w-14 h-14 rounded-full bg-arifa-coral/10 flex items-center justify-center mb-6">
                  <service.icon className="h-6 w-6 text-arifa-coral" />
                </div>
                <h3 className="font-display text-2xl font-medium text-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 lg:py-32 bg-arifa-cream">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <div className="aspect-square rounded-sm overflow-hidden shadow-card">
                <img
                  src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Ambiente de trabalho moderno"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium tracking-[0.3em] text-arifa-coral uppercase">
                  Benefícios
                </p>
                <h2 className="font-display text-4xl font-light text-foreground">
                  O ROI de um bom espaço de trabalho
                </h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Investir no ambiente de trabalho não é um custo, é uma estratégia de negócio. 
                Espaços bem desenhados impactam diretamente a cultura, produtividade e retenção.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-arifa-coral flex-shrink-0" />
                    <span className="text-sm text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <SegmentProjects segment="empresas" />
      {/* Testimonials */}
      <SegmentTestimonials segment="empresas" />

      {/* Lead Magnet */}
      <LeadMagnetSection segment="empresas" />

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-arifa-charcoal text-primary-foreground">
        <div className="container-arifa text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light mb-6">
            Vamos transformar o seu espaço?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8">
            Agende uma visita às suas instalações. Analisamos o espaço e apresentamos 
            soluções que se adaptam ao seu orçamento e objetivos.
          </p>
          <Button variant="accent" size="lg" asChild>
            <Link to="/contacto">
              Agendar Visita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
