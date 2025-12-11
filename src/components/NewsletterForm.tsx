import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { trackEvent } from "@/components/Analytics";

const emailSchema = z.string().email("Email inválido").max(255);

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

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
      const { error } = await supabase.from("newsletter_subscribers").insert({
        email: email.trim(),
        is_active: true,
      });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Já subscrito",
            description: "Este email já está subscrito na nossa newsletter.",
          });
        } else {
          throw error;
        }
      } else {
        setSuccess(true);
        setEmail("");
        trackEvent("newsletter_subscribed", { source: "footer" });
        toast({
          title: "Subscrito com sucesso!",
          description: "Obrigado por subscrever a nossa newsletter.",
        });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Erro",
        description: "Não foi possível completar a subscrição. Tente novamente.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex items-center gap-2 text-sm text-arifa-teal">
        <CheckCircle2 className="h-5 w-5" />
        <span>Subscrito com sucesso!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="O seu email"
        required
        className="flex-1 h-10 px-4 rounded-sm bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-arifa-teal"
      />
      <Button
        type="submit"
        variant="accent"
        size="sm"
        disabled={loading}
        className="h-10 px-4"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
