import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["Todos", "Residencial", "Corporativo", "Hospitalidade", "Investimento"];

const projects = [
  {
    id: 1,
    title: "Casa da Serra",
    category: "Residencial",
    location: "Sintra",
    area: "280 m²",
    year: "2023",
    status: "Concluído",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Moradia unifamiliar com integração paisagística na Serra de Sintra.",
  },
  {
    id: 2,
    title: "Escritórios TechStart",
    category: "Corporativo",
    location: "Lisboa",
    area: "1.200 m²",
    year: "2023",
    status: "Concluído",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Espaço de trabalho colaborativo para empresa de tecnologia.",
  },
  {
    id: 3,
    title: "Hotel Atlântico",
    category: "Hospitalidade",
    location: "Cascais",
    area: "2.500 m²",
    year: "2024",
    status: "Em construção",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Boutique hotel com vista mar e spa integrado.",
  },
  {
    id: 4,
    title: "Tejo View",
    category: "Investimento",
    location: "Lisboa",
    area: "1.850 m²",
    year: "2023",
    status: "Concluído",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Reabilitação de edifício pombalino com 12 apartamentos de luxo.",
  },
  {
    id: 5,
    title: "Apartamento Chiado",
    category: "Residencial",
    location: "Lisboa",
    area: "120 m²",
    year: "2022",
    status: "Concluído",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Remodelação integral de apartamento no coração de Lisboa.",
  },
  {
    id: 6,
    title: "Restaurante Mar & Terra",
    category: "Hospitalidade",
    location: "Porto",
    area: "350 m²",
    year: "2022",
    status: "Concluído",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Restaurante gastronómico com cozinha aberta e ambiente intimista.",
  },
  {
    id: 7,
    title: "Villa Oceano",
    category: "Residencial",
    location: "Cascais",
    area: "450 m²",
    year: "2024",
    status: "Em projeto",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Moradia de luxo com piscina infinita e vista oceano.",
  },
  {
    id: 8,
    title: "Cowork Parque das Nações",
    category: "Corporativo",
    location: "Lisboa",
    area: "800 m²",
    year: "2023",
    status: "Concluído",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Espaço de coworking premium com terraço panorâmico.",
  },
];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filteredProjects = activeCategory === "Todos"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase mb-4">
              Portfolio
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight text-foreground mb-6">
              Os nossos projetos
            </h1>
            <p className="text-lg text-muted-foreground">
              Uma seleção dos nossos trabalhos mais recentes em arquitetura, design de interiores 
              e promoção imobiliária.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background border-b border-border sticky top-[73px] z-40">
        <div className="container-arifa">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-5 py-2 text-sm font-medium rounded-sm transition-colors",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-arifa">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/portfolio/${project.id}`}
                className="group block"
              >
                <div className="aspect-[4/5] rounded-sm overflow-hidden mb-4 relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-arifa-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Status badge */}
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "inline-block px-3 py-1 text-xs font-medium rounded-sm",
                      project.status === "Concluído"
                        ? "bg-arifa-green/90 text-primary-foreground"
                        : project.status === "Em construção"
                        ? "bg-arifa-gold/90 text-primary-foreground"
                        : "bg-arifa-teal/90 text-primary-foreground"
                    )}>
                      {project.status}
                    </span>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <ArrowRight className="h-5 w-5 text-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium tracking-wider text-arifa-teal uppercase">
                    {project.category}
                  </p>
                  <h3 className="font-display text-2xl font-medium text-foreground group-hover:text-arifa-teal transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </span>
                    <span>{project.area}</span>
                    <span>{project.year}</span>
                  </div>
                  <p className="text-sm text-muted-foreground pt-2">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-arifa-cream">
        <div className="container-arifa text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6">
            Tem um projeto em mente?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Conte-nos sobre as suas ideias. Estamos prontos para transformar a sua visão em realidade.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contacto">
              Fale Connosco
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
