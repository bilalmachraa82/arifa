import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SearchFilters } from "@/components/SearchFilters";
import { SEO } from "@/components/SEO";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogHeroSkeleton, BlogGridSkeleton } from "@/components/blog/BlogSkeleton";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  featured_image: string | null;
  read_time: string | null;
  published_at: string | null;
  is_featured: boolean | null;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { toast } = useToast();

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, category, featured_image, read_time, published_at, is_featured")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }

    fetchPosts();
  }, []);

  // Fetch categories from database
  const [dbCategories, setDbCategories] = useState<string[]>([]);
  
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from("blog_categories")
        .select("name")
        .order("name");
      
      if (data) {
        setDbCategories(data.map(c => c.name));
      }
    }
    fetchCategories();
  }, []);

  const categories = useMemo(() => ["Todos", ...dbCategories], [dbCategories]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = activeCategory === "Todos" || post.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, activeCategory]);

  const featuredPost = filteredPosts.find(p => p.is_featured) || filteredPosts[0];
  const otherPosts = filteredPosts.filter(p => p.id !== featuredPost?.id);
  const sidebarPosts = otherPosts.slice(0, 4);
  const gridPosts = otherPosts.slice(4);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubscribing(true);
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: email.trim() });

    if (error) {
      if (error.code === "23505") {
        toast({
          title: "Email já registado",
          description: "Este email já está subscrito na nossa newsletter.",
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível subscrever. Tente novamente.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Subscrito com sucesso!",
        description: "Vai receber as nossas novidades no seu email.",
      });
      setEmail("");
    }
    setSubscribing(false);
  };

  return (
    <Layout>
      <SEO 
        title="Blog"
        description="Artigos, guias e dicas sobre arquitetura, design de interiores e investimento imobiliário. Inspiração para o seu próximo projeto."
        url="https://arifa.studio/blog"
        keywords="blog arquitetura, dicas design interiores, tendências arquitetura, investimento imobiliário"
        breadcrumbs={[
          { name: "Início", url: "https://arifa.studio" },
          { name: "Blog", url: "https://arifa.studio/blog" }
        ]}
      />
      
      {/* Hero Section */}
      <section className="section-padding-lg bg-card">
        <div className="container-arifa">
          <AnimatedSection animation="fade-up">
            <div className="max-w-4xl">
              <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">
                Blog & Insights
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-none text-foreground mb-6">
                Ideias e<br />
                <span className="text-gradient">Inspiração</span>
              </h1>
              <p className="text-lead text-muted-foreground max-w-2xl">
                Artigos, guias e dicas sobre arquitetura, design e investimento imobiliário.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-background border-b border-border sticky top-[73px] z-40">
        <div className="container-arifa">
          <SearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            placeholder="Pesquisar artigos..."
          />
        </div>
      </section>

      {loading ? (
        <section className="section-padding bg-background">
          <div className="container-arifa space-y-16">
            <BlogHeroSkeleton />
            <div className="pt-8 border-t border-border">
              <div className="h-8 w-48 bg-muted rounded mb-8 animate-pulse" />
              <BlogGridSkeleton />
            </div>
          </div>
        </section>
      ) : filteredPosts.length === 0 ? (
        <section className="section-padding bg-background">
          <div className="container-arifa text-center py-24">
            <AnimatedSection animation="fade-up">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  {searchQuery || activeCategory !== "Todos"
                    ? "Nenhum artigo encontrado com os filtros selecionados."
                    : "Ainda não há artigos publicados. Volte em breve!"
                  }
                </p>
                {(searchQuery || activeCategory !== "Todos") && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("Todos");
                    }}
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
      ) : (
        <>
          {/* Results count */}
          <section className="pt-8 pb-0 bg-background">
            <div className="container-arifa">
              <p className="text-small text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? "artigo encontrado" : "artigos encontrados"}
              </p>
            </div>
          </section>

          {/* Magazine Layout: Featured + Sidebar */}
          <section className="section-padding bg-background">
            <div className="container-arifa">
              <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
                {/* Featured Post - Takes 2 columns */}
                <div className="lg:col-span-2">
                  {featuredPost && <BlogCard post={featuredPost} variant="featured" />}
                </div>

                {/* Sidebar - Recent posts */}
                <div className="lg:col-span-1">
                  <AnimatedSection animation="fade-up" delay={0.2}>
                    <div className="sticky top-32">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 pb-4 border-b border-border">
                        Artigos Recentes
                      </h3>
                      <div className="space-y-2">
                        {sidebarPosts.map((post, i) => (
                          <BlogCard key={post.id} post={post} index={i} variant="compact" />
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                </div>
              </div>
            </div>
          </section>

          {/* Grid Posts */}
          {gridPosts.length > 0 && (
            <section className="section-padding bg-card">
              <div className="container-arifa">
                <AnimatedSection animation="fade-up">
                  <h2 className="h2 text-foreground mb-12">
                    Mais Artigos
                  </h2>
                </AnimatedSection>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {gridPosts.map((post, i) => (
                    <BlogCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter */}
      <section className="section-padding-lg bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--accent)/0.15),transparent_50%)]" />
        <div className="container-arifa relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">
                Newsletter
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Receba as nossas novidades
              </h2>
              <p className="text-lg text-background/70 mb-10">
                Subscreva a newsletter e receba guias exclusivos, tendências e dicas de arquitetura diretamente no seu email.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="O seu email"
                  required
                  className="flex-1 h-14 px-5 rounded-sm bg-background/10 border border-background/20 text-background placeholder:text-background/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
                <Button variant="accent" size="lg" type="submit" disabled={subscribing} className="h-14 px-8">
                  {subscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <>
                      Subscrever
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
}
