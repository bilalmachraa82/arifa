import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function AboutSection() {
  const { t } = useLanguage();
  
  const stats = [
    { value: "20+", label: t("about.stat1") },
    { value: "4", label: t("about.stat2") },
    { value: "BIM", label: t("about.stat3") },
    { value: "2022", label: t("about.stat4") },
  ];

  return (
    <section className="py-24 lg:py-32 bg-card" id="sobre">
      <div className="container-arifa">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] bg-secondary rounded-sm overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Interior design ARIFA"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-square bg-accent rounded-sm flex items-center justify-center p-6">
                  <p className="text-3xl text-accent-foreground text-center font-light">
                    "{t("about.quote")}"
                  </p>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square bg-secondary rounded-sm overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Arquitetura moderna ARIFA"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-[3/4] bg-secondary rounded-sm overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Projeto residencial ARIFA"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium tracking-[0.3em] text-accent uppercase">
                {t("about.subtitle")}
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                {t("about.title")}{" "}
                <span className="font-normal">{t("about.titleHighlight")}</span>
              </h2>
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>{t("about.description1")}</p>
              <p>{t("about.description2")}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-border">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl md:text-4xl font-medium text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" size="lg" asChild>
              <Link to="/portfolio">{t("about.explorePortfolio")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
