import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle2, Loader2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { SEO } from "@/components/SEO";
import { trackEvent } from "@/components/Analytics";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().optional(),
  segment: z.string().min(1, "Selecione um segmento"),
  service: z.string().min(1, "Selecione um serviço"),
  message: z.string().trim().min(10, "Mensagem muito curta").max(2000),
});

export default function Contacto() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    segment: "",
    service: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contactInfo = [
    {
      icon: MapPin,
      title: t("contact.address"),
      details: ["Avenida de Berna, 31, 2º Dto, sala 9", "1050-038 Lisboa, Portugal"],
      color: "text-coral",
      bgColor: "bg-coral/10",
    },
    {
      icon: Phone,
      title: t("contact.phone"),
      details: ["+351 928 272 198"],
      href: "tel:+351928272198",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Mail,
      title: t("contact.email"),
      details: ["info@arifa.studio"],
      href: "mailto:info@arifa.studio",
      color: "text-yellow-dark",
      bgColor: "bg-yellow-light/30",
    },
    {
      icon: Clock,
      title: t("contact.hours"),
      details: [t("contact.weekdays"), t("contact.saturday")],
      color: "text-blue-dark",
      bgColor: "bg-blue-light/30",
    },
  ];

  const segmentOptions = [
    { value: "privado", label: t("contact.privateClient") },
    { value: "empresa", label: t("contact.company") },
    { value: "investidor", label: t("contact.investor") },
  ];

  const serviceOptions = [
    { value: "consultoria", label: t("contact.consulting") },
    { value: "design", label: t("contact.design") },
    { value: "bim", label: t("contact.bim") },
    { value: "simulacoes", label: t("contact.simulations") },
    { value: "construcao", label: t("contact.construction") },
    { value: "sustentabilidade", label: t("contact.sustainability") },
    { value: "outro", label: t("contact.other") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      // Save lead to database and get the ID for scoring
      const leadId = crypto.randomUUID();
      const { error: dbError } = await supabase.from("leads").insert({
        id: leadId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        segment: formData.segment,
        service: formData.service,
        message: formData.message.trim(),
        source: "website",
        status: "new",
      });

      if (dbError) throw dbError;

      // Fire-and-forget: email + AI lead scoring (non-blocking)
      const leadData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        segment: formData.segment,
        service: formData.service,
        message: formData.message.trim(),
      };

      supabase.functions.invoke("send-contact-email", { body: leadData }).catch(() => {
        console.log("Email not sent - RESEND_API_KEY may not be configured");
      });

      supabase.functions.invoke("score-lead", { body: { leadId } }).catch((err) => {
        console.log("Lead scoring skipped:", err.message);
      });

      toast({
        title: t("contact.successTitle"),
        description: t("contact.successMessage"),
      });

      // Track successful form submission
      trackEvent("contact_form_submitted", {
        segment: formData.segment,
        service: formData.service,
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        segment: "",
        service: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: t("contact.errorTitle"),
        description: t("contact.errorMessage"),
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  return (
    <Layout>
      <SEO 
        title="Contacto"
        description="Entre em contacto com a ARIFA Studio. Consulta inicial gratuita para o seu projeto de arquitetura ou design de interiores."
        url="https://arifa.studio/contacto"
        keywords="contacto arquitetura Lisboa, orçamento arquitetura, consulta arquitetura gratuita"
      />
      
      {/* Hero Section */}
      <section className="section-padding-lg bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,hsl(var(--accent)/0.08),transparent_50%)]" />
        <div className="container-arifa relative z-10">
          <AnimatedSection animation="fade-up">
            <div className="max-w-4xl">
              <p className="text-caption uppercase tracking-[0.3em] text-accent mb-4">
                {t("contact.subtitle")}
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-none text-foreground mb-6">
                Vamos criar<br />
                <span className="text-gradient">algo extraordinário</span>
              </h1>
              <p className="text-lead text-muted-foreground max-w-2xl">
                {t("contact.description")}
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container-arifa">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((item, index) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={0.1 + index * 0.1}>
                <div className="group bg-card border border-border rounded-sm p-6 hover:border-accent/50 hover:shadow-soft transition-all duration-300">
                  <div className={`w-14 h-14 rounded-full ${item.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <p className="font-semibold text-foreground mb-2">{item.title}</p>
                  {item.details.map((detail, i) => (
                    item.href ? (
                      <a 
                        key={i} 
                        href={item.href} 
                        className="text-muted-foreground hover:text-accent transition-colors block text-sm"
                      >
                        {detail}
                      </a>
                    ) : (
                      <p key={i} className="text-muted-foreground text-sm">{detail}</p>
                    )
                  ))}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="section-padding bg-background">
        <div className="container-arifa">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Form - Takes 3 columns */}
            <div className="lg:col-span-3">
              <AnimatedSection animation="fade-up">
                <div className="mb-8">
                  <h2 className="h2 text-foreground mb-4">Envie-nos uma mensagem</h2>
                  <p className="text-muted-foreground">
                    Preencha o formulário e entraremos em contacto em menos de 24 horas.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">
                        {t("contact.fullName")} *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full h-14 px-5 rounded-sm bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        placeholder={t("contact.namePlaceholder")}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">
                        {t("contact.emailLabel")} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full h-14 px-5 rounded-sm bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        placeholder={t("contact.emailPlaceholder")}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium text-foreground">
                        {t("contact.phoneLabel")}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full h-14 px-5 rounded-sm bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                        placeholder={t("contact.phonePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="segment" className="text-sm font-medium text-foreground">
                        {t("contact.clientType")} *
                      </label>
                      <select
                        id="segment"
                        name="segment"
                        required
                        value={formData.segment}
                        onChange={handleChange}
                        className="w-full h-14 px-5 rounded-sm bg-card border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none cursor-pointer"
                      >
                        <option value="">{t("contact.selectOption")}</option>
                        {segmentOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                      {errors.segment && <p className="text-sm text-destructive">{errors.segment}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-medium text-foreground">
                      {t("contact.service")} *
                    </label>
                    <select
                      id="service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full h-14 px-5 rounded-sm bg-card border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      <option value="">{t("contact.selectOption")}</option>
                      {serviceOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    {errors.service && <p className="text-sm text-destructive">{errors.service}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">
                      {t("contact.message")} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-5 py-4 rounded-sm bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none transition-all"
                      placeholder={t("contact.messagePlaceholder")}
                    />
                    {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full md:w-auto h-14 px-10" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        {t("contact.sending")}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        {t("contact.send")}
                      </>
                    )}
                  </Button>
                </form>
              </AnimatedSection>
            </div>

            {/* Sidebar - What to expect */}
            <div className="lg:col-span-2">
              <AnimatedSection animation="fade-up" delay={0.2}>
                <div className="sticky top-32 space-y-8">
                  {/* What to expect */}
                  <div className="bg-card border border-border rounded-sm p-8">
                    <h3 className="text-xl font-bold text-foreground mb-6">
                      {t("contact.whatToExpect")}
                    </h3>
                    <ul className="space-y-5">
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">Resposta em 24h</p>
                          <p className="text-xs text-muted-foreground mt-1">{t("contact.response24h")}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-coral/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-coral" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">Consulta Gratuita</p>
                          <p className="text-xs text-muted-foreground mt-1">{t("contact.freeConsultation")}</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-yellow-light/30 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="h-4 w-4 text-yellow-dark" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-sm">Proposta Detalhada</p>
                          <p className="text-xs text-muted-foreground mt-1">{t("contact.detailedProposal")}</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  {/* Quick contact CTA */}
                  <div className="bg-foreground text-background rounded-sm p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,hsl(var(--accent)/0.2),transparent_50%)]" />
                    <div className="relative z-10">
                      <h4 className="font-bold text-lg mb-3">Prefere falar diretamente?</h4>
                      <p className="text-sm text-background/70 mb-5">
                        Estamos disponíveis para uma conversa telefónica ou videochamada.
                      </p>
                      <a 
                        href="tel:+351928272198" 
                        className="inline-flex items-center gap-2 text-accent font-semibold hover:gap-3 transition-all"
                      >
                        <Phone className="h-4 w-4" />
                        +351 928 272 198
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps - Full width with overlay */}
      <section className="relative">
        <AnimatedSection animation="fade-up">
          <div className="relative h-[500px] lg:h-[600px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.7584856561986!2d-9.155252684678986!3d38.74431497959374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19331a0e7c6477%3A0x8c7c7c7c7c7c7c7c!2sAv.%20de%20Berna%2031%2C%201050-038%20Lisboa!5e0!3m2!1spt-PT!2spt!4v1702000000000!5m2!1spt-PT!2spt"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização ARIFA Studio"
              className="grayscale hover:grayscale-0 transition-all duration-700"
            />
            
            {/* Location card overlay */}
            <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 max-w-sm">
              <div className="bg-background/95 backdrop-blur-sm rounded-sm p-6 shadow-card border border-border">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-1">ARIFA Studio</h4>
                    <p className="text-sm text-muted-foreground">
                      Avenida de Berna, 31, 2º Dto<br />
                      1050-038 Lisboa, Portugal
                    </p>
                    <a 
                      href="https://goo.gl/maps/example" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent mt-3 hover:gap-2 transition-all"
                    >
                      Obter direções
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </Layout>
  );
}
