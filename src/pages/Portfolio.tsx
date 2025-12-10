import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string | null;
  area: string | null;
  year: string | null;
  status: string | null;
  description: string | null;
  featured_image: string | null;
}

const categories = ["Todos", "Residencial", "Corporativo", "Multi-familiar", "Hotelaria", "Industrial"];

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, slug, category, location, area, year, status, description, featured_image")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    }

    fetchProjects();
  }, []);

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
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-arifa-teal" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-lg text-muted-foreground">Nenhum projeto encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/portfolio/${project.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/5] rounded-sm overflow-hidden mb-4 relative">
                    <img
                      src={project.featured_image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-arifa-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Status badge */}
                    {project.status && (
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
                    )}

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
                      {project.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {project.location}
                        </span>
                      )}
                      {project.area && <span>{project.area}</span>}
                      {project.year && <span>{project.year}</span>}
                    </div>
                    {project.description && (
                      <p className="text-sm text-muted-foreground pt-2">{project.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
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
