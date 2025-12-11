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
import Index from "./pages/Index";
import Privado from "./pages/Privado";
import Empresas from "./pages/Empresas";
import Investidores from "./pages/Investidores";
import Portfolio from "./pages/Portfolio";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contacto from "./pages/Contacto";
import Servicos from "./pages/Servicos";
import Auth from "./pages/Auth";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Privacidade from "./pages/Privacidade";
import Termos from "./pages/Termos";
import Install from "./pages/Install";
import AcceptInvitation from "./pages/AcceptInvitation";
import NotFound from "./pages/NotFound";

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
              <AnalyticsProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/privado" element={<Privado />} />
                <Route path="/empresas" element={<Empresas />} />
                <Route path="/investidores" element={<Investidores />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:slug" element={<ProjectDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<ClientDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/privacidade" element={<Privacidade />} />
                <Route path="/termos" element={<Termos />} />
                <Route path="/install" element={<Install />} />
                <Route path="/convite/:token" element={<AcceptInvitation />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </AnalyticsProvider>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
