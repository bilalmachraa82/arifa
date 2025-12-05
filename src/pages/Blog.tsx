import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

const featuredPost = {
  id: 1,
  title: "Guia Completo: Como Planear a Construção da Sua Casa de Raiz",
  excerpt: "Desde a escolha do terreno até à entrega das chaves, descubra tudo o que precisa saber para construir a casa dos seus sonhos sem surpresas.",
  category: "Guias",
  author: "ARIFA Studio",
  date: "15 Nov 2024",
  readTime: "12 min",
  image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
};

const posts = [
  {
    id: 2,
    title: "Tendências de Arquitetura Sustentável em 2024",
    excerpt: "Materiais eco-friendly, eficiência energética e design biofílico: as tendências que estão a moldar o futuro da construção.",
    category: "Tendências",
    author: "ARIFA Studio",
    date: "10 Nov 2024",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Reabilitação Urbana: Benefícios Fiscais em Portugal",
    excerpt: "Conheça os incentivos fiscais disponíveis para investidores em zonas ARU e como maximizar o retorno do seu investimento.",
    category: "Investimento",
    author: "ARIFA Studio",
    date: "5 Nov 2024",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Como Escolher o Arquiteto Certo para o Seu Projeto",
    excerpt: "Dicas essenciais para encontrar o profissional ideal que vai transformar a sua visão em realidade.",
    category: "Dicas",
    author: "ARIFA Studio",
    date: "28 Out 2024",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "O Impacto do Design de Escritórios na Produtividade",
    excerpt: "Estudos recentes demonstram como o ambiente de trabalho influencia diretamente o desempenho das equipas.",
    category: "Corporativo",
    author: "ARIFA Studio",
    date: "20 Out 2024",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Licenciamento de Obras: O Guia Essencial",
    excerpt: "Tudo sobre o processo de licenciamento em Portugal: prazos, custos e documentação necessária.",
    category: "Guias",
    author: "ARIFA Studio",
    date: "15 Out 2024",
    readTime: "10 min",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

export default function Blog() {
  return (
    <Layout>
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

      {/* Featured Post */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-arifa">
          <Link to={`/blog/${featuredPost.id}`} className="group block">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="aspect-[16/10] rounded-sm overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="px-3 py-1 bg-arifa-teal/10 text-arifa-teal rounded-sm text-xs font-medium">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-medium text-foreground group-hover:text-arifa-teal transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  Ler artigo
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 lg:py-24 bg-arifa-cream">
        <div className="container-arifa">
          <h2 className="font-display text-3xl font-light text-foreground mb-12">
            Artigos recentes
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group bg-card rounded-sm overflow-hidden shadow-soft hover:shadow-card transition-shadow"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-arifa-teal/10 text-arifa-teal rounded-sm font-medium">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-display text-xl font-medium text-foreground group-hover:text-arifa-teal transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-arifa-teal transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Carregar mais artigos
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 lg:py-32 bg-arifa-charcoal text-primary-foreground">
        <div className="container-arifa text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light mb-6">
            Receba as nossas novidades
          </h2>
          <p className="text-lg text-primary-foreground/70 mb-8">
            Subscreva a newsletter e receba guias exclusivos, tendências e dicas de arquitetura diretamente no seu email.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="O seu email"
              className="flex-1 h-12 px-4 rounded-sm bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-arifa-teal"
            />
            <Button variant="accent" size="lg">
              Subscrever
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
