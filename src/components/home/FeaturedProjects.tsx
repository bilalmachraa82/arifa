import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Casa da Serra",
    category: "Residencial",
    location: "Sintra",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    status: "Concluído",
  },
  {
    id: 2,
    title: "Escritórios Tejo",
    category: "Corporativo",
    location: "Lisboa",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    status: "Concluído",
  },
  {
    id: 3,
    title: "Hotel Atlântico",
    category: "Hospitalidade",
    location: "Cascais",
    image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    status: "Em construção",
  },
];

export function FeaturedProjects() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container-arifa">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase">
              Portfolio
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">
              Projetos em destaque
            </h2>
          </div>
          <Button variant="minimal" asChild>
            <Link to="/portfolio">
              Ver todos os projetos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/portfolio/${project.id}`}
              className="group relative block overflow-hidden rounded-sm"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-arifa-charcoal/90 via-arifa-charcoal/20 to-transparent" />
              
              {/* Status badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-sm ${
                  project.status === "Concluído" 
                    ? "bg-arifa-green/90 text-accent-foreground" 
                    : "bg-arifa-gold/90 text-accent-foreground"
                }`}>
                  {project.status}
                </span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs font-medium tracking-wider text-primary-foreground/70 uppercase mb-2">
                  {project.category}
                </p>
                <h3 className="font-display text-2xl font-medium text-primary-foreground mb-2">
                  {project.title}
                </h3>
                <div className="flex items-center text-sm text-primary-foreground/70">
                  <MapPin className="h-4 w-4 mr-1" />
                  {project.location}
                </div>
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="h-5 w-5 text-primary-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
