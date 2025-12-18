import { AnimatedSection } from "@/components/ui/AnimatedSection";

type Segment = "privado" | "empresas" | "investidores";

interface Testimonial {
  content: string;
  author: string;
  role: string;
  company?: string;
}

const testimonials: Record<Segment, Testimonial[]> = {
  privado: [
    {
      content: "A ARIFA transformou a nossa casa num espaço que realmente reflete quem somos. Cada detalhe foi pensado com cuidado e o acompanhamento foi impecável do início ao fim.",
      author: "Sofia Martins",
      role: "Proprietária",
      company: "Casa da Serra, Sintra",
    },
    {
      content: "Superaram todas as nossas expectativas. O projeto foi entregue dentro do prazo e orçamento, e o resultado final é ainda melhor do que imaginávamos.",
      author: "João e Ana Ferreira",
      role: "Proprietários",
      company: "Apartamento Chiado, Lisboa",
    },
  ],
  empresas: [
    {
      content: "O novo escritório aumentou significativamente a produtividade e satisfação da equipa. A abordagem centrada nas pessoas da ARIFA fez toda a diferença.",
      author: "Ricardo Santos",
      role: "CEO",
      company: "TechStart Portugal",
    },
    {
      content: "Trabalhamos com várias empresas de arquitetura, mas a ARIFA destaca-se pela integração BIM e pelo rigor no cumprimento de prazos. Parceiros de confiança.",
      author: "Maria Costa",
      role: "Diretora de Operações",
      company: "Grupo Hospitalidade PT",
    },
  ],
  investidores: [
    {
      content: "O estudo de viabilidade da ARIFA foi decisivo para avançarmos com o investimento. ROI de 22% em 24 meses, exatamente como projetado.",
      author: "António Pereira",
      role: "Investidor Imobiliário",
      company: "Empreendimento Tejo View",
    },
    {
      content: "Profissionalismo exemplar em todo o processo de licenciamento. A experiência deles com projetos de reabilitação urbana poupou-nos meses de trabalho.",
      author: "Helena Rodrigues",
      role: "Gestora de Fundos",
      company: "Capital Imobiliário SA",
    },
  ],
};

const segmentConfig: Record<Segment, { 
  accent: string; 
  bg: string; 
  border: string;
  quoteColor: string;
}> = {
  privado: {
    accent: "text-arifa-coral",
    bg: "bg-arifa-coral/10",
    border: "border-arifa-coral/20",
    quoteColor: "text-arifa-coral/30",
  },
  empresas: {
    accent: "text-arifa-yellow",
    bg: "bg-arifa-yellow/10",
    border: "border-arifa-yellow/20",
    quoteColor: "text-arifa-yellow/30",
  },
  investidores: {
    accent: "text-arifa-blue",
    bg: "bg-arifa-blue/10",
    border: "border-arifa-blue/20",
    quoteColor: "text-arifa-blue/30",
  },
};

interface SegmentTestimonialsProps {
  segment: Segment;
}

export function SegmentTestimonials({ segment }: SegmentTestimonialsProps) {
  const segmentTestimonials = testimonials[segment];
  const config = segmentConfig[segment];

  return (
    <section className="section-padding-lg bg-background">
      <div className="container-arifa">
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-16 content-spacing">
          <p className={`text-caption ${config.accent}`}>
            Testemunhos
          </p>
          <h2>
            O que dizem os nossos clientes
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-8">
          {segmentTestimonials.map((testimonial, index) => (
            <AnimatedSection
              key={index}
              animation="fade-up"
              delay={index * 150}
              className={`bg-card border ${config.border} rounded-sm p-8 lg:p-10 relative group hover:shadow-card transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Large quote mark */}
              <span className={`quote-mark absolute top-6 left-6 ${config.quoteColor} transition-all duration-300 group-hover:scale-110`}>
                "
              </span>
              
              {/* Content */}
              <div className="pt-10">
                <blockquote className="quote text-lg !text-foreground !border-l-0 !pl-0 mb-8">
                  {testimonial.content}
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <div className={`w-12 h-12 rounded-full ${config.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                    <span className={`text-lg font-bold ${config.accent}`}>
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-small text-muted-foreground">
                      {testimonial.role}
                      {testimonial.company && (
                        <span className={`${config.accent}`}> · {testimonial.company}</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Closing quote */}
              <span className={`quote-mark absolute bottom-6 right-6 ${config.quoteColor} rotate-180 transition-all duration-300 group-hover:scale-110`}>
                "
              </span>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
