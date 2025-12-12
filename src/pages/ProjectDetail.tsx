import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, MapPin, Calendar, Ruler, Building, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import { Lightbox } from "@/components/gallery/Lightbox";

interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  segment: string | null;
  location: string | null;
  area: string | null;
  year: string | null;
  status: string | null;
  description: string | null;
  full_description: string | null;
  featured_image: string | null;
  images: string[] | null;
}

interface RelatedProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  location: string | null;
  featured_image: string | null;
  status: string | null;
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [relatedProjects, setRelatedProjects] = useState<RelatedProject[]>([]);

  useEffect(() => {
    async function fetchProject() {
      if (!slug) return;
      
      setLoading(true);
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();

      if (error) {
        console.error("Error fetching project:", error);
      } else if (data) {
        setProject(data);
        
        // Fetch related projects from same category
        const { data: related } = await supabase
          .from("projects")
          .select("id, title, slug, category, location, featured_image, status")
          .eq("is_published", true)
          .eq("category", data.category)
          .neq("id", data.id)
          .limit(3);
        
        setRelatedProjects(related || []);
      }
      setLoading(false);
    }

    fetchProject();
  }, [slug]);

  const allImages = project ? [project.featured_image, ...(project.images || [])].filter(Boolean) as string[] : [];

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "Escape") setLightboxOpen(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  if (loading) {
    return (
      <Layout>
        <section className="py-24 lg:py-32 bg-arifa-warm-white">
          <div className="container-arifa">
            <Skeleton className="h-8 w-32 mb-4" />
            <Skeleton className="h-16 w-3/4 mb-6" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </section>
        <section className="py-16 bg-background">
          <div className="container-arifa">
            <Skeleton className="aspect-[16/9] w-full rounded-sm" />
          </div>
        </section>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <section className="py-24 lg:py-32 bg-arifa-warm-white">
          <div className="container-arifa text-center">
            <h1 className="font-display text-4xl font-light text-foreground mb-6">
              Projeto não encontrado
            </h1>
            <p className="text-muted-foreground mb-8">
              O projeto que procura não existe ou foi removido.
            </p>
            <Button variant="hero" asChild>
              <Link to="/portfolio">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Ver todos os projetos
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={project.title}
        description={project.description || `Projeto ${project.title} - ${project.category} em ${project.location || "Portugal"}`}
        image={project.featured_image || undefined}
        url={`https://arifa.studio/portfolio/${project.slug}`}
        keywords={`${project.category}, arquitetura ${project.location || "Lisboa"}, ${project.title}`}
        type="project"
        projectData={{
          name: project.title,
          description: project.description || `Projeto de ${project.category}`,
          image: project.featured_image || undefined,
          location: project.location || undefined,
          category: project.category
        }}
        breadcrumbs={[
          { name: "Início", url: "https://arifa.studio" },
          { name: "Portfolio", url: "https://arifa.studio/portfolio" },
          { name: project.title, url: `https://arifa.studio/portfolio/${project.slug}` }
        ]}
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao portfolio
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase mb-4">
                {project.category}
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-foreground mb-6">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {project.description}
                </p>
              )}
            </div>

            <div className="bg-card border border-border rounded-sm p-6 lg:p-8 space-y-6">
              <h3 className="font-display text-xl font-medium text-foreground">
                Detalhes do projeto
              </h3>
              
              <div className="grid grid-cols-2 gap-6">
                {project.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-arifa-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Localização</p>
                      <p className="text-foreground font-medium">{project.location}</p>
                    </div>
                  </div>
                )}
                
                {project.area && (
                  <div className="flex items-start gap-3">
                    <Ruler className="h-5 w-5 text-arifa-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Área</p>
                      <p className="text-foreground font-medium">{project.area}</p>
                    </div>
                  </div>
                )}
                
                {project.year && (
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-arifa-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Ano</p>
                      <p className="text-foreground font-medium">{project.year}</p>
                    </div>
                  </div>
                )}
                
                {project.status && (
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-arifa-teal flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Estado</p>
                      <span className={cn(
                        "inline-block px-2 py-1 text-xs font-medium rounded-sm",
                        project.status === "Concluído"
                          ? "bg-arifa-green/10 text-arifa-green"
                          : project.status === "Em construção"
                          ? "bg-arifa-gold/10 text-arifa-gold"
                          : "bg-arifa-teal/10 text-arifa-teal"
                      )}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-border">
                <Button variant="hero" className="w-full" asChild>
                  <Link to="/contacto">
                    Solicitar projeto semelhante
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {allImages.length > 0 && (
        <section className="py-16 lg:py-24 bg-background">
          <div className="container-arifa">
            {/* Main Image */}
            <div 
              className="aspect-[16/9] rounded-sm overflow-hidden mb-4 cursor-pointer relative group"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={allImages[activeImage]}
                alt={`${project.title} - Imagem ${activeImage + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-arifa-charcoal/0 group-hover:bg-arifa-charcoal/20 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary-foreground text-sm font-medium bg-arifa-charcoal/50 px-4 py-2 rounded-sm">
                  Clique para ampliar
                </span>
              </div>
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={cn(
                      "flex-shrink-0 w-24 h-16 rounded-sm overflow-hidden transition-all",
                      activeImage === index
                        ? "ring-2 ring-arifa-teal"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Full Description */}
      {project.full_description && (
        <section className="py-16 lg:py-24 bg-arifa-cream">
          <div className="container-arifa">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-3xl font-light text-foreground mb-8">
                Sobre o projeto
              </h2>
              <div className="prose prose-lg text-muted-foreground">
                {project.full_description.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="py-16 lg:py-24 bg-background">
          <div className="container-arifa">
            <h2 className="font-display text-3xl font-light text-foreground mb-12">
              Projetos relacionados
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map((related) => (
                <Link
                  key={related.id}
                  to={`/portfolio/${related.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/5] rounded-sm overflow-hidden mb-4 relative">
                    <img
                      src={related.featured_image || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-arifa-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium tracking-wider text-arifa-teal uppercase">
                      {related.category}
                    </p>
                    <h3 className="font-display text-xl font-medium text-foreground group-hover:text-arifa-teal transition-colors">
                      {related.title}
                    </h3>
                    {related.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {related.location}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6">
            Gostou deste projeto?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Entre em contacto connosco para discutir como podemos criar algo semelhante para si.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/contacto">
              Fale Connosco
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Advanced Lightbox */}
      <Lightbox
        images={allImages}
        initialIndex={activeImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        title={project.title}
      />
    </Layout>
  );
}
