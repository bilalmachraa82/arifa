import { Link } from "react-router-dom";
import { ArrowRight, Home, Building2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function SegmentSelector() {
  const { t } = useLanguage();
  
  const segments = [
    {
      id: "privado",
      icon: Home,
      title: t("segments.private.title"),
      description: t("segments.private.description"),
      features: [
        t("segments.private.feature1"),
        t("segments.private.feature2"),
        t("segments.private.feature3"),
      ],
      href: "/privado",
      colorClass: "bg-accent/10 text-accent",
      bulletClass: "bg-accent",
      hoverClass: "bg-accent",
    },
    {
      id: "empresas",
      icon: Building2,
      title: t("segments.companies.title"),
      description: t("segments.companies.description"),
      features: [
        t("segments.companies.feature1"),
        t("segments.companies.feature2"),
        t("segments.companies.feature3"),
      ],
      href: "/empresas",
      colorClass: "bg-arifa-coral/10 text-arifa-coral",
      bulletClass: "bg-arifa-coral",
      hoverClass: "bg-arifa-coral",
    },
    {
      id: "investidores",
      icon: TrendingUp,
      title: t("segments.investors.title"),
      description: t("segments.investors.description"),
      features: [
        t("segments.investors.feature1"),
        t("segments.investors.feature2"),
        t("segments.investors.feature3"),
      ],
      href: "/investidores",
      colorClass: "bg-arifa-yellow/10 text-arifa-yellow",
      bulletClass: "bg-arifa-yellow",
      hoverClass: "bg-arifa-yellow",
    },
  ];

  return (
    <section className="py-24 lg:py-32 bg-background" id="segmentos">
      <div className="container-arifa">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium tracking-[0.3em] text-accent uppercase mb-4">
            {t("segments.subtitle")}
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6">
            {t("segments.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("segments.description")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {segments.map((segment, index) => (
            <Link
              key={segment.id}
              to={segment.href}
              className="group relative bg-card border border-border rounded-sm p-8 lg:p-10 transition-all duration-500 hover:shadow-elevated hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${segment.colorClass} mb-6 transition-transform duration-300 group-hover:scale-110`}>
                <segment.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {segment.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {segment.description}
              </p>

              <ul className="space-y-2 mb-8">
                {segment.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-muted-foreground">
                    <span className={`w-1.5 h-1.5 rounded-full ${segment.bulletClass} mr-3`} />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex items-center text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                {t("segments.learnMore")}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>

              {/* Hover accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 ${segment.hoverClass} scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
