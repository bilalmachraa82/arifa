import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

type Segment = "privado" | "empresas" | "investidores";

const accentColors: Record<Segment, string> = {
  privado: "text-accent",
  empresas: "text-arifa-coral",
  investidores: "text-arifa-yellow",
};

const hoverColors: Record<Segment, string> = {
  privado: "group-hover:text-accent",
  empresas: "group-hover:text-arifa-coral",
  investidores: "group-hover:text-arifa-yellow",
};

const titles: Record<Segment, string> = {
  privado: "Projetos residenciais",
  empresas: "Projetos corporativos",
  investidores: "Projetos de investimento",
};

interface SegmentProjectsProps {
  segment: Segment;
  limit?: number;
}

export function SegmentProjects({ segment, limit = 3 }: SegmentProjectsProps) {
  const accentColor = accentColors[segment];
  const hoverColor = hoverColors[segment];
  const title = titles[segment];

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", segment, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, slug, location, area, featured_image")
        .eq("is_published", true)
        .eq("segment", segment)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    },
  });

  // Fallback images for when no projects exist
  const fallbackImages: Record<Segment, string[]> = {
    privado: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    empresas: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    investidores: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464938050520-ef2571fb8eb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
  };

  const fallbackProjects: Record<Segment, { title: string; location: string; area: string }[]> = {
    privado: [
      { title: "Casa da Serra", location: "Sintra", area: "280 m²" },
      { title: "Apartamento Chiado", location: "Lisboa", area: "120 m²" },
      { title: "Villa Oceano", location: "Cascais", area: "450 m²" },
    ],
    empresas: [
      { title: "Escritórios TechStart", location: "Lisboa", area: "1.200 m²" },
      { title: "Restaurante Mar & Terra", location: "Porto", area: "350 m²" },
      { title: "Boutique Hotel Fado", location: "Lisboa", area: "2.500 m²" },
    ],
    investidores: [
      { title: "Empreendimento Tejo View", location: "Lisboa", area: "1.850 m²" },
      { title: "Edifício Príncipe Real", location: "Lisboa", area: "2.200 m²" },
      { title: "Residências Cascais", location: "Cascais", area: "3.500 m²" },
    ],
  };

  const displayProjects = projects && projects.length > 0
    ? projects
    : fallbackProjects[segment].map((p, i) => ({
        id: `fallback-${i}`,
        title: p.title,
        slug: null,
        location: p.location,
        area: p.area,
        featured_image: fallbackImages[segment][i],
      }));

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container-arifa">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <p className={`text-sm font-medium tracking-[0.3em] uppercase ${accentColor}`}>
              Portfolio
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              {title}
            </h2>
          </div>
          <Button variant="minimal" asChild>
            <Link to={`/portfolio?segment=${segment}`}>
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {displayProjects.map((project) => (
              <Link
                key={project.id}
                to={project.slug ? `/portfolio/${project.slug}` : "/portfolio"}
                className="group"
              >
                <div className="aspect-[4/5] rounded-sm overflow-hidden mb-4">
                  <img
                    src={project.featured_image || fallbackImages[segment][0]}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className={`text-xl font-bold text-foreground ${hoverColor} transition-colors`}>
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.location} · {project.area}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
