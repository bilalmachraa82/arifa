import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export function CTASection() {
  const { t } = useLanguage();
  
  return (
    <section className="section-padding-lg bg-card">
      <div className="container-arifa">
        <div className="grid lg:grid-cols-2 section-gap-lg items-center">
          <AnimatedSection animation="fade-up" className="content-spacing-lg">
            <div className="space-y-6">
              <p className="text-caption text-accent">
                {t("cta.subtitle")}
              </p>
              <h2>
                {t("cta.title")}
              </h2>
            </div>

            <p className="text-lead">
              {t("cta.description")}
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{t("cta.freeConsultation")}</p>
                  <p className="text-small text-muted-foreground">{t("cta.freeConsultationDesc")}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-arifa-coral/10 flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110">
                  <Clock className="h-5 w-5 text-arifa-coral" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{t("cta.response24h")}</p>
                  <p className="text-small text-muted-foreground">{t("cta.response24hDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-full bg-arifa-yellow/10 flex items-center justify-center flex-shrink-0 transition-transform hover:scale-110">
                  <Mail className="h-5 w-5 text-arifa-yellow" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{t("cta.detailedQuote")}</p>
                  <p className="text-small text-muted-foreground">{t("cta.detailedQuoteDesc")}</p>
                </div>
              </div>
            </div>

            <div className="cta-group pt-6">
              <Button variant="hero" size="lg" asChild className="group cta-highlight">
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
