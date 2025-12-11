import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldCheck, ShieldOff, Copy, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MFASetupProps {
  mfaEnabled: boolean;
  onMFAChange: () => void;
}

export default function MFASetup({ mfaEnabled, onMFAChange }: MFASetupProps) {
  const [loading, setLoading] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const startEnrollment = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "ARIFA Authenticator",
      });

      if (error) throw error;

      if (data.totp) {
        setQrCode(data.totp.qr_code);
        setSecret(data.totp.secret);
        setFactorId(data.id);
        setEnrolling(true);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao iniciar MFA",
        description: error.message || "Não foi possível iniciar a configuração MFA.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnableMFA = async () => {
    if (!factorId || verifyCode.length !== 6) return;

    setLoading(true);
    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode,
      });

      if (verifyError) throw verifyError;

      toast({
        title: "MFA ativado!",
        description: "A autenticação de dois fatores está agora ativa na sua conta.",
      });

      setEnrolling(false);
      setQrCode(null);
      setSecret(null);
      setVerifyCode("");
      setDialogOpen(false);
      onMFAChange();
    } catch (error: any) {
      toast({
        title: "Código inválido",
        description: "O código introduzido está incorreto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const disableMFA = async () => {
    setLoading(true);
    try {
      const { data: factors, error: factorsError } = await supabase.auth.mfa.listFactors();
      
      if (factorsError) throw factorsError;

      const totpFactor = factors.totp.find(f => f.status === "verified");
      
      if (totpFactor) {
        const { error: unenrollError } = await supabase.auth.mfa.unenroll({
          factorId: totpFactor.id,
        });

        if (unenrollError) throw unenrollError;

        toast({
          title: "MFA desativado",
          description: "A autenticação de dois fatores foi removida da sua conta.",
        });
        
        onMFAChange();
      }
    } catch (error: any) {
      toast({
        title: "Erro ao desativar MFA",
        description: error.message || "Não foi possível desativar o MFA.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    if (secret) {
      navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cancelEnrollment = () => {
    setEnrolling(false);
    setQrCode(null);
    setSecret(null);
    setVerifyCode("");
    setFactorId(null);
    setDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${mfaEnabled ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
              {mfaEnabled ? (
                <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <Shield className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">Autenticação de Dois Fatores</CardTitle>
              <CardDescription>
                Proteja a sua conta com uma camada extra de segurança
              </CardDescription>
            </div>
          </div>
          <Badge variant={mfaEnabled ? "default" : "secondary"}>
            {mfaEnabled ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {mfaEnabled ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              A autenticação de dois fatores está ativa. A sua conta está protegida com verificação adicional no login.
            </p>
            <Button 
              variant="outline" 
              onClick={disableMFA} 
              disabled={loading}
              className="text-destructive hover:text-destructive"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldOff className="mr-2 h-4 w-4" />
              )}
              Desativar MFA
            </Button>
          </div>
        ) : (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setDialogOpen(true); startEnrollment(); }} disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Shield className="mr-2 h-4 w-4" />
                )}
                Ativar MFA
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Configurar Autenticação de Dois Fatores</DialogTitle>
                <DialogDescription>
                  Use uma aplicação autenticadora (como Google Authenticator ou Authy) para digitalizar o código QR.
                </DialogDescription>
              </DialogHeader>

              {enrolling && qrCode && (
                <div className="space-y-6">
                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg">
                      <img src={qrCode} alt="QR Code MFA" className="w-48 h-48" />
                    </div>
                  </div>

                  {/* Manual Secret */}
                  {secret && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground text-center">
                        Ou introduza este código manualmente:
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-3 bg-muted rounded-lg text-xs font-mono text-center break-all">
                          {secret}
                        </code>
                        <Button variant="outline" size="icon" onClick={copySecret}>
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Verification Code Input */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Introduza o código de 6 dígitos da sua aplicação:
                    </label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="000000"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="text-center text-2xl tracking-widest font-mono"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={cancelEnrollment} className="flex-1">
                      Cancelar
                    </Button>
                    <Button 
                      onClick={verifyAndEnableMFA} 
                      disabled={verifyCode.length !== 6 || loading}
                      className="flex-1"
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="mr-2 h-4 w-4" />
                      )}
                      Verificar e Ativar
                    </Button>
                  </div>
                </div>
              )}

              {!enrolling && loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
