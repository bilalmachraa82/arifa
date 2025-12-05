import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Palette, Ruler, CheckCircle2 } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Moradias Unifamiliares",
    description: "Projetos de raiz personalizados que combinam funcionalidade, estética e sustentabilidade. Do conceito à entrega de chave na mão.",
  },
  {
    icon: Palette,
    title: "Design de Interiores",
    description: "Espaços que refletem a sua personalidade. Seleção de materiais, mobiliário e iluminação para criar ambientes únicos.",
  },
  {
    icon: Ruler,
    title: "Remodelações",
    description: "Transformamos espaços existentes em casas modernas e funcionais, respeitando a identidade original do edifício.",
  },
];

const process = [
  { step: "01", title: "Consulta Inicial", description: "Reunião para conhecer as suas necessidades, gostos e orçamento." },
  { step: "02", title: "Estudo Preliminar", description: "Apresentação de conceitos e soluções espaciais para aprovação." },
  { step: "03", title: "Projeto de Execução", description: "Desenvolvimento detalhado de todos os elementos técnicos." },
  { step: "04", title: "Acompanhamento de Obra", description: "Supervisão da construção para garantir qualidade e conformidade." },
];

const projects = [
  {
    title: "Casa da Serra",
    location: "Sintra",
    area: "280 m²",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Apartamento Chiado",
    location: "Lisboa",
    area: "120 m²",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Villa Oceano",
    location: "Cascais",
    area: "450 m²",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

export default function Privado() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase">
                  Clientes Privados
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-light leading-tight text-foreground">
                  A casa dos seus{" "}
                  <span className="italic text-arifa-teal">sonhos</span>
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Criamos espaços que contam a sua história. Cada projeto é único, 
                desenvolvido à medida das suas necessidades, estilo de vida e aspirações.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contacto">
                    Marcar Consulta Gratuita
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-elevated">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                  alt="Projeto residencial ARIFA"
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
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase mb-4">
              Serviços
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Soluções para o seu lar
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-card border border-border rounded-sm p-8 hover:shadow-card transition-shadow">
                <div className="w-14 h-14 rounded-full bg-arifa-teal/10 flex items-center justify-center mb-6">
                  <service.icon className="h-6 w-6 text-arifa-teal" />
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
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase mb-4">
              Processo
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Como trabalhamos consigo
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-display font-light text-arifa-teal/20 mb-4">{item.step}</div>
                <h3 className="font-display text-xl font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container-arifa">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div className="space-y-4">
              <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase">
                Portfolio
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
                Projetos residenciais
              </h2>
            </div>
            <Button variant="minimal" asChild>
              <Link to="/portfolio">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.title} className="group">
                <div className="aspect-[4/5] rounded-sm overflow-hidden mb-4">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display text-xl font-medium text-foreground">{project.title}</h3>
                <p className="text-sm text-muted-foreground">{project.location} · {project.area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-arifa-charcoal text-primary-foreground">
        <div className="container-arifa text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light mb-6">
            Pronto para começar?
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8">
            A primeira consulta é gratuita e sem compromisso. 
            Conte-nos sobre o seu projeto e vamos transformá-lo em realidade.
          </p>
          <Button variant="accent" size="lg" asChild>
            <Link to="/contacto">
              Agendar Consulta
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
