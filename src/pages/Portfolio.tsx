import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SearchFilters } from "@/components/SearchFilters";
import { SEO } from "@/components/SEO";
import { PortfolioGridSkeleton } from "@/components/portfolio/PortfolioSkeleton";
import { ProjectCard } from "@/components/portfolio/ProjectCard";

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
  segment: string | null;
}

const defaultCategories = ["Todos", "Residencial", "Corporativo", "Multi-familiar", "Hotelaria", "Industrial"];
const segments = ["Todos", "privado", "empresas", "investidores"];
const segmentLabels: Record<string, string> = {
  "Todos": "Todos os Segmentos",
  "privado": "Privado",
  "empresas": "Empresas",
  "investidores": "Investidores",
};

export default function Portfolio() {
  const [searchParams] = useSearchParams();
  const segmentParam = searchParams.get("segment");

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeLocation, setActiveLocation] = useState("Todas");
  const [activeSegment, setActiveSegment] = useState(segmentParam || "Todos");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Update segment when URL param changes
  useEffect(() => {
    if (segmentParam) {
      setActiveSegment(segmentParam);
    }
  }, [segmentParam]);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("id, title, slug, category, location, area, year, status, description, featured_image, segment")
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

  // Extract unique categories and locations from projects
  const categories = useMemo(() => {
    const projectCategories = [...new Set(projects.map(p => p.category).filter(Boolean))];
    return ["Todos", ...projectCategories.filter(c => !defaultCategories.slice(1).includes(c)), ...defaultCategories.slice(1).filter(c => projectCategories.includes(c))];
  }, [projects]);

  const locations = useMemo(() => {
    const projectLocations = [...new Set(projects.map(p => p.location).filter(Boolean))] as string[];
    return ["Todas", ...projectLocations.sort()];
  }, [projects]);

  // Filter projects based on search query, category, location, and segment
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = !searchQuery || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeCategory === "Todos" || project.category === activeCategory;
      const matchesLocation = activeLocation === "Todas" || project.location === activeLocation;
      const matchesSegment = activeSegment === "Todos" || project.segment === activeSegment;

      return matchesSearch && matchesCategory && matchesLocation && matchesSegment;
    });
  }, [projects, searchQuery, activeCategory, activeLocation, activeSegment]);

  // Generate collection items for SEO
  const collectionItems = useMemo(() => {
    return projects.map(project => ({
      name: project.title,
      url: `https://arifa.studio/portfolio/${project.slug}`,
      image: project.featured_image || undefined,
      description: project.description || undefined
    }));
  }, [projects]);

  return (
    <Layout>
      <SEO 
        title="Portfolio"
        description="Explore o nosso portfolio de projetos de arquitetura e design de interiores. Residencial, corporativo, hotelaria e mais."
        url="https://arifa.studio/portfolio"
        keywords="portfolio arquitetura, projetos residenciais, design interiores Lisboa, arquitetura corporativa"
        breadcrumbs={[
          { name: "Início", url: "https://arifa.studio" },
          { name: "Portfolio", url: "https://arifa.studio/portfolio" }
        ]}
        collectionName="Portfolio de Projetos ARIFA Studio"
        collectionItems={collectionItems}
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-card">
        <div className="container-arifa">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-[0.3em] text-accent uppercase mb-4">
              Portfolio
            </p>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-foreground mb-6">
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
      <section className="py-6 bg-background border-b border-border sticky top-[73px] z-40">
        <div className="container-arifa space-y-4">
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            locations={locations}
            activeLocation={activeLocation}
            onLocationChange={setActiveLocation}
            placeholder="Pesquisar projetos..."
          />
          
          {/* Segment Filter */}
          <div className="flex flex-wrap gap-2">
            {segments.map((segment) => (
              <Button
                key={segment}
                variant={activeSegment === segment ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSegment(segment)}
                className="text-xs"
              >
                {segmentLabels[segment]}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-arifa">
          {loading ? (
            <PortfolioGridSkeleton count={6} />
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-lg text-muted-foreground mb-4">
                {searchQuery || activeCategory !== "Todos" || activeLocation !== "Todas" || activeSegment !== "Todos"
                  ? "Nenhum projeto encontrado com os filtros selecionados."
                  : "Nenhum projeto encontrado."
                }
              </p>
              {(searchQuery || activeCategory !== "Todos" || activeLocation !== "Todas" || activeSegment !== "Todos") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("Todos");
                    setActiveLocation("Todas");
                    setActiveSegment("Todos");
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-8">
                {filteredProjects.length} {filteredProjects.length === 1 ? "projeto encontrado" : "projetos encontrados"}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-card">
        <div className="container-arifa text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
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