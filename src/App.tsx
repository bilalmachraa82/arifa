import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnalyticsScripts, AnalyticsProvider } from "@/components/Analytics";
import { InstallPWAPrompt } from "@/components/InstallPWAPrompt";
import { PageTransition, ScrollToTop } from "@/components/transitions/PageTransition";
import Index from "./pages/Index";
import Privado from "./pages/Privado";
import Empresas from "./pages/Empresas";
import Investidores from "./pages/Investidores";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import Contacto from "./pages/Contacto";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/ClientDashboard";
import ClientSettings from "./pages/ClientSettings";
import AdminDashboard from "./pages/AdminDashboard";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import Install from "./pages/Install";
import AcceptInvitation from "./pages/AcceptInvitation";
import QuotePublic from "./pages/QuotePublic";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";
import DesignerReport from "./pages/DesignerReport";
import SalesPresentation from "./pages/SalesPresentation";
import QuemSomos from "./pages/QuemSomos";
import Insights from "./pages/Insights";
import GuiaConstrucaoPortugal from "./pages/insights/GuiaConstrucaoPortugal";
import ReabilitacaoEficienciaEnergetica from "./pages/insights/ReabilitacaoEficienciaEnergetica";
import InvestimentoImobiliarioLisboa from "./pages/insights/InvestimentoImobiliarioLisboa";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AnalyticsScripts />
            <InstallPWAPrompt />
            <BrowserRouter>
              <ScrollToTop />
              <AnalyticsProvider>
                <PageTransition>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/privado" element={<Privado />} />
                    <Route path="/empresas" element={<Empresas />} />
                    <Route path="/investidores" element={<Investidores />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/portfolio/:slug" element={<ProjectDetail />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/dashboard" element={<ClientDashboard />} />
                    <Route path="/dashboard/settings" element={<ClientSettings />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/privacidade" element={<Privacidade />} />
                    <Route path="/termos" element={<Termos />} />
                    <Route path="/install" element={<Install />} />
                    <Route path="/convite/:token" element={<AcceptInvitation />} />
                    <Route path="/cotacao/:token" element={<QuotePublic />} />
                    <Route path="/documentacao" element={<Documentation />} />
                    <Route path="/designer_report" element={<DesignerReport />} />
                    <Route path="/apresentacao" element={<SalesPresentation />} />
                    <Route path="/quem-somos" element={<QuemSomos />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/insights/guia-construcao-portugal" element={<GuiaConstrucaoPortugal />} />
                    <Route path="/insights/reabilitacao-eficiencia-energetica" element={<ReabilitacaoEficienciaEnergetica />} />
                    <Route path="/insights/investimento-imobiliario-lisboa" element={<InvestimentoImobiliarioLisboa />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </PageTransition>
              </AnalyticsProvider>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
