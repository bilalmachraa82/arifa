import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    category: string | null;
    featured_image: string | null;
    read_time: string | null;
    published_at: string | null;
  };
  index?: number;
  variant?: "default" | "featured" | "compact";
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

export function BlogCard({ post, index = 0, variant = "default" }: BlogCardProps) {
  if (variant === "featured") {
    return (
      <AnimatedSection animation="fade-up" delay={0.1}>
        <Link to={`/blog/${post.slug}`} className="group block">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="aspect-[16/10] rounded-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={post.featured_image || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {post.category && (
                <span className="absolute top-4 left-4 z-20 px-4 py-2 bg-accent text-accent-foreground rounded-sm text-xs font-semibold uppercase tracking-wider">
                  {post.category}
                </span>
              )}
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.published_at)}
                </span>
                {post.read_time && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {post.read_time}
                  </span>
                )}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 leading-tight">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              )}
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-accent group-hover:gap-4 transition-all duration-300">
                Ler artigo completo
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>
      </AnimatedSection>
    );
  }

  if (variant === "compact") {
    return (
      <AnimatedSection animation="fade-up" delay={0.1 + index * 0.05}>
        <Link
          to={`/blog/${post.slug}`}
          className="group flex gap-4 items-start p-4 rounded-sm hover:bg-card transition-colors duration-300"
        >
          <div className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0">
            <img
              src={post.featured_image || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">{formatDate(post.published_at)}</p>
            <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
              {post.title}
            </h4>
          </div>
        </Link>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection animation="fade-up" delay={0.1 + index * 0.1}>
      <Link
        to={`/blog/${post.slug}`}
        className="group bg-card rounded-sm overflow-hidden shadow-soft hover:shadow-card transition-all duration-500 block h-full"
      >
        <div className="aspect-[16/10] overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <img
            src={post.featured_image || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {post.category && (
            <span className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-background/90 backdrop-blur-sm text-foreground rounded-sm text-xs font-medium">
              {post.category}
            </span>
          )}
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(post.published_at)}
            </span>
            {post.read_time && (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {post.read_time}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-accent transition-colors duration-300 line-clamp-2 leading-snug">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-2 text-sm font-medium text-accent pt-2">
            <span className="group-hover:underline">Ler mais</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </AnimatedSection>
  );
}
