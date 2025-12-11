import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, ExternalLink, Key, Loader2, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useToast } from "@/hooks/use-toast";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function PushNotificationSettings() {
  const { toast } = useToast();
  const { isSupported, isSubscribed, permission, loading, subscribe, unsubscribe } = usePushNotifications();
  const [vapidKey, setVapidKey] = useState("");
  const [showConfig, setShowConfig] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleToggle = async () => {
    setIsSubmitting(true);

    if (isSubscribed) {
      const result = await unsubscribe();
      if (result.success) {
        toast({
          title: "Notificações desativadas",
          description: "Deixará de receber notificações push neste dispositivo.",
        });
      } else {
        toast({
          title: "Erro",
          description: result.error || "Não foi possível desativar as notificações.",
          variant: "destructive",
        });
      }
    } else {
      if (!vapidKey.trim()) {
        toast({
          title: "Chave VAPID necessária",
          description: "Introduza a chave pública VAPID para ativar as notificações.",
          variant: "destructive",
        });
        setShowConfig(true);
        setIsSubmitting(false);
        return;
      }

      const result = await subscribe(vapidKey);
      if (result.success) {
        toast({
          title: "Notificações ativadas",
          description: "Receberá alertas sobre atualizações dos seus projetos.",
        });
      } else {
        toast({
          title: "Erro",
          description: result.error || "Não foi possível ativar as notificações.",
          variant: "destructive",
        });
      }
    }

    setIsSubmitting(false);
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notificações Push
          </CardTitle>
          <CardDescription>
            Receba alertas em tempo real sobre os seus projetos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              O seu navegador não suporta notificações push. Utilize um navegador moderno como Chrome, Firefox ou Edge.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações Push
              {isSubscribed && (
                <Badge variant="secondary" className="ml-2">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Ativas
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              Receba alertas em tempo real sobre atualizações dos seus projetos.
            </CardDescription>
          </div>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <Switch
              checked={isSubscribed}
              onCheckedChange={handleToggle}
              disabled={isSubmitting || (permission === "denied" && !isSubscribed)}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {permission === "denied" && !isSubscribed && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              As notificações foram bloqueadas no navegador. Para ativar, aceda às definições do navegador e permita notificações para este site.
            </AlertDescription>
          </Alert>
        )}

        <Collapsible open={showConfig} onOpenChange={setShowConfig}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Key className="h-4 w-4 mr-2" />
              {showConfig ? "Ocultar Configuração" : "Configurar Chaves VAPID"}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Para ativar notificações push, precisa de gerar chaves VAPID. Estas são necessárias para enviar notificações de forma segura.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="vapid-key">Chave Pública VAPID</Label>
              <Input
                id="vapid-key"
                value={vapidKey}
                onChange={(e) => setVapidKey(e.target.value)}
                placeholder="BNxx...chave pública VAPID"
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm">Como obter as chaves VAPID:</h4>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Opção 1: Gerador Online</p>
                <a
                  href="https://web-push-codelab.glitch.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  Web Push Codelab
                  <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-xs">Gere chaves VAPID instantaneamente. Copie a "Public Key" para aqui.</p>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Opção 2: Via Node.js</p>
                <code className="block bg-background p-2 rounded text-xs">
                  npx web-push generate-vapid-keys
                </code>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">Opção 3: Documentação</p>
                <a
                  href="https://developer.mozilla.org/en-US/docs/Web/API/Push_API"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  MDN Push API Docs
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Nota:</strong> A chave privada VAPID deve ser configurada no servidor (edge function) para enviar notificações. Contacte o administrador se precisar de ajuda.
              </AlertDescription>
            </Alert>
          </CollapsibleContent>
        </Collapsible>

        {isSubscribed && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              Será notificado quando:
            </p>
            <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Houver atualizações no seu projeto</li>
              <li>Novos documentos forem partilhados</li>
              <li>Receber novas mensagens</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
