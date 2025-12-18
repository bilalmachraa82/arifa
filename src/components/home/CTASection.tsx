import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function CTASection() {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 lg:py-32 bg-card">
      <div className="container-arifa">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <AnimatedSection animation="fade-up" className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium tracking-[0.3em] text-accent uppercase">
                {t("cta.subtitle")}
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                {t("cta.title")}
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {t("cta.description")}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t("cta.freeConsultation")}</p>
                  <p className="text-sm text-muted-foreground">{t("cta.freeConsultationDesc")}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t("cta.response24h")}</p>
                  <p className="text-sm text-muted-foreground">{t("cta.response24hDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{t("cta.detailedQuote")}</p>
                  <p className="text-sm text-muted-foreground">{t("cta.detailedQuoteDesc")}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="hero" size="lg" asChild className="group">
                <Link to="/contacto">
                  {t("cta.requestQuote")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild className="group">
                <a href="tel:+351928272198">
                  <Phone className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  +351 928 272 198
                </a>
              </Button>
            </div>
          </AnimatedSection>

          <AnimatedSection animation="fade-left" delay={300} className="relative">
            <div className="aspect-square rounded-sm overflow-hidden shadow-elevated">
              <img
                src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt={t("cta.imageAlt")}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-accent/30 rounded-sm" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-sm -z-10" />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
