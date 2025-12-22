import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gem, PenTool, Scaling } from "lucide-react";
import { SegmentTestimonials } from "@/components/SegmentTestimonials";
import { LeadMagnetSection } from "@/components/LeadMagnetSection";
import { SegmentProjects } from "@/components/SegmentProjects";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default function Privado() {
  const { t, language } = useLanguage();
  const isPt = language === "pt";

  const services = [
    { icon: Gem, title: t("private.services.1.title"), description: t("private.services.1.description") },
    { icon: PenTool, title: t("private.services.2.title"), description: t("private.services.2.description") },
    { icon: Scaling, title: t("private.services.3.title"), description: t("private.services.3.description") },
  ];

  const process = [
    { step: "01", title: t("private.process.1.title"), description: t("private.process.1.description") },
    { step: "02", title: t("private.process.2.title"), description: t("private.process.2.description") },
    { step: "03", title: t("private.process.3.title"), description: t("private.process.3.description") },
    { step: "04", title: t("private.process.4.title"), description: t("private.process.4.description") },
  ];

  return (
    <Layout>
      <SEO 
        title={isPt ? "Clientes Privados" : "Private Clients"}
        description={isPt 
          ? "Arquitetura residencial de excelência. Transformamos a sua visão em espaços únicos e personalizados."
          : "Excellence in residential architecture. We transform your vision into unique and personalized spaces."
        }
        url="https://arifa.studio/privado"
        keywords="arquitetura residencial, design interiores casa, projeto residencial, arquitetura privada Lisboa"
        breadcrumbs={[
          { name: isPt ? "Início" : "Home", url: "https://arifa.studio" },
          { name: isPt ? "Clientes Privados" : "Private Clients", url: "https://arifa.studio/privado" }
        ]}
      />
      <section className="relative section-padding-lg bg-card">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 section-gap-lg items-center">
            <AnimatedSection animation="fade-up" className="content-spacing-lg">
              <div className="space-y-6">
                <p className="text-caption text-arifa-coral">{t("private.subtitle")}</p>
                <h1>
                  {t("private.title")} <span className="text-arifa-coral">{t("private.titleHighlight")}</span>
                </h1>
              </div>
              <p className="text-lead max-w-lg">{t("private.description")}</p>
              <div className="cta-group pt-4">
                <Button variant="coral" size="lg" asChild className="cta-highlight">
                  <Link to="/contacto">{t("private.cta")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-left" delay={200} className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-elevated">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Projeto residencial ARIFA" className="w-full h-full object-cover" />
              </div>
              {/* Geometric frame accent */}
              <div className="absolute -top-4 -right-4 w-20 h-20 border-t-2 border-r-2 border-arifa-coral/30 rounded-tr-sm pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-arifa-coral/10 rounded-sm -z-10" />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="section-padding-lg bg-background">
        <div className="container-arifa">
          <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-16 content-spacing">
            <p className="text-caption text-arifa-coral">{t("private.services.subtitle")}</p>
            <h2>{t("private.services.title")}</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <AnimatedSection 
                key={service.title} 
                animation="fade-up" 
                delay={index * 100}
                className="bg-card border border-border rounded-sm p-8 hover:shadow-card transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-full bg-arifa-coral/10 flex items-center justify-center mb-6 transition-transform hover:scale-110">
                  <service.icon className="h-6 w-6 text-arifa-coral" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{service.title}</h3>
                <p className="text-small text-muted-foreground">{service.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding-lg bg-card">
        <div className="container-arifa">
          <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-16 content-spacing">
            <p className="text-caption text-arifa-coral">{t("private.process.subtitle")}</p>
            <h2>{t("private.process.title")}</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <AnimatedSection key={item.step} animation="fade-up" delay={index * 100} className="relative">
                <div className="text-6xl font-extrabold text-arifa-coral/20 mb-4">{item.step}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-small text-muted-foreground">{item.description}</p>
                {index < process.length - 1 && <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border -translate-x-1/2" />}
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <SegmentProjects segment="privado" />
      <SegmentTestimonials segment="privado" />
      <LeadMagnetSection segment="privado" />

      <section className="section-padding-lg bg-foreground text-background">
        <div className="container-arifa text-center max-w-3xl mx-auto content-spacing">
          <h2 className="text-background">{t("private.cta2.title")}</h2>
          <p className="text-lead text-background/70">{t("private.cta2.description")}</p>
          <Button variant="coral" size="lg" asChild className="cta-highlight">
            <Link to="/contacto">{t("private.cta2.button")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
