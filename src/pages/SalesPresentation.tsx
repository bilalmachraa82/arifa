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
  CheckCircle2,
  X,
  Puzzle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ============================================
// ASSINATURA GLOBAL
// ============================================
const GlobalSignature = () => (
  <div className="absolute bottom-3 right-4 text-xs text-slate-400">
    AiParaTi | Plataforma ARIFA | Design: Helder Faria
  </div>
);

const SalesPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalSlides = 12; // Atualizado de 11 para 12

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
              {currentSlide === 4 && <SlideComparison />}
              {currentSlide === 5 && <SlidePublicSite />}
              {currentSlide === 6 && <SlideClientPortal />}
              {currentSlide === 7 && <SlideAdminDashboard />}
              {currentSlide === 8 && <SlideAutomations />}
              {currentSlide === 9 && <SlideValue />}
              {currentSlide === 10 && <SlideTerms />}
              {currentSlide === 11 && <SlideNextSteps />}
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
// SLIDE 1: CAPA (com marca AiParaTi)
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

    {/* AiParaTi Badge - Topo esquerdo */}
    <div className="absolute top-6 left-6 flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
        <span className="text-white font-bold text-xs">Ai</span>
      </div>
      <span className="text-sm font-medium text-slate-500">AiParaTi</span>
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
      <p className="text-2xl text-slate-600 font-light mt-2">
        Para o teu estúdio de arquitetura
      </p>
      <p className="text-xl text-slate-500 font-light mt-4">
        Transformar em 6-8 semanas
      </p>
      
      {/* Rodapé com créditos */}
      <div className="mt-12 flex flex-col items-center gap-2">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
          <span>Use as setas ←→ para navegar</span>
          <span className="mx-2">•</span>
          <span>F para fullscreen</span>
        </div>
        <p className="text-xs text-slate-400 mt-4">
          Proposição por <span className="font-medium text-[#1e3a5f]">AiParaTi</span> | Design por <span className="font-medium text-[#1e3a5f]">Helder Faria</span>
        </p>
      </div>
    </div>
    
    <GlobalSignature />
  </div>
);

