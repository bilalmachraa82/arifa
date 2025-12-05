import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, Calendar } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-arifa-warm-white">
      <div className="container-arifa">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase">
                Comece hoje
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-foreground leading-tight">
                Pronto para dar vida ao seu projeto?
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Seja uma casa de sonho, um espaço corporativo inovador ou um investimento imobiliário 
              estratégico — estamos aqui para transformar a sua visão em realidade.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-arifa-teal/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-5 w-5 text-arifa-teal" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Consulta gratuita</p>
                  <p className="text-sm text-muted-foreground">Primeira reunião sem compromisso para conhecer o seu projeto</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-arifa-teal/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-arifa-teal" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Resposta em 24h</p>
                  <p className="text-sm text-muted-foreground">Garantimos uma resposta rápida a todos os pedidos</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-arifa-teal/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-arifa-teal" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Orçamento detalhado</p>
                  <p className="text-sm text-muted-foreground">Proposta clara e transparente sem surpresas</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contacto">
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <a href="tel:+351210000000">
                  <Phone className="mr-2 h-4 w-4" />
                  +351 210 000 000
                </a>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-sm overflow-hidden shadow-elevated">
              <img
                src="https://images.unsplash.com/photo-1600607687644-c7171b42498f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Reunião com equipa ARIFA Studio"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-arifa-teal/30 rounded-sm" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-arifa-teal/10 rounded-sm -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
