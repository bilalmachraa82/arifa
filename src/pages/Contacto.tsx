import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { SEO } from "@/components/SEO";
import { trackEvent } from "@/components/Analytics";

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
    },
    {
      icon: Phone,
      title: t("contact.phone"),
      details: ["+351 928 272 198"],
      href: "tel:+351928272198",
    },
    {
      icon: Mail,
      title: t("contact.email"),
      details: ["info@arifa.studio"],
      href: "mailto:info@arifa.studio",
    },
    {
      icon: Clock,
      title: t("contact.hours"),
      details: [t("contact.weekdays"), t("contact.saturday")],
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
      // Save lead to database
      const { error: dbError } = await supabase.from("leads").insert({
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

      // Try to send email (will fail silently if RESEND_API_KEY not configured)
      try {
        await supabase.functions.invoke("send-contact-email", {
          body: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            segment: formData.segment,
            service: formData.service,
            message: formData.message.trim(),
          },
        });
      } catch {
        // Email sending failed, but lead was saved - that's OK
        console.log("Email not sent - RESEND_API_KEY may not be configured");
      }

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
      {/* Hero */}
      <section className="py-24 lg:py-32 bg-arifa-warm-white">
        <div className="container-arifa">
          <div className="max-w-3xl">
            <p className="text-sm font-medium tracking-[0.3em] text-arifa-teal uppercase mb-4">
              {t("contact.subtitle")}
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-tight text-foreground mb-6">
              {t("contact.title")}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t("contact.description")}
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
                  {t("contact.whatToExpect")}
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-arifa-teal flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{t("contact.response24h")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-arifa-teal flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{t("contact.freeConsultation")}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-arifa-teal flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{t("contact.detailedProposal")}</span>
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
                      {t("contact.fullName")} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
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
                      className="w-full h-12 px-4 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
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
                      className="w-full h-12 px-4 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
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
                      className="w-full h-12 px-4 rounded-sm bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
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
                    className="w-full h-12 px-4 rounded-sm bg-background border border-input text-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
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
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal resize-none"
                    placeholder={t("contact.messagePlaceholder")}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full md:w-auto" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("contact.sending")}
                    </>
                  ) : (
                    <>
                      {t("contact.send")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="h-96 bg-secondary">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.7584856561986!2d-9.155252684678986!3d38.74431497959374!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19331a0e7c6477%3A0x8c7c7c7c7c7c7c7c!2sAv.%20de%20Berna%2031%2C%201050-038%20Lisboa!5e0!3m2!1spt-PT!2spt!4v1702000000000!5m2!1spt-PT!2spt"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Localização ARIFA Studio"
          className="grayscale hover:grayscale-0 transition-all duration-500"
        />
      </section>
    </Layout>
  );
}
