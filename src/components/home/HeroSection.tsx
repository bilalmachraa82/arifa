import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HeroSection() {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-arifa-warm-white">
      {/* Background geometric elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-0 w-1/2 h-full bg-secondary/50 transform skew-x-12" />
        <div className="absolute bottom-0 left-0 w-96 h-96 border border-border/30 rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-40 right-40 w-64 h-64 border border-arifa-teal/20 rounded-full" />
      </div>

      <div className="container-arifa relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase animate-fade-in">
                {t("hero.tagline")}
              </p>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] text-foreground animate-fade-in animation-delay-100">
                {t("hero.title")}{" "}
                <span className="italic text-arifa-teal">{t("hero.titleHighlight")}</span>
              </h1>
            </div>
            
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed animate-fade-in animation-delay-200">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap gap-4 animate-fade-in animation-delay-300">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contacto">
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/portfolio">{t("hero.viewPortfolio")}</Link>
              </Button>
            </div>
          </div>

          <div className="relative animate-fade-in animation-delay-400">
            <div className="aspect-[4/5] bg-secondary rounded-sm overflow-hidden shadow-elevated">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt={t("hero.imageAlt")}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-card p-6 shadow-card rounded-sm max-w-xs">
              <p className="font-display text-2xl font-medium text-foreground">20+</p>
              <p className="text-sm text-muted-foreground">{t("hero.experience")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
