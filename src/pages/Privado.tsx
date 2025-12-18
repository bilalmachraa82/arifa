import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home, Palette, Ruler } from "lucide-react";
import { SegmentTestimonials } from "@/components/SegmentTestimonials";
import { LeadMagnetSection } from "@/components/LeadMagnetSection";
import { SegmentProjects } from "@/components/SegmentProjects";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

export default function Privado() {
  const { t, language } = useLanguage();
  const isPt = language === "pt";

  const services = [
    { icon: Home, title: t("private.services.1.title"), description: t("private.services.1.description") },
    { icon: Palette, title: t("private.services.2.title"), description: t("private.services.2.description") },
    { icon: Ruler, title: t("private.services.3.title"), description: t("private.services.3.description") },
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
      <section className="relative py-24 lg:py-32 bg-card">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-light tracking-[0.3em] text-arifa-coral uppercase">{t("private.subtitle")}</p>
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-foreground">
                  {t("private.title")} <span className="text-arifa-coral">{t("private.titleHighlight")}</span>
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">{t("private.description")}</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contacto">{t("private.cta")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-elevated">
                <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Projeto residencial ARIFA" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-background">
        <div className="container-arifa">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-light tracking-[0.3em] text-arifa-coral uppercase mb-4">{t("private.services.subtitle")}</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">{t("private.services.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-card border border-border rounded-sm p-8 hover:shadow-card transition-shadow">
                <div className="w-14 h-14 rounded-full bg-arifa-coral/10 flex items-center justify-center mb-6"><service.icon className="h-6 w-6 text-arifa-coral" /></div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-card">
        <div className="container-arifa">
        <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-light tracking-[0.3em] text-arifa-coral uppercase mb-4">{t("private.process.subtitle")}</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground">{t("private.process.title")}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-extrabold text-arifa-coral/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
                {index < process.length - 1 && <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-border -translate-x-1/2" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <SegmentProjects segment="privado" />
      <SegmentTestimonials segment="privado" />
      <LeadMagnetSection segment="privado" />

      <section className="py-24 lg:py-32 bg-foreground text-background">
        <div className="container-arifa text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">{t("private.cta2.title")}</h2>
          <p className="text-lg text-background/70 mb-8">{t("private.cta2.description")}</p>
          <Button variant="coral" size="lg" asChild>
            <Link to="/contacto">{t("private.cta2.button")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
