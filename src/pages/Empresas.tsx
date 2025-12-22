import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Landmark, Store, Coffee, CircleCheck } from "lucide-react";
import { SegmentTestimonials } from "@/components/SegmentTestimonials";
import { LeadMagnetSection } from "@/components/LeadMagnetSection";
import { SegmentProjects } from "@/components/SegmentProjects";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default function Empresas() {
  const { t, language } = useLanguage();
  const isPt = language === "pt";

  const services = [
    { icon: Landmark, title: t("companies.services.1.title"), description: t("companies.services.1.description") },
    { icon: Store, title: t("companies.services.2.title"), description: t("companies.services.2.description") },
    { icon: Coffee, title: t("companies.services.3.title"), description: t("companies.services.3.description") },
  ];

  const benefits = [
    t("companies.benefits.1"), t("companies.benefits.2"), t("companies.benefits.3"),
    t("companies.benefits.4"), t("companies.benefits.5"), t("companies.benefits.6"),
  ];

  return (
    <Layout>
      <SEO 
        title={isPt ? "Empresas" : "Companies"}
        description={isPt 
          ? "Arquitetura corporativa que transforma espaços de trabalho. Escritórios, retalho e hotelaria com design inovador."
          : "Corporate architecture that transforms workspaces. Offices, retail and hospitality with innovative design."
        }
        url="https://arifa.studio/empresas"
        keywords="arquitetura corporativa, design escritórios, arquitetura comercial, espaços de trabalho Lisboa"
        breadcrumbs={[
          { name: isPt ? "Início" : "Home", url: "https://arifa.studio" },
          { name: isPt ? "Empresas" : "Companies", url: "https://arifa.studio/empresas" }
        ]}
      />
      <section className="relative section-padding-lg bg-background">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 section-gap-lg items-center">
            <AnimatedSection animation="fade-up" className="content-spacing-lg">
              <div className="space-y-6">
                <p className="text-caption text-arifa-yellow">{t("companies.subtitle")}</p>
                <h1>
                  {t("companies.title")} <span className="text-arifa-yellow">{t("companies.titleHighlight")}</span> {t("companies.titleEnd")}
                </h1>
              </div>
              <p className="text-lead max-w-lg">{t("companies.description")}</p>
              <div className="cta-group pt-4">
                <Button variant="yellow" size="lg" asChild className="cta-highlight">
                  <Link to="/contacto">{t("companies.cta")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-left" delay={200} className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-elevated">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Projeto corporativo ARIFA" className="w-full h-full object-cover" />
              </div>
              {/* Geometric frame accent */}
              <div className="absolute -top-4 -right-4 w-20 h-20 border-t-2 border-r-2 border-arifa-yellow/30 rounded-tr-sm pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-arifa-yellow/10 rounded-sm -z-10" />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="section-padding-lg bg-card">
        <div className="container-arifa">
          <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-16 content-spacing">
            <p className="text-caption text-arifa-yellow">{t("companies.services.subtitle")}</p>
            <h2>{t("companies.services.title")}</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection 
                key={service.title} 
                animation="fade-up" 
                delay={index * 100}
                className="bg-background border border-border rounded-sm p-8 hover:shadow-card transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-full bg-arifa-yellow/10 flex items-center justify-center mb-6 transition-transform hover:scale-110">
                  <service.icon className="h-6 w-6 text-arifa-yellow" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{service.title}</h3>
                <p className="text-small text-muted-foreground">{service.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding-lg bg-secondary">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 section-gap-lg items-center">
            <AnimatedSection animation="fade-right">
              <div className="aspect-square rounded-sm overflow-hidden shadow-card">
                <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Ambiente de trabalho moderno" className="w-full h-full object-cover" />
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-left" delay={200} className="content-spacing-lg">
              <div className="space-y-4">
                <p className="text-caption text-arifa-yellow">{t("companies.benefits.subtitle")}</p>
                <h2>{t("companies.benefits.title")}</h2>
              </div>
              <p className="text-lead">{t("companies.benefits.description")}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <li key={benefit} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CircleCheck className="h-5 w-5 text-arifa-yellow flex-shrink-0" />
                    <span className="text-small text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <SegmentProjects segment="empresas" />
      <SegmentTestimonials segment="empresas" />
      <LeadMagnetSection segment="empresas" />

      <section className="section-padding-lg bg-foreground text-background">
        <div className="container-arifa text-center max-w-3xl mx-auto content-spacing">
          <h2 className="text-background">{t("companies.cta2.title")}</h2>
          <p className="text-lead text-background/70">{t("companies.cta2.description")}</p>
          <Button variant="yellow" size="lg" asChild className="cta-highlight">
            <Link to="/contacto">{t("companies.cta2.button")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
