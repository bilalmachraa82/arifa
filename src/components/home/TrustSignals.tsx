import { Award, Clock, TrendingUp, Leaf, Building, GraduationCap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function TrustSignals() {
  const { language } = useLanguage();
  const isPt = language === "pt";

  const stats = [
    {
      value: "20+",
      label: isPt ? "Anos de Experiência" : "Years of Experience",
      color: "text-foreground",
    },
    {
      value: "95%",
      label: isPt ? "Entrega no Prazo" : "On-Time Delivery",
      color: "text-arifa-coral",
    },
    {
      value: "22%",
      label: isPt ? "ROI Médio" : "Average ROI",
      color: "text-arifa-yellow",
    },
    {
      value: "A+",
      label: isPt ? "Certificação Energética" : "Energy Rating",
      color: "text-arifa-blue",
    },
  ];

  const certifications = [
    {
      icon: Building,
      label: "BIM Level 2 Certified",
      color: "text-arifa-blue",
    },
    {
      icon: GraduationCap,
      label: isPt ? "Ordem dos Arquitectos" : "Architects Order",
      color: "text-foreground",
    },
    {
      icon: Leaf,
      label: "LEED Accredited",
      color: "text-arifa-coral",
    },
  ];

  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container-arifa">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="text-center mb-12">
          <p className="text-sm font-light tracking-[0.3em] text-accent uppercase mb-2">
            {isPt ? "Confiança Comprovada" : "Proven Trust"}
          </p>
          <p className="text-muted-foreground font-light">
            {isPt 
              ? "Projectos em 4 países. +50 clientes satisfeitos."
              : "Projects in 4 countries. +50 satisfied clients."
            }
          </p>
        </AnimatedSection>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {stats.map((stat, index) => (
            <AnimatedSection 
              key={index} 
              animation="fade-up"
              delay={index * 100}
              className="text-center"
            >
              <p className={`text-4xl md:text-5xl font-extrabold ${stat.color} transition-transform duration-300 hover:scale-105`}>
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-2 font-light">
                {stat.label}
              </p>
            </AnimatedSection>
          ))}
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-border">
          {certifications.map((cert, index) => (
            <AnimatedSection 
              key={index}
              animation="fade-up"
              delay={(index + 4) * 100}
              className="flex items-center gap-3 group cursor-default"
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <cert.icon className={`h-5 w-5 ${cert.color}`} />
              </div>
              <span className="text-sm font-light text-foreground">{cert.label}</span>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
