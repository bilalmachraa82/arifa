import { Download, Smartphone, Share, Plus, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";

export default function Install() {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  return (
    <Layout>
      <SEO
        title="Instalar App"
        description="Instale a app ARIFA Studio no seu dispositivo para acesso rápido e funcionamento offline."
      />
      
      <div className="min-h-screen bg-background py-20">
        <div className="container max-w-2xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Instalar ARIFA Studio
            </h1>
            <p className="text-muted-foreground text-lg">
              Tenha acesso rápido à sua área de cliente diretamente do ecrã inicial.
            </p>
          </div>

          {isInstalled ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                App já instalada!
              </h2>
              <p className="text-muted-foreground">
                A ARIFA Studio já está instalada no seu dispositivo.
              </p>
            </div>
          ) : isInstallable ? (
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Instalação Rápida
              </h2>
              <p className="text-muted-foreground mb-6">
                Clique no botão abaixo para instalar a app no seu dispositivo.
              </p>
              <Button size="lg" onClick={installApp} className="gap-2">
                <Download className="h-5 w-5" />
                Instalar Agora
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {isIOS && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-2xl">🍎</span> iPhone / iPad
                  </h2>
                  <ol className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">1</span>
                      <span>Toque no botão <Share className="inline h-4 w-4" /> <strong>Partilhar</strong> na barra de navegação do Safari</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">2</span>
                      <span>Deslize para baixo e toque em <Plus className="inline h-4 w-4" /> <strong>Adicionar ao Ecrã principal</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">3</span>
                      <span>Toque em <strong>Adicionar</strong> no canto superior direito</span>
                    </li>
                  </ol>
                </div>
              )}

              {isAndroid && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-2xl">🤖</span> Android
                  </h2>
                  <ol className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">1</span>
                      <span>Toque no menu <MoreVertical className="inline h-4 w-4" /> (três pontos) no canto superior direito</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">2</span>
                      <span>Toque em <strong>Instalar aplicação</strong> ou <strong>Adicionar ao ecrã inicial</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">3</span>
                      <span>Confirme tocando em <strong>Instalar</strong></span>
                    </li>
                  </ol>
                </div>
              )}

              {!isIOS && !isAndroid && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-2xl">💻</span> Desktop
                  </h2>
                  <ol className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">1</span>
                      <span>Procure o ícone de instalação <Download className="inline h-4 w-4" /> na barra de endereço</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">2</span>
                      <span>Clique em <strong>Instalar</strong></span>
                    </li>
                  </ol>
                </div>
              )}
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-medium text-foreground text-sm">Acesso Rápido</h3>
              <p className="text-muted-foreground text-xs mt-1">Abra diretamente do ecrã inicial</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📴</div>
              <h3 className="font-medium text-foreground text-sm">Funciona Offline</h3>
              <p className="text-muted-foreground text-xs mt-1">Aceda a conteúdo já visitado</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">🔔</div>
              <h3 className="font-medium text-foreground text-sm">Notificações</h3>
              <p className="text-muted-foreground text-xs mt-1">Receba atualizações em tempo real</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
