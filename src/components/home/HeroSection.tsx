import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, Clock, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t, language } = useLanguage();
  const isPt = language === "pt";
  
  // Brand Book: Métricas inline com dados concretos
  const metrics = [
    { 
      icon: Award, 
      label: "BIM Level 2", 
      color: "text-arifa-blue" 
    },
    { 
      icon: Clock, 
      label: isPt ? "95% No Prazo" : "95% On-Time", 
      color: "text-arifa-coral" 
    },
    { 
      icon: TrendingUp, 
      label: isPt ? "Certificação A+" : "A+ Certified", 
      color: "text-arifa-yellow" 
    },
  ];
  
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay - Brand Book aesthetic */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
      </div>

      {/* Geometric elements - Brand Book pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-0 w-96 h-96 border border-border/20 rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-40 right-40 w-64 h-64 border border-accent/10 rounded-full" />
      </div>

      <div className="container-arifa relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-light tracking-[0.3em] text-accent uppercase animate-fade-in">
                {t("hero.tagline")}
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] text-foreground animate-fade-in animation-delay-100">
                {isPt ? "Arquitectura que" : "Architecture that"}{" "}
                <span className="text-accent">{isPt ? "transforma." : "transforms."}</span>
                <br />
                <span className="text-arifa-coral">{isPt ? "Tecnologia" : "Technology"}</span>{" "}
                {isPt ? "que entrega." : "that delivers."}
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed animate-fade-in animation-delay-200 font-light">
              {isPt 
                ? "20 anos de experiência internacional. BIM Level 2 certified. Entrega no prazo em 95% dos projectos."
                : "20 years of international experience. BIM Level 2 certified. On-time delivery in 95% of projects."
              }
            </p>

            {/* Inline Metrics - Brand Book */}
            <div className="flex flex-wrap gap-6 animate-fade-in animation-delay-300">
              {metrics.map((metric, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 text-sm"
                >
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="font-light text-foreground">{metric.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-400">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contacto">
                  {isPt ? "Iniciar o Meu Projecto" : "Start My Project"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/portfolio">{t("hero.viewPortfolio")}</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Feature card */}
          <div className="relative animate-fade-in animation-delay-500 hidden lg:block">
            <div className="absolute -bottom-8 -left-8 bg-card p-8 shadow-elevated rounded-sm max-w-sm border border-border/50">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-display text-3xl font-extrabold text-foreground">20+</p>
                  <p className="text-sm text-muted-foreground font-light">{t("hero.experience")}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">
                {isPt 
                  ? "Projectos em 4 países. +50 clientes satisfeitos."
                  : "Projects in 4 countries. +50 satisfied clients."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
