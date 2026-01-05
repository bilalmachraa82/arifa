import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  Mail,
  MessageSquare,
  FolderOpen,
  Users,
  Clock,
  Euro,
  FileText,
  Globe,
  Lock,
  LayoutDashboard,
  Zap,
  Shield,
  Check,
  ArrowRight,
  Calendar,
  Rocket,
  Phone,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SalesPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalSlides = 11;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullscreen, isFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const slideVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-6xl aspect-[16/9] bg-white rounded-lg shadow-2xl overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {currentSlide === 0 && <SlideCover />}
              {currentSlide === 1 && <SlideProblem />}
              {currentSlide === 2 && <SlideSolution />}
              {currentSlide === 3 && <SlideTransformation />}
              {currentSlide === 4 && <SlidePublicSite />}
              {currentSlide === 5 && <SlideClientPortal />}
              {currentSlide === 6 && <SlideAdminDashboard />}
              {currentSlide === 7 && <SlideAutomations />}
              {currentSlide === 8 && <SlideValue />}
              {currentSlide === 9 && <SlideTerms />}
              {currentSlide === 10 && <SlideNextSteps />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  i === currentSlide 
                    ? "bg-[#1e3a5f] scale-125" 
                    : i < currentSlide 
                      ? "bg-[#3D7081]" 
                      : "bg-slate-300"
                }`}
              />
            ))}
            <span className="ml-4 text-sm text-slate-500 font-medium">
              Slide {currentSlide + 1} de {totalSlides}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="gap-1 border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
              className="gap-1 bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white"
            >
              Seguinte
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE 1: CAPA
// ============================================
const SlideCover = () => (
  <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-white via-slate-50 to-blue-50 p-12 relative overflow-hidden">
    {/* Geometric Lines */}
    <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
      <div className="absolute top-20 right-20 w-64 h-0.5 bg-[#1e3a5f] rotate-45" />
      <div className="absolute top-32 right-32 w-48 h-0.5 bg-[#3D7081] rotate-45" />
      <div className="absolute top-44 right-16 w-32 h-0.5 bg-[#1e3a5f] rotate-45" />
    </div>
    <div className="absolute bottom-0 left-0 w-1/2 h-full opacity-10">
      <div className="absolute bottom-20 left-20 w-64 h-0.5 bg-[#1e3a5f] -rotate-45" />
      <div className="absolute bottom-32 left-32 w-48 h-0.5 bg-[#3D7081] -rotate-45" />
    </div>

    {/* Content */}
    <div className="text-center z-10">
      <div className="mb-8">
        <div className="w-16 h-16 mx-auto mb-6 border-2 border-[#1e3a5f] rotate-45 flex items-center justify-center">
          <span className="text-[#1e3a5f] font-bold text-xl -rotate-45">A</span>
        </div>
      </div>
      <h1 className="text-5xl md:text-6xl font-light text-[#1e3a5f] mb-4 tracking-tight">
        Plataforma Digital <span className="font-semibold">ARIFA</span>
      </h1>
      <p className="text-xl md:text-2xl text-slate-500 font-light mt-6">
        Transformar o teu estúdio em 6-8 semanas
      </p>
      <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-400">
        <span>Use as setas ←→ para navegar</span>
        <span className="mx-2">•</span>
        <span>F para fullscreen</span>
      </div>
    </div>
  </div>
);

// ============================================
// SLIDE 2: O PROBLEMA
// ============================================
const SlideProblem = () => {
  const problems = [
    { icon: Mail, text: "Demasiados emails e WhatsApps com clientes" },
    { icon: FolderOpen, text: "Projetos espalhados por email, drives e cadernos" },
    { icon: Users, text: "Difícil mostrar trabalho anterior e prova social" },
    { icon: Clock, text: "Muito tempo a fazer follow-ups manuais" },
    { icon: Euro, text: "Não consegues demonstrar claramente o valor do teu trabalho" },
    { icon: FileText, text: "Processo de briefing desorganizado" },
  ];

  return (
    <div className="h-full flex flex-col bg-white p-12">
      <div className="mb-8">
        <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">Teresa, sabemos que...</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-2">Onde estás hoje</h2>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-6 content-center">
        {problems.map((problem, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-5 rounded-lg bg-slate-50 border border-slate-100"
          >
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <problem.icon className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-slate-600 text-lg leading-relaxed">{problem.text}</p>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-slate-400 text-sm mt-6">
        Isto é comum no teu setor. Mas não tem de ser assim.
      </p>
    </div>
  );
};

// ============================================
// SLIDE 3: A SOLUÇÃO
// ============================================
const SlideSolution = () => {
  const solutions = [
    { icon: Globe, title: "Site público profissional", desc: "Portfólio + credibilidade + SEO" },
    { icon: Lock, title: "Portal privado para clientes", desc: "Tudo num só lugar" },
    { icon: LayoutDashboard, title: "Dashboard admin", desc: "Gestão central de tudo" },
    { icon: Zap, title: "Automações inteligentes", desc: "Follow-ups automáticos" },
    { icon: Shield, title: "Segurança & backup", desc: "Dados protegidos" },
  ];

  return (
    <div className="h-full flex flex-col bg-white p-12">
      <div className="mb-8">
        <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">A solução</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-2">O que tu vais ter</h2>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-4 w-full">
          {solutions.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-gradient-to-b from-blue-50 to-white border border-blue-100"
            >
              <div className="w-14 h-14 rounded-full bg-[#1e3a5f] flex items-center justify-center mb-4">
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-medium text-[#1e3a5f] text-sm mb-2">{item.title}</h3>
              <p className="text-slate-500 text-xs">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE 4: TRANSFORMAÇÃO
// ============================================
const SlideTransformation = () => {
  const comparisons = [
    { before: "Gerir 5 projetos em 5 lugares diferentes", after: "Um único hub centralizado" },
    { before: "2h/dia em emails e follow-ups", after: "20 minutos automático" },
    { before: "Clientes à deriva sem saber o que se passa", after: "Clientes veem progresso em tempo real" },
    { before: "Vendas apenas por 'boca a boca'", after: "Portfolio que vende por ti 24/7" },
    { before: "Documentos no Drive desordenado", after: "Organização 100% clara" },
  ];

  return (
    <div className="h-full flex flex-col bg-white p-12">
      <div className="mb-8">
        <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">A transformação</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-2">O que muda para ti</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-4">
        {comparisons.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center"
          >
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-right">
              <p className="text-slate-600 text-sm">{item.before}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-[#3D7081] flex-shrink-0" />
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <p className="text-slate-700 text-sm font-medium">{item.after}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// SLIDE 5: SITE PÚBLICO
// ============================================
const SlidePublicSite = () => {
  const features = [
    "Portfólio com filtros (por tipo, localização, tema)",
    "Galeria de fotos profissional (high-res, rápida, mobile)",
    "Sobre a Teresa & equipa (storytelling)",
    "Blog/News (para SEO + autoridade)",
    "Formulário de contacto inteligente → vai direto para o admin",
  ];

  return (
    <div className="h-full flex flex-col bg-white p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">Funcionalidade 1</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Site Público</h2>
        </div>
      </div>
      <p className="text-xl text-slate-500 mb-8">O teu cartão de visita digital</p>

      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-slate-50"
            >
              <Check className="w-5 h-5 text-[#3D7081] flex-shrink-0" />
              <p className="text-slate-700">{feature}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-[#1e3a5f] text-sm font-medium">
            💡 Otimizado para Google — os teus clientes encontram-te quando procuram.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE 6: PORTAL CLIENTE
// ============================================
const SlideClientPortal = () => {
  const features = [
    "Briefing estruturado (formulário configurável)",
    "Galeria de progresso (uploads, renders, aprovações)",
    "Timeline do projeto (marcos, datas, responsabilidades)",
    "Documentos centralizados (PDFs, especificações, orçamentos)",
    "Notificações automáticas (cliente sabe quando há novidades)",
  ];

  return (
    <div className="h-full flex flex-col bg-white p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">Funcionalidade 2</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Portal Privado</h2>
        </div>
      </div>
      <p className="text-xl text-slate-500 mb-8">O controlo total sobre a experiência do cliente</p>

      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-slate-50"
            >
              <Check className="w-5 h-5 text-[#3D7081] flex-shrink-0" />
              <p className="text-slate-700">{feature}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-[#1e3a5f] text-sm font-medium">
            🔒 O cliente vê exatamente o que precisa saber, nada mais. Tu decides o que é visível.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE 7: DASHBOARD ADMIN
// ============================================
const SlideAdminDashboard = () => {
  const features = [
    "Visão de todos os projetos (status, datas críticas, clientes)",
    "Gestão de clientes (histórico, contratos, pagamentos)",
    "Biblioteca de documentos (templates, especificações reutilizáveis)",
    "Automações configuráveis (sem código)",
    "Relatórios (projetos/mês, valor médio, satisfação)",
  ];

  return (
    <div className="h-full flex flex-col bg-white p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">Funcionalidade 3</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Dashboard Admin</h2>
        </div>
      </div>
      <p className="text-xl text-slate-500 mb-8">O teu painel de comando</p>

      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-4 rounded-lg bg-slate-50"
            >
              <Check className="w-5 h-5 text-[#3D7081] flex-shrink-0" />
              <p className="text-slate-700">{feature}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-[#1e3a5f] text-sm font-medium">
            📊 Tudo que precisas para gerir a empresa com um golpe de vista.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE 8: AUTOMAÇÕES
// ============================================
const SlideAutomations = () => {
  const features = [
    "Follow-ups automáticos (cliente não aprovou em 5 dias? Lembrete automático)",
    "Notificações smart (Teresa + clientes sabem do que é preciso)",
    "Geração automática de documentos (relatórios, checklists)",
    "IA integrada (sugestões de melhoria, análise de feedbacks)",
  ];

  return (
    <div className="h-full flex flex-col bg-white p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">Funcionalidade 4</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Automações Inteligentes</h2>
        </div>
      </div>
      <p className="text-xl text-slate-500 mb-8">O trabalho invisível</p>

      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-4">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-4 p-5 rounded-lg bg-slate-50"
            >
              <Check className="w-5 h-5 text-[#3D7081] flex-shrink-0" />
              <p className="text-slate-700 text-lg">{feature}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <p className="text-[#1e3a5f] text-sm font-medium">
            ⚡ Estas automações funcionam 24/7. Tu dormes, elas trabalham.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE 9: VALOR FINANCEIRO
// ============================================
const SlideValue = () => {
  const tools = [
    { name: "Squarespace/Wix (site)", cost: "~300 €" },
    { name: "Pipedrive/HubSpot (CRM)", cost: "~2.880 €" },
    { name: "Notion/Asana (gestão)", cost: "~300 €" },
    { name: "Mailchimp/Resend (email)", cost: "~600 €" },
    { name: "Figma (design collab)", cost: "~200 €" },
    { name: "Armazenamento/Backup", cost: "~300 €" },
  ];

  return (
    <div className="h-full flex flex-col bg-white p-12">
      <div className="mb-6">
        <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">Análise financeira</span>
        <h2 className="text-3xl font-light text-[#1e3a5f] mt-2">O investimento vs. O custo de não fazer nada</h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Left: Cost comparison */}
        <div className="flex flex-col">
          <h3 className="text-lg font-medium text-slate-700 mb-4">Se usares ferramentas separadas:</h3>
          <div className="space-y-2 flex-1">
            {tools.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded"
              >
                <span className="text-slate-600 text-sm">{tool.name}</span>
                <span className="text-slate-500 text-sm">{tool.cost}/ano</span>
              </motion.div>
            ))}
            <div className="flex justify-between items-center py-3 px-3 bg-red-50 rounded-lg border border-red-100 mt-2">
              <span className="font-semibold text-red-700">TOTAL/ANO</span>
              <span className="font-bold text-red-700 text-lg">~4.580 €</span>
            </div>
          </div>
        </div>

        {/* Right: Our offer */}
        <div className="flex flex-col">
          <h3 className="text-lg font-medium text-slate-700 mb-4">Com a Plataforma ARIFA:</h3>
          <div className="flex-1 bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] rounded-xl p-6 text-white">
            <div className="mb-6">
              <span className="text-blue-200 text-sm">Investimento único</span>
              <p className="text-4xl font-bold mt-1">4.888 €</p>
              <span className="text-blue-200 text-sm">Sem subscrições mensais</span>
            </div>
            <div className="space-y-3 border-t border-white/20 pt-4">
              <div className="flex justify-between">
                <span className="text-blue-100">Poupança vs. SaaS (3 anos)</span>
                <span className="font-semibold">~15.000 €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">ROI estimado (1º ano)</span>
                <span className="font-semibold text-green-300">250-350%</span>
              </div>
            </div>
            <div className="mt-6 p-3 bg-white/10 rounded-lg">
              <p className="text-sm text-center">
                💡 Não é um custo. É um investimento que se paga em semanas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SLIDE 10: CONDIÇÕES COMERCIAIS
// ============================================
const SlideTerms = () => {
  const included = [
    "Site público completo",
    "Portal do cliente",
    "Dashboard admin",
    "Automações inteligentes",
    "Segurança & backup",
    "60 dias de suporte bug-fix",
  ];

  const notIncluded = [
    "Conteúdo editorial (textos/fotos adicionais)",
    "Fotografia profissional",
    "Formação avançada (pago separadamente)",
  ];

  return (
    <div className="h-full flex flex-col bg-white p-12">
      <div className="mb-6">
        <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">Termos & Condições</span>
        <h2 className="text-3xl font-light text-[#1e3a5f] mt-2">Como funciona</h2>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6">
        {/* Payment */}
        <div className="bg-slate-50 rounded-xl p-6">
          <h3 className="font-semibold text-[#1e3a5f] mb-4 flex items-center gap-2">
            <Euro className="w-5 h-5" /> Investimento
          </h3>
          <p className="text-3xl font-bold text-[#1e3a5f] mb-4">4.888 €</p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">40% na assinatura</span>
              <span className="font-medium">2.000 €</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200">
              <span className="text-slate-600">40% antes do go-live</span>
              <span className="font-medium">2.000 €</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600">20% após 30 dias</span>
              <span className="font-medium">888 €</span>
            </div>
          </div>
        </div>

        {/* Timeline & Included */}
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-[#1e3a5f] mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Prazo
            </h3>
            <p className="text-2xl font-bold text-[#1e3a5f]">6-8 semanas</p>
            <p className="text-sm text-slate-500 mt-1">Após aprovação do design</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Incluído
            </h3>
            <ul className="space-y-1">
              {included.map((item, i) => (
                <li key={i} className="text-sm text-green-700 flex items-center gap-2">
                  <Check className="w-3 h-3" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Not Included & Optional */}
        <div className="space-y-4">
          <div className="bg-slate-100 rounded-xl p-4">
            <h3 className="font-semibold text-slate-600 mb-3">Não incluído</h3>
            <ul className="space-y-1">
              {notIncluded.map((item, i) => (
                <li key={i} className="text-sm text-slate-500">• {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-700 mb-2">Opcional</h3>
            <p className="text-sm text-purple-600">Manutenção mensal</p>
            <p className="text-lg font-bold text-purple-700">150-250 €/mês</p>
            <p className="text-xs text-purple-500 mt-1">Updates, monitorização, ajustes</p>
          </div>
        </div>
      </div>

      <p className="text-center text-slate-400 text-sm mt-4">
        Simples e claro. Sem surpresas.
      </p>
    </div>
  );
};

// ============================================
// SLIDE 11: PRÓXIMOS PASSOS
// ============================================
const SlideNextSteps = () => {
  const steps = [
    { week: "Hoje", title: "Aprovação + Assinatura", desc: "Decidimos avançar juntos" },
    { week: "Semana 1", title: "Kickoff + Design", desc: "Brainstorm com o designer" },
    { week: "Semana 2-5", title: "Desenvolvimento", desc: "Construção da plataforma" },
    { week: "Semana 6", title: "Testes & Refinamentos", desc: "Feedback e ajustes" },
    { week: "Semana 7-8", title: "Go-Live + Formação", desc: "Lançamento oficial" },
    { week: "Pós-launch", title: "Suporte 60 dias", desc: "Acompanhamento garantido" },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white via-slate-50 to-blue-50 p-12">
      <div className="mb-8 text-center">
        <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">O caminho</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-2">Como começamos?</h2>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-6 gap-2 w-full">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className={`p-4 rounded-xl text-center h-full ${
                i === 0 
                  ? "bg-[#1e3a5f] text-white" 
                  : "bg-white border border-slate-200"
              }`}>
                <span className={`text-xs font-medium ${
                  i === 0 ? "text-blue-200" : "text-[#3D7081]"
                }`}>{step.week}</span>
                <h3 className={`font-semibold text-sm mt-2 ${
                  i === 0 ? "text-white" : "text-[#1e3a5f]"
                }`}>{step.title}</h3>
                <p className={`text-xs mt-1 ${
                  i === 0 ? "text-blue-200" : "text-slate-500"
                }`}>{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3D7081] z-10" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex flex-col items-center gap-4 p-8 bg-white rounded-2xl shadow-lg border border-slate-100">
          <Rocket className="w-10 h-10 text-[#3D7081]" />
          <h3 className="text-2xl font-semibold text-[#1e3a5f]">Pronta para começar, Teresa?</h3>
          <p className="text-slate-500">Assinemos o contrato esta semana.</p>
          <div className="flex gap-3 mt-2">
            <Button className="gap-2 bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white px-6">
              <Phone className="w-4 h-4" />
              Marcar Call
            </Button>
            <Button variant="outline" className="gap-2 border-[#1e3a5f] text-[#1e3a5f]">
              <Mail className="w-4 h-4" />
              Enviar Proposta
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SalesPresentation;
