import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MFAChallengeProps {
  factorId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function MFAChallenge({ factorId, onSuccess, onCancel }: MFAChallengeProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const verifyMFA = async () => {
    if (code.length !== 6) return;

    setLoading(true);
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

      if (verifyError) throw verifyError;

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Código inválido",
        description: "O código introduzido está incorreto. Tente novamente.",
        variant: "destructive",
      });
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <CardTitle>Verificação de Dois Fatores</CardTitle>
        <CardDescription>
          Introduza o código de 6 dígitos da sua aplicação autenticadora para continuar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="text-center text-3xl tracking-widest font-mono h-14"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && code.length === 6) {
              verifyMFA();
            }
          }}
        />

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1" disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={verifyMFA} 
            disabled={code.length !== 6 || loading}
            className="flex-1"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Verificar"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
