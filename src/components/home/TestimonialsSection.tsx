import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const testimonials = [
  {
    id: 1,
    content: "O ARIFA Studio transformou completamente a nossa visão. A atenção ao detalhe e a capacidade de entender exatamente o que queríamos foi extraordinária. A nossa casa é agora um reflexo perfeito de quem somos.",
    contentEn: "ARIFA Studio completely transformed our vision. The attention to detail and the ability to understand exactly what we wanted was extraordinary. Our home is now a perfect reflection of who we are.",
    author: "Maria Santos",
    role: "Cliente Privado",
    roleEn: "Private Client",
    project: "Casa da Serra, Sintra",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    segment: "privado" as const,
  },
  {
    id: 2,
    content: "Profissionalismo de excelência. O estudo de viabilidade que fizeram para o nosso projeto de investimento foi decisivo. Os números estavam certos e o retorno superou as expectativas.",
    contentEn: "Excellent professionalism. The feasibility study they did for our investment project was decisive. The numbers were right and the return exceeded expectations.",
    author: "João Ferreira",
    role: "Investidor Imobiliário",
    roleEn: "Real Estate Investor",
    project: "Empreendimento Tejo View",
    projectEn: "Tejo View Development",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    segment: "investidores" as const,
  },
  {
    id: 3,
    content: "Os novos escritórios mudaram a cultura da nossa empresa. Os colaboradores estão mais motivados e produtivos. O investimento pagou-se em meses através da retenção de talento.",
    contentEn: "The new offices changed our company culture. Employees are more motivated and productive. The investment paid for itself in months through talent retention.",
    author: "Ana Rodrigues",
    role: "CEO, TechStart Portugal",
    project: "Escritórios TechStart, Lisboa",
    projectEn: "TechStart Offices, Lisbon",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    segment: "empresas" as const,
  },
];

const segmentColors = {
  privado: "text-arifa-coral border-arifa-coral/30",
  empresas: "text-arifa-yellow border-arifa-yellow/30",
  investidores: "text-arifa-blue border-arifa-blue/30",
};

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { t, language } = useLanguage();

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  return (
    <section className="section-padding-lg bg-foreground text-background overflow-hidden">
      <div className="container-arifa">
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto mb-16 content-spacing">
          <p className="text-caption text-accent">
            {t("testimonials.subtitle")}
          </p>
          <h2 className="text-background">
            {t("testimonials.title")}
          </h2>
        </AnimatedSection>

        <div className="relative max-w-5xl mx-auto">
          <div className="relative min-h-[400px] md:min-h-[320px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-700 ease-out ${
                  index === current
                    ? "opacity-100 translate-x-0 scale-100"
                    : "opacity-0 absolute top-0 left-0 right-0 translate-x-12 scale-95 pointer-events-none"
                }`}
                onMouseEnter={() => setIsAutoPlaying(false)}
                onMouseLeave={() => setIsAutoPlaying(true)}
              >
                <div className="grid md:grid-cols-[1fr,auto] gap-8 md:gap-12 items-center">
                  {/* Quote content */}
                  <div className="relative">
                    {/* Large decorative quote mark */}
                    <span className={`quote-mark absolute -top-4 -left-2 md:-left-8 ${segmentColors[testimonial.segment].split(' ')[0]} opacity-30`}>
                      "
                    </span>
                    
                    <blockquote className="quote text-xl md:text-2xl !text-background/90 pl-6 md:pl-8 border-l-2 border-accent/30">
                      {language === "en" ? testimonial.contentEn : testimonial.content}
                    </blockquote>

                    {/* Closing quote mark */}
                    <span className={`quote-mark absolute -bottom-8 right-0 ${segmentColors[testimonial.segment].split(' ')[0]} opacity-30 rotate-180`}>
                      "
                    </span>
                  </div>

                  {/* Author card */}
                  <div className={`flex items-center gap-5 p-6 rounded-sm border ${segmentColors[testimonial.segment].split(' ')[1]} bg-background/5 backdrop-blur-sm min-w-[280px]`}>
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-background/20"
                      />
                      {/* Segment color indicator */}
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${
                        testimonial.segment === 'privado' ? 'bg-arifa-coral' :
                        testimonial.segment === 'empresas' ? 'bg-arifa-yellow' :
                        'bg-arifa-blue'
                      } ring-2 ring-foreground`} />
                    </div>
                    <div>
                      <p className="font-medium text-background">{testimonial.author}</p>
                      <p className="text-small text-background/70">
                        {language === "en" ? (testimonial.roleEn || testimonial.role) : testimonial.role}
                      </p>
                      <p className={`text-small ${segmentColors[testimonial.segment].split(' ')[0]}`}>
                        {language === "en" ? (testimonial.projectEn || testimonial.project) : testimonial.project}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-12">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-background/20 flex items-center justify-center hover:bg-background/10 hover:border-background/40 transition-all duration-300 hover:scale-110"
              aria-label={t("testimonials.previous")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex gap-3">
              {testimonials.map((testimonial, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === current
                      ? `w-10 ${
                          testimonial.segment === 'privado' ? 'bg-arifa-coral' :
                          testimonial.segment === 'empresas' ? 'bg-arifa-yellow' :
                          'bg-arifa-blue'
                        }`
                      : "w-2 bg-background/30 hover:bg-background/50"
                  }`}
                  aria-label={`${t("testimonials.goTo")} ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-background/20 flex items-center justify-center hover:bg-background/10 hover:border-background/40 transition-all duration-300 hover:scale-110"
              aria-label={t("testimonials.next")}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