// ============================================
// SLIDE 2: O PROBLEMA (reorganizado em blocos)
// ============================================
const SlideProblem = () => {
  const problemBlocks = [
    {
      title: "COMUNICAÇÃO",
      items: [
        { icon: Mail, text: "Demasiados emails e WhatsApps com clientes" },
        { icon: FolderOpen, text: "Projetos espalhados por email, drives e cadernos" },
      ]
    },
    {
      title: "GESTÃO",
      items: [
        { icon: FileText, text: "Processo de briefing desorganizado" },
        { icon: Clock, text: "Muito tempo a fazer follow-ups manuais" },
      ]
    },
    {
      title: "NEGÓCIO",
      items: [
        { icon: Users, text: "Difícil mostrar trabalho anterior e prova social" },
        { icon: Euro, text: "Não consegues demonstrar claramente o valor do teu trabalho" },
      ]
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white p-12 relative">
      <div className="mb-6">
        <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">Teresa, sabemos que...</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-2">Onde estás hoje</h2>
        <p className="text-slate-500 mt-3 text-sm italic">
          A AiParaTi viu isto dezenas de vezes em estúdios como o teu. Não estás sozinha nestes desafios:
        </p>
      </div>
      
      <div className="flex-1 grid grid-cols-3 gap-6 content-center">
        {problemBlocks.map((block, blockIndex) => (
          <motion.div
            key={blockIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: blockIndex * 0.15 }}
            className="bg-slate-50 rounded-xl p-5 border border-slate-100"
          >
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">{block.title}</h3>
            <div className="space-y-4">
              {block.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-red-400" />
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-slate-400 text-sm mt-4">
        Isto é comum no teu setor. Mas não tem de ser assim.
      </p>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 3: A SOLUÇÃO (com assinatura AiParaTi)
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
    <div className="h-full flex flex-col bg-white p-12 relative">
      <div className="mb-6">
        <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">A solução</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-2">O que tu vais ter <span className="text-lg text-slate-400">(entregue por AiParaTi)</span></h2>
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

      {/* Rodapé com créditos */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-400">
          Tudo isto desenvolvido, integrado e entregue por <span className="font-medium text-[#1e3a5f]">AiParaTi</span> com design visual por <span className="font-medium text-[#1e3a5f]">Helder Faria</span>
        </p>
      </div>
      
      <GlobalSignature />
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
    <div className="h-full flex flex-col bg-white p-12 relative">
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
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 5: NOVO - COMPARAÇÃO MERCADO vs ARIFA
// ============================================
const SlideComparison = () => {
  const traditionalTools = [
    { name: "Website Premium", cost: "1.680 €" },
    { name: "Portal Cliente", cost: "648 €" },
    { name: "CRM", cost: "1.368 €" },
    { name: "Gestão Docs", cost: "660 €" },
    { name: "Assinaturas", cost: "360 €" },
    { name: "Chat/Email", cost: "696 €" },
    { name: "Analytics + IA", cost: "480 €" },
    { name: "PWA Mobile", cost: "12.000 €" },
    { name: "Segurança", cost: "1.440 €" },
    { name: "Multi-idioma", cost: "600 €" },
    { name: "Integrações", cost: "432 €" },
  ];

  const arifaBenefits = [
    "Tudo integrado em 1 plataforma",
    "100% à medida do teu estúdio",
    "Sem subscrições mensais",
    "Suporte direto AiParaTi",
  ];

  return (
    <div className="h-full flex flex-col bg-white p-8 relative">
      <div className="mb-4">
        <span className="text-xs font-medium text-[#3D7081] uppercase tracking-wider">Comparação</span>
        <h2 className="text-2xl font-light text-[#1e3a5f] mt-1">Outras soluções vs. Solução integrada</h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* Coluna esquerda: Ferramentas separadas */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <h3 className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <X className="w-3 h-3" /> Abordagem Tradicional
          </h3>
          <div className="bg-red-50 rounded-xl p-4 flex-1 border border-red-100">
            <div className="grid grid-cols-2 gap-1">
              {traditionalTools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex justify-between items-center py-1.5 px-2 bg-white rounded text-xs"
                >
                  <span className="text-slate-600 flex items-center gap-1">
                    <X className="w-2.5 h-2.5 text-red-400" />
                    {tool.name}
                  </span>
                  <span className="text-red-600 font-medium">{tool.cost}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-red-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-red-700 text-sm">TOTAL/ANO</span>
                <span className="font-bold text-red-700 text-lg">~20.364 €</span>
              </div>
              <p className="text-xs text-red-500 mt-1">+ tempo a integrar manualmente</p>
            </div>
          </div>
        </motion.div>

        {/* Coluna direita: ARIFA */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          <h3 className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Check className="w-3 h-3" /> Solução ARIFA (por AiParaTi)
          </h3>
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] rounded-xl p-4 flex-1 text-white">
            <div className="space-y-2 mb-4">
              {arifaBenefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-2 py-1"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-300 flex-shrink-0" />
                  <span className="text-blue-100 text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
            <div className="pt-3 border-t border-white/20">
              <span className="text-blue-200 text-xs">Investimento único</span>
              <p className="text-3xl font-bold mt-1">4.888 €</p>
              <div className="mt-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-green-300 font-medium text-sm">Poupança: ~56.000 € em 3 anos</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Destaque de integração */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center gap-3"
      >
        <Puzzle className="w-6 h-6 text-[#1e3a5f] flex-shrink-0" />
        <p className="text-[#1e3a5f] text-xs">
          <span className="font-semibold">A grande diferença?</span> Tudo funciona junto. Sem ferramentas soltas, sem dados espalhados. 
          Isto é o que a <span className="font-semibold">AiParaTi</span> traz: integração + customização.
        </p>
      </motion.div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 6: SITE PÚBLICO (renumerado de 5)
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
    <div className="h-full flex flex-col bg-white p-12 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">Funcionalidade 1</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Site Público</h2>
        </div>
        {/* Badge AiParaTi */}
        <div className="px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
          <span className="text-xs font-medium text-[#1e3a5f]">Entregue por AiParaTi</span>
        </div>
      </div>
      <p className="text-xl text-slate-500 mb-6">O teu cartão de visita digital</p>

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
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-[#1e3a5f] text-sm font-medium">
            💡 Otimizado para Google — os teus clientes encontram-te quando procuram.
          </p>
        </div>
      </div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 7: PORTAL CLIENTE (renumerado de 6)
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
    <div className="h-full flex flex-col bg-white p-12 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">Funcionalidade 2</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Portal Privado</h2>
        </div>
        {/* Badge AiParaTi */}
        <div className="px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
          <span className="text-xs font-medium text-[#1e3a5f]">Entregue por AiParaTi</span>
        </div>
      </div>
      <p className="text-xl text-slate-500 mb-6">O controlo total sobre a experiência do cliente</p>

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
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-[#1e3a5f] text-sm font-medium">
            🔒 O cliente vê exatamente o que precisa saber, nada mais. Tu decides o que é visível.
          </p>
        </div>
      </div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 8: DASHBOARD ADMIN (renumerado de 7)
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
    <div className="h-full flex flex-col bg-white p-12 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#1e3a5f] flex items-center justify-center">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium text-[#3D7081] uppercase tracking-wider">Funcionalidade 3</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Dashboard Admin</h2>
        </div>
        {/* Badge AiParaTi */}
        <div className="px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
          <span className="text-xs font-medium text-[#1e3a5f]">Entregue por AiParaTi</span>
        </div>
      </div>
      <p className="text-xl text-slate-500 mb-6">O teu painel de comando</p>

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
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-[#1e3a5f] text-sm font-medium">
            📊 Tudo que precisas para gerir a empresa com um golpe de vista.
          </p>
        </div>
      </div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 9: AUTOMAÇÕES (renumerado de 8)
// ============================================
const SlideAutomations = () => {
  const features = [
    "Follow-ups automáticos (cliente não aprovou em 5 dias? Lembrete)",
    "Notificações smart (Teresa + clientes sabem do que é preciso)",
    "Geração automática de documentos (relatórios, checklists)",
    "IA integrada (sugestões de melhoria, análise de feedbacks)",
  ];

  return (
    <div className="h-full flex flex-col bg-white p-10 relative">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-medium text-[#3D7081] uppercase tracking-wider">Funcionalidade 4</span>
          <h2 className="text-2xl font-light text-[#1e3a5f]">Automações Inteligentes</h2>
        </div>
        {/* Badge AiParaTi */}
        <div className="px-2 py-1 bg-blue-50 rounded-full border border-blue-100">
          <span className="text-xs font-medium text-[#1e3a5f]">Entregue por AiParaTi</span>
        </div>
      </div>
      <p className="text-lg text-slate-500 mb-4">O trabalho invisível</p>

      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 p-4 rounded-lg bg-slate-50"
            >
              <Check className="w-5 h-5 text-[#3D7081] flex-shrink-0" />
              <p className="text-slate-700">{feature}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <p className="text-[#1e3a5f] text-sm font-medium">
            ⚡ Estas automações funcionam 24/7. Tu dormes, elas trabalham.
          </p>
        </div>
      </div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 10: VALOR FINANCEIRO (expandido)
// ============================================
const SlideValue = () => {
  const included = [
    "Site público (domínio + hospedagem 1 ano)",
    "Portal privado para clientes",
    "Dashboard admin completo",
    "Integrações (email, automações, IA)",
    "Segurança RGPD/LGPD",
    "60 dias suporte pós-launch",
    "Design visual Helder Faria",
  ];

  const notIncluded = [
    "Conteúdo editorial",
    "Fotos/renders",
    "Formação avançada",
    "Manutenção (150-250 €/mês)",
  ];

  return (
    <div className="h-full flex flex-col bg-white p-8 relative">
      <div className="mb-3">
        <span className="text-xs font-medium text-[#3D7081] uppercase tracking-wider">Análise financeira</span>
        <h2 className="text-2xl font-light text-[#1e3a5f] mt-1">O investimento vs. O custo de não fazer nada</h2>
      </div>

      {/* Resumo Executivo */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200"
      >
        <p className="text-green-800 text-xs">
          <span className="font-semibold">Resumo:</span> No mercado, pagarias ~20.364 €/ano por soluções dispersas. 
          Com a <span className="font-semibold">ARIFA</span>, investes <span className="font-bold">4.888 € uma vez</span> e ficas com tudo à medida.
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-3 gap-3">
        {/* Investimento */}
        <div className="bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] rounded-xl p-4 text-white">
          <span className="text-blue-200 text-xs uppercase tracking-wider">Investimento único</span>
          <p className="text-3xl font-bold mt-1">4.888 €</p>
          <p className="text-blue-200 text-xs">Sem subscrições mensais</p>
          
          <div className="mt-3 pt-2 border-t border-white/20 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-blue-100">Poupança vs. SaaS (3 anos)</span>
              <span className="font-semibold">~56.000 €</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-blue-100">Tempo poupado/ano</span>
              <span className="font-semibold">200h</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-blue-100">Valor do tempo (40€/h)</span>
              <span className="font-semibold">8.000 €</span>
            </div>
          </div>
          
          <div className="mt-3 p-2 bg-white/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-xs">ROI 1º ano</span>
              <span className="text-base font-bold text-green-300">~318%</span>
            </div>
            <p className="text-xs text-blue-200">Paga-se em ~3 meses</p>
          </div>
        </div>

        {/* Incluído */}
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <h3 className="font-semibold text-green-700 text-xs mb-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> INCLUÍDO pelos 4.888 €
          </h3>
          <ul className="space-y-1.5">
            {included.map((item, i) => (
              <li key={i} className="text-xs text-green-700 flex items-start gap-1.5">
                <Check className="w-3 h-3 mt-0.5 flex-shrink-0" /> 
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Não Incluído */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <h3 className="font-semibold text-slate-600 text-xs mb-2 flex items-center gap-1">
            <X className="w-3 h-3" /> FORA DE ESCOPO
          </h3>
          <ul className="space-y-1.5">
            {notIncluded.map((item, i) => (
              <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                <X className="w-3 h-3 mt-0.5 flex-shrink-0 text-slate-400" /> 
                <span>{item}</span>
              </li>
            ))}
          </ul>
          
          <div className="mt-3 pt-2 border-t border-slate-200">
            <p className="text-xs text-slate-500 italic">
              Contratados separadamente se necessário.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 11: CONDIÇÕES COMERCIAIS (expandido)
// ============================================
const SlideTerms = () => {
  const included = [
    "Site público completo",
    "Portal do cliente",
    "Dashboard admin",
    "Automações",
    "Segurança & backup",
    "60 dias suporte",
  ];

  const notIncluded = [
    "Conteúdo editorial",
    "Fotografia",
    "Formação avançada",
  ];

  return (
    <div className="h-full flex flex-col bg-white p-8 relative">
      <div className="mb-3">
        <span className="text-xs font-medium text-[#3D7081] uppercase tracking-wider">Termos & Condições</span>
        <h2 className="text-2xl font-light text-[#1e3a5f] mt-1">Como funciona</h2>
        <p className="text-xs text-slate-500">
          Proposta de <span className="font-medium text-[#1e3a5f]">AiParaTi</span> | Parceria com <span className="font-medium text-[#1e3a5f]">Helder Faria</span>
        </p>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4">
        {/* Payment */}
        <div className="bg-slate-50 rounded-xl p-4">
          <h3 className="font-semibold text-[#1e3a5f] mb-2 flex items-center gap-2 text-sm">
            <Euro className="w-4 h-4" /> Investimento
          </h3>
          <p className="text-2xl font-bold text-[#1e3a5f] mb-3">4.888 €</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-200">
              <span className="text-slate-600">40% assinatura</span>
              <span className="font-medium">1.955 €</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-200">
              <span className="text-slate-600">40% go-live</span>
              <span className="font-medium">1.955 €</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-600">20% após 30 dias</span>
              <span className="font-medium">978 €</span>
            </div>
          </div>
          
          {/* Quem entrega */}
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-xs text-slate-500">
              <span className="font-medium">Quem entrega:</span> AiParaTi + Helder Faria
            </p>
          </div>
        </div>

        {/* Timeline & Included */}
        <div className="space-y-3">
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-[#1e3a5f] mb-1 flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" /> Prazo
            </h3>
            <p className="text-xl font-bold text-[#1e3a5f]">6-8 semanas</p>
            <p className="text-xs text-slate-500">Após aprovação design</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-1 text-xs">
              <CheckCircle2 className="w-3 h-3" /> Incluído
            </h3>
            <ul className="space-y-1">
              {included.map((item, i) => (
                <li key={i} className="text-xs text-green-700 flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Not Included & Optional */}
        <div className="space-y-3">
          <div className="bg-slate-100 rounded-xl p-3">
            <h3 className="font-semibold text-slate-600 mb-2 text-xs">Não incluído</h3>
            <ul className="space-y-1">
              {notIncluded.map((item, i) => (
                <li key={i} className="text-xs text-slate-500">• {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
            <h3 className="font-semibold text-purple-700 mb-1 text-xs">Opcional</h3>
            <p className="text-xs text-purple-600">Manutenção mensal</p>
            <p className="text-base font-bold text-purple-700">150-250 €/mês</p>
            <p className="text-xs text-purple-500">Updates, monitorização</p>
          </div>
        </div>
      </div>

      <p className="text-center text-slate-400 text-xs mt-3">
        Simples e claro. Sem surpresas.
      </p>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 12: PRÓXIMOS PASSOS (com contacto)
// ============================================
const SlideNextSteps = () => {
  const steps = [
    { week: "Hoje", title: "Aprovação", desc: "Avançamos" },
    { week: "Sem. 1", title: "Kickoff", desc: "Design c/ Helder" },
    { week: "Sem. 2-5", title: "Dev", desc: "Construção" },
    { week: "Sem. 6", title: "Testes", desc: "Feedback" },
    { week: "Sem. 7-8", title: "Go-Live", desc: "Lançamento" },
    { week: "Pós", title: "Suporte", desc: "60 dias" },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white via-slate-50 to-blue-50 p-8 relative">
      <div className="mb-4 text-center">
        <span className="text-xs font-medium text-[#3D7081] uppercase tracking-wider">O caminho</span>
        <h2 className="text-3xl font-light text-[#1e3a5f] mt-1">Como começamos?</h2>
      </div>

      <div className="flex items-center justify-center">
        <div className="grid grid-cols-6 gap-1.5 w-full">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className={`p-3 rounded-lg text-center h-full ${
                i === 0 
                  ? "bg-[#1e3a5f] text-white" 
                  : "bg-white border border-slate-200"
              }`}>
                <span className={`text-xs font-medium ${
                  i === 0 ? "text-blue-200" : "text-[#3D7081]"
                }`}>{step.week}</span>
                <h3 className={`font-semibold text-xs mt-1 ${
                  i === 0 ? "text-white" : "text-[#1e3a5f]"
                }`}>{step.title}</h3>
                <p className={`text-xs ${
                  i === 0 ? "text-blue-200" : "text-slate-500"
                }`}>{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#3D7081] z-10" />
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
        className="mt-4 text-center flex-1 flex items-center justify-center"
      >
        <div className="inline-flex flex-col items-center gap-3 p-5 bg-white rounded-2xl shadow-lg border border-slate-100">
          <Rocket className="w-8 h-8 text-[#3D7081]" />
          <h3 className="text-xl font-semibold text-[#1e3a5f]">Pronta para começar, Teresa?</h3>
          <p className="text-slate-500 text-sm">Assinemos o contrato esta semana.</p>
          <div className="flex gap-2 mt-1">
            <Button size="sm" className="gap-1.5 bg-[#1e3a5f] hover:bg-[#2a4a6f] text-white px-4">
              <Phone className="w-3.5 h-3.5" />
              Marcar Call
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 border-[#1e3a5f] text-[#1e3a5f]">
              <Mail className="w-3.5 h-3.5" />
              Enviar Proposta
            </Button>
          </div>
          
          {/* Contactos */}
          <div className="mt-2 pt-2 border-t border-slate-100 w-full text-center">
            <p className="text-xs text-slate-400">
              Questões? <span className="font-medium text-[#1e3a5f]">AiParaTi</span> | Design: <span className="font-medium text-[#1e3a5f]">Helder Faria</span>
            </p>
          </div>
        </div>
      </motion.div>
      
      <GlobalSignature />
    </div>
  );
};

export default SalesPresentation;
