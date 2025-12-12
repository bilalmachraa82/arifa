import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string | null;
  featured_image: string | null;
  status: string | null;
}

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, slug, category, location, featured_image, status")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching featured projects:", error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    }

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-24 lg:py-32 bg-background">
        <div className="container-arifa flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container-arifa">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <p className="text-sm font-medium tracking-[0.3em] text-accent uppercase">
              {t("projects.subtitle")}
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">
              {t("projects.title")}
            </h2>
          </div>
          <Button variant="minimal" asChild>
            <Link to="/portfolio">
              {t("projects.viewAll")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/portfolio/${project.slug}`}
              className="group relative block overflow-hidden rounded-sm"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={project.featured_image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
              
              {/* Status badge */}
              {project.status && (
                <div className="absolute top-4 left-4">
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-sm ${
                    project.status === "Concluído" 
                      ? "bg-accent/90 text-accent-foreground" 
                      : "bg-arifa-yellow/90 text-foreground"
                  }`}>
                    {project.status}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs font-medium tracking-wider text-background/70 uppercase mb-2">
                  {project.category}
                </p>
                <h3 className="text-2xl font-bold text-background mb-2">
                  {project.title}
                </h3>
                {project.location && (
                  <div className="flex items-center text-sm text-background/70">
                    <MapPin className="h-4 w-4 mr-1" />
                    {project.location}
                  </div>
                )}
              </div>

              {/* Hover indicator */}
              <div className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-background/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowRight className="h-5 w-5 text-background" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
