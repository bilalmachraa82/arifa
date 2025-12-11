import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2, FileText, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { trackEvent } from "@/components/Analytics";

const emailSchema = z.string().email("Email inválido").max(255);

type Segment = "privado" | "empresas" | "investidores";

interface Resource {
  title: string;
  description: string;
  fileName: string;
}

const resources: Record<Segment, Resource> = {
  privado: {
    title: "Guia: Como Planear a Casa dos Seus Sonhos",
    description: "Um guia completo com 10 passos essenciais para planear o seu projeto residencial, desde o orçamento até à escolha do arquiteto.",
    fileName: "guia-casa-sonhos.pdf",
  },
  empresas: {
    title: "Checklist: Escritório Produtivo",
    description: "Uma checklist detalhada com os elementos fundamentais para criar um espaço de trabalho que potencia a produtividade e bem-estar.",
    fileName: "checklist-escritorio-produtivo.pdf",
  },
  investidores: {
    title: "Template: Análise de Viabilidade Imobiliária",
    description: "Um template profissional para avaliar oportunidades de investimento imobiliário com métricas de ROI e análise de risco.",
    fileName: "template-viabilidade-imobiliaria.pdf",
  },
};

const accentColors: Record<Segment, string> = {
  privado: "text-arifa-teal",
  empresas: "text-arifa-coral",
  investidores: "text-arifa-gold",
};

const bgColors: Record<Segment, string> = {
  privado: "bg-arifa-teal/10",
  empresas: "bg-arifa-coral/10",
  investidores: "bg-arifa-gold/10",
};

const buttonVariants: Record<Segment, "hero" | "default"> = {
  privado: "hero",
  empresas: "hero",
  investidores: "hero",
};

interface LeadMagnetSectionProps {
  segment: Segment;
}

export function LeadMagnetSection({ segment }: LeadMagnetSectionProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const resource = resources[segment];
  const accentColor = accentColors[segment];
  const bgColor = bgColors[segment];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email.trim());
    if (!result.success) {
      toast({
        title: "Erro",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Subscribe to newsletter
      await supabase.from("newsletter_subscribers").insert({
        email: email.trim(),
        is_active: true,
      });

      setSuccess(true);
      setEmail("");
      trackEvent("lead_magnet_downloaded", { 
        segment, 
        resource: resource.title 
      });
      toast({
        title: "Download disponível!",
        description: "O recurso foi enviado para o seu email. Obrigado!",
      });
    } catch (error: any) {
      // If already subscribed, still show success
      if (error?.code === "23505") {
        setSuccess(true);
        toast({
          title: "Download disponível!",
          description: "Já tem acesso aos nossos recursos. Verifique o seu email.",
        });
      } else {
        console.error("Lead magnet error:", error);
        toast({
          title: "Erro",
          description: "Não foi possível processar o pedido. Tente novamente.",
          variant: "destructive",
        });
      }
    }

    setLoading(false);
  };

  return (
    <section className="py-16 lg:py-20 bg-arifa-cream">
      <div className="container-arifa">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-sm p-8 lg:p-12 flex flex-col lg:flex-row gap-8 items-center">
            <div className={`w-20 h-20 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
              <FileText className={`h-10 w-10 ${accentColor}`} />
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <p className={`text-sm font-medium tracking-[0.2em] uppercase mb-2 ${accentColor}`}>
                Recurso Gratuito
              </p>
              <h3 className="font-display text-2xl font-medium text-foreground mb-2">
                {resource.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                {resource.description}
              </p>

              {success ? (
                <div className="flex items-center justify-center lg:justify-start gap-2 text-arifa-teal">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Verifique o seu email!</span>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="O seu email"
                    required
                    className="flex-1 h-12 px-4 rounded-sm bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-arifa-teal"
                  />
                  <Button
                    type="submit"
                    variant={buttonVariants[segment]}
                    size="lg"
                    disabled={loading}
                    className="whitespace-nowrap"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Download Gratuito
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
