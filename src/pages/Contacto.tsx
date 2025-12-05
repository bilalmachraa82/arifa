import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const contactInfo = [
  {
    icon: MapPin,
    title: "Morada",
    details: ["Rua da Arquitetura, 123", "1100-001 Lisboa, Portugal"],
  },
  {
    icon: Phone,
    title: "Telefone",
    details: ["+351 210 000 000"],
    href: "tel:+351210000000",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["geral@arifastudio.pt"],
    href: "mailto:geral@arifastudio.pt",
  },
  {
    icon: Clock,
    title: "Horário",
    details: ["Seg - Sex: 9h - 18h", "Sáb: Com marcação"],
  },
];

const segmentOptions = [
  { value: "privado", label: "Cliente Privado" },
  { value: "empresa", label: "Empresa" },
  { value: "investidor", label: "Investidor" },
];

const serviceOptions = [
  { value: "projeto-novo", label: "Projeto de raiz" },
  { value: "remodelacao", label: "Remodelação" },
  { value: "interiores", label: "Design de interiores" },
  { value: "viabilidade", label: "Estudo de viabilidade" },
  { value: "outro", label: "Outro" },
];

export default function Contacto() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    segment: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contacto consigo em breve.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      segment: "",
      service: "",
      message: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase mb-4">
              Contacto
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight text-foreground mb-6">
              Vamos conversar sobre o seu projeto
            </h1>
            <p className="text-lg text-muted-foreground">
              Tem um projeto em mente? Queremos conhecê-lo. 
              A primeira consulta é gratuita e sem compromisso.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-arifa-teal/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-arifa-teal" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      {item.details.map((detail, i) => (
                        item.href ? (
                          <a key={i} href={item.href} className="text-muted-foreground hover:text-arifa-teal transition-colors block">
                            {detail}
                          </a>
                        ) : (
                          <p key={i} className="text-muted-foreground">{detail}</p>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-border">
                <h3 className="font-display text-xl font-medium text-foreground mb-4">
                  O que esperar
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-arifa-teal flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Resposta em até 24 horas</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-arifa-teal flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Consulta inicial gratuita</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-arifa-teal flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">Proposta detalhada sem compromisso</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-sm p-8 lg:p-10 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-foreground">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
                      placeholder="O seu nome"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
                      placeholder="email@exemplo.pt"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
                      placeholder="+351 900 000 000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="segment" className="text-sm font-medium text-foreground">
                      Tipo de cliente *
                    </label>
                    <select
                      id="segment"
                      name="segment"
                      required
                      value={formData.segment}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-sm bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
                    >
                      <option value="">Selecione...</option>
                      {segmentOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="text-sm font-medium text-foreground">
                    Serviço pretendido *
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-sm bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
                  >
                    <option value="">Selecione...</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal resize-none"
                    placeholder="Descreva brevemente o seu projeto..."
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full md:w-auto">
                  Enviar mensagem
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="h-96 bg-secondary">
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground">Mapa — Rua da Arquitetura, 123, Lisboa</p>
        </div>
      </section>
    </Layout>
  );
}
