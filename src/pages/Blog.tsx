import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SearchFilters } from "@/components/SearchFilters";
import { SEO } from "@/components/SEO";

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

  // Extract unique categories
  const categories = useMemo(() => {
    const postCategories = [...new Set(posts.map(p => p.category).filter(Boolean))] as string[];
    return ["Todos", ...postCategories.sort()];
  }, [posts]);

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

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
      />
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase mb-4">
              Blog
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight text-foreground mb-6">
              Ideias e inspiração
            </h1>
            <p className="text-lg text-muted-foreground">
              Artigos, guias e dicas sobre arquitetura, design e investimento imobiliário.
            </p>
          </div>
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
        <section className="py-24 bg-background">
          <div className="container-arifa flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-arifa-teal" />
          </div>
        </section>
      ) : filteredPosts.length === 0 ? (
        <section className="py-24 bg-background">
          <div className="container-arifa text-center">
            <p className="text-lg text-muted-foreground mb-4">
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
        </section>
      ) : (
        <>
          {/* Results count */}
          <section className="pt-8 pb-0 bg-background">
            <div className="container-arifa">
              <p className="text-sm text-muted-foreground">
                {filteredPosts.length} {filteredPosts.length === 1 ? "artigo encontrado" : "artigos encontrados"}
              </p>
            </div>
          </section>

          {/* Featured Post */}
          {featuredPost && (
            <section className="py-16 lg:py-24 bg-background">
              <div className="container-arifa">
                <Link to={`/blog/${featuredPost.slug}`} className="group block">
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="aspect-[16/10] rounded-sm overflow-hidden">
                      <img
                        src={featuredPost.featured_image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {featuredPost.category && (
                          <span className="px-3 py-1 bg-arifa-teal/10 text-arifa-teal rounded-sm text-xs font-medium">
                            {featuredPost.category}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(featuredPost.published_at)}
                        </span>
                        {featuredPost.read_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {featuredPost.read_time}
                          </span>
                        )}
                      </div>
                      <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground group-hover:text-arifa-teal transition-colors">
                        {featuredPost.title}
                      </h2>
                      {featuredPost.excerpt && (
                        <p className="text-muted-foreground leading-relaxed">
                          {featuredPost.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        Ler artigo
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </section>
          )}

          {/* Posts Grid */}
          {otherPosts.length > 0 && (
            <section className="py-16 lg:py-24 bg-arifa-cream">
              <div className="container-arifa">
                <h2 className="font-display text-3xl font-light text-foreground mb-12">
                  Artigos recentes
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="group bg-card rounded-sm overflow-hidden shadow-soft hover:shadow-card transition-shadow"
                    >
                      <div className="aspect-[16/10] overflow-hidden">
                        <img
                          src={post.featured_image || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {post.category && (
                            <span className="px-2 py-1 bg-arifa-teal/10 text-arifa-teal rounded-sm font-medium">
                              {post.category}
                            </span>
                          )}
                          {post.read_time && <span>{post.read_time}</span>}
                        </div>
                        <h3 className="font-display text-xl font-medium text-foreground group-hover:text-arifa-teal transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="text-xs text-muted-foreground">{formatDate(post.published_at)}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-arifa-teal transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* Newsletter */}
      <section className="py-24 lg:py-32 bg-arifa-charcoal text-primary-foreground">
        <div className="container-arifa text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light mb-6">
            Receba as nossas novidades
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8">
            Subscreva a newsletter e receba guias exclusivos, tendências e dicas de arquitetura diretamente no seu email.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="O seu email"
              required
              className="flex-1 h-12 px-4 rounded-sm bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-arifa-teal"
            />
            <Button variant="accent" size="lg" type="submit" disabled={subscribing}>
              {subscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscrever"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}