import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, FileSearch, Building } from "lucide-react";
import { SegmentTestimonials } from "@/components/SegmentTestimonials";
import { LeadMagnetSection } from "@/components/LeadMagnetSection";
import { SegmentProjects } from "@/components/SegmentProjects";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

export default function Investidores() {
  const { t, language } = useLanguage();
  const isPt = language === "pt";

  const services = [
    { icon: FileSearch, title: t("investors.services.1.title"), description: t("investors.services.1.description") },
    { icon: Building, title: t("investors.services.2.title"), description: t("investors.services.2.description") },
    { icon: TrendingUp, title: t("investors.services.3.title"), description: t("investors.services.3.description") },
  ];

  const metrics = [
    { value: t("investors.metrics.1.value"), label: t("investors.metrics.1.label") },
    { value: t("investors.metrics.2.value"), label: t("investors.metrics.2.label") },
    { value: t("investors.metrics.3.value"), label: t("investors.metrics.3.label") },
    { value: t("investors.metrics.4.value"), label: t("investors.metrics.4.label") },
  ];

  const process = [
    { step: t("investors.process.1.step"), title: t("investors.process.1.title"), description: t("investors.process.1.description") },
    { step: t("investors.process.2.step"), title: t("investors.process.2.title"), description: t("investors.process.2.description") },
    { step: t("investors.process.3.step"), title: t("investors.process.3.title"), description: t("investors.process.3.description") },
    { step: t("investors.process.4.step"), title: t("investors.process.4.title"), description: t("investors.process.4.description") },
  ];

  return (
    <Layout>
      <SEO 
        title={isPt ? "Investidores" : "Investors"}
        description={isPt 
          ? "Soluções de arquitetura para investidores imobiliários. Maximizamos o retorno do seu investimento com projetos de excelência."
          : "Architecture solutions for real estate investors. We maximize your investment return with excellent projects."
        }
        url="https://arifa.studio/investidores"
        keywords="investimento imobiliário, arquitetura investidores, promoção imobiliária, desenvolvimento imobiliário Lisboa"
        breadcrumbs={[
          { name: isPt ? "Início" : "Home", url: "https://arifa.studio" },
          { name: isPt ? "Investidores" : "Investors", url: "https://arifa.studio/investidores" }
        ]}
      />
      <section className="relative py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium tracking-[0.3em] text-arifa-gold uppercase">{t("investors.subtitle")}</p>
                <h1 className="font-display text-5xl md:text-6xl font-light leading-tight text-foreground">
                  {t("investors.title")} <span className="italic text-arifa-gold">{t("investors.titleHighlight")}</span> {t("investors.titleEnd")}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">{t("investors.description")}</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/contacto">{t("investors.cta")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-elevated">
                <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Edifício de investimento" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-arifa-charcoal text-primary-foreground">
        <div className="container-arifa">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="font-display text-4xl md:text-5xl font-light text-arifa-gold">{metric.value}</p>
                <p className="text-sm text-primary-foreground/70 mt-2">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-background">
        <div className="container-arifa">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-gold uppercase mb-4">{t("investors.services.subtitle")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">{t("investors.services.title")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="bg-card border border-border rounded-sm p-8 hover:shadow-card transition-shadow">
                <div className="w-14 h-14 rounded-full bg-arifa-gold/10 flex items-center justify-center mb-6"><service.icon className="h-6 w-6 text-arifa-gold" /></div>
                <h3 className="font-display text-2xl font-medium text-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-arifa-cream">
        <div className="container-arifa">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-gold uppercase mb-4">{t("investors.process.subtitle")}</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground">{t("investors.process.title")}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item) => (
              <div key={item.step} className="relative">
                <div className="text-6xl font-display font-light text-arifa-gold/20 mb-4">{item.step}</div>
                <h3 className="font-display text-xl font-medium text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-background">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-sm font-medium tracking-[0.3em] text-arifa-gold uppercase">{t("investors.caseStudy.subtitle")}</p>
                <h2 className="font-display text-4xl font-light text-foreground">{t("investors.caseStudy.title")}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">{t("investors.caseStudy.description")}</p>
              <div className="grid grid-cols-2 gap-6 py-6 border-y border-border">
                <div><p className="font-display text-2xl font-medium text-foreground">€2.8M</p><p className="text-sm text-muted-foreground">{t("investors.caseStudy.investment")}</p></div>
                <div><p className="font-display text-2xl font-medium text-foreground">22%</p><p className="text-sm text-muted-foreground">{t("investors.caseStudy.roi")}</p></div>
                <div><p className="font-display text-2xl font-medium text-foreground">1.850 m²</p><p className="text-sm text-muted-foreground">{t("investors.caseStudy.area")}</p></div>
                <div><p className="font-display text-2xl font-medium text-foreground">18 meses</p><p className="text-sm text-muted-foreground">{t("investors.caseStudy.timeline")}</p></div>
              </div>
              <Button variant="outline" asChild><Link to="/portfolio">{t("investors.caseStudy.viewMore")}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-elevated">
                <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Empreendimento Tejo View" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SegmentProjects segment="investidores" />
      <SegmentTestimonials segment="investidores" />
      <LeadMagnetSection segment="investidores" />

      <section className="py-24 lg:py-32 bg-arifa-charcoal text-primary-foreground">
        <div className="container-arifa text-center max-w-3xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl font-light mb-6">{t("investors.cta2.title")}</h2>
          <p className="text-lg text-primary-foreground/70 mb-8">{t("investors.cta2.description")}</p>
          <Button variant="accent" size="lg" asChild>
            <Link to="/contacto">{t("investors.cta2.button")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
