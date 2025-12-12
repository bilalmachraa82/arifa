import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const { t, language } = useLanguage();

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 lg:py-32 bg-foreground text-background overflow-hidden">
      <div className="container-arifa">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-medium tracking-[0.3em] text-accent uppercase mb-4">
            {t("testimonials.subtitle")}
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold">
            {t("testimonials.title")}
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`transition-all duration-500 ${
                  index === current
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 absolute top-0 left-0 right-0 translate-x-8"
                }`}
              >
                <div className="text-center">
                  <Quote className="h-12 w-12 text-accent mx-auto mb-8 opacity-50" />
                  
                  <blockquote className="text-2xl md:text-3xl font-light leading-relaxed mb-8">
                    "{language === "en" ? testimonial.contentEn : testimonial.content}"
                  </blockquote>

                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-background/70">
                        {language === "en" ? (testimonial.roleEn || testimonial.role) : testimonial.role}
                      </p>
                      <p className="text-xs text-accent">
                        {language === "en" ? (testimonial.projectEn || testimonial.project) : testimonial.project}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-background/20 flex items-center justify-center hover:bg-background/10 transition-colors"
              aria-label={t("testimonials.previous")}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === current
                      ? "bg-accent w-8"
                      : "bg-background/30 hover:bg-background/50"
                  }`}
                  aria-label={`${t("testimonials.goTo")} ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
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
