import { Quote } from "lucide-react";

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

const accentColors: Record<Segment, string> = {
  privado: "text-accent",
  empresas: "text-arifa-coral",
  investidores: "text-arifa-yellow",
};

const bgColors: Record<Segment, string> = {
  privado: "bg-accent/10",
  empresas: "bg-arifa-coral/10",
  investidores: "bg-arifa-yellow/10",
};

interface SegmentTestimonialsProps {
  segment: Segment;
}

export function SegmentTestimonials({ segment }: SegmentTestimonialsProps) {
  const segmentTestimonials = testimonials[segment];
  const accentColor = accentColors[segment];
  const bgColor = bgColors[segment];

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container-arifa">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className={`text-sm font-medium tracking-[0.3em] uppercase mb-4 ${accentColor}`}>
            Testemunhos
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            O que dizem os nossos clientes
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {segmentTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-sm p-8 lg:p-10 relative"
            >
              <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mb-6`}>
                <Quote className={`h-5 w-5 ${accentColor}`} />
              </div>
              <blockquote className="text-lg text-foreground leading-relaxed mb-6">
                "{testimonial.content}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center`}>
                  <span className={`text-lg font-bold ${accentColor}`}>
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}{testimonial.company && ` · ${testimonial.company}`}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
