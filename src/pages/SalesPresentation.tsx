import { useState, useEffect, useCallback, useRef } from "react";
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
  TrendingUp,
  Download,
  Loader2,
  AlertCircle,
  Timer,
  Target,
  TrendingDown,
  Eye,
  MonitorPlay,
  Sparkles,
  PlayCircle,
  Settings,
  Award,
  HelpCircle,
  Lightbulb,
  Layers,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import heroBg from "@/assets/presentation-hero-bg.jpg";

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
  const [isExporting, setIsExporting] = useState(false);
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const totalSlides = 14;

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

  // Export to PDF function - with proper wait for animations
  const exportToPDF = useCallback(async () => {
    if (!slideContainerRef.current || isExporting) return;
    
    setIsExporting(true);
    toast.info("A gerar PDF... Aguarda enquanto cada slide é capturado.");
    
    const originalSlide = currentSlide;
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [1920, 1080]
    });

    try {
      for (let i = 0; i < totalSlides; i++) {
        setCurrentSlide(i);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        if (slideContainerRef.current) {
          slideContainerRef.current.style.opacity = '0.99';
          await new Promise(resolve => requestAnimationFrame(resolve));
          slideContainerRef.current.style.opacity = '1';
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        const canvas = await html2canvas(slideContainerRef.current!, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          imageTimeout: 5000,
          onclone: (clonedDoc) => {
            const motionElements = clonedDoc.querySelectorAll('[style*="opacity"]');
            motionElements.forEach((el) => {
              (el as HTMLElement).style.opacity = '1';
              (el as HTMLElement).style.transform = 'none';
            });
          }
        });
        
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        
        if (i > 0) {
          pdf.addPage([1920, 1080], "landscape");
        }
        
        pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080);
        toast.info(`Slide ${i + 1} de ${totalSlides} capturado...`);
      }
      
      pdf.save("ARIFA-Proposta-Comercial.pdf");
      toast.success("PDF exportado com sucesso! Todos os 14 slides incluídos.");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar PDF. Tenta novamente.");
    } finally {
      setCurrentSlide(originalSlide);
      setIsExporting(false);
    }
  }, [currentSlide, isExporting, totalSlides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isExporting) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setDirection(1);
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setDirection(-1);
        prevSlide();
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullscreen, isFullscreen, isExporting]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.98,
    }),
  };

  const handleNextSlide = useCallback(() => {
    setDirection(1);
    nextSlide();
  }, [nextSlide]);

  const handlePrevSlide = useCallback(() => {
    setDirection(-1);
    prevSlide();
  }, [prevSlide]);

  const handleSlideClick = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Export Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 className="w-12 h-12 text-[#1e3a5f] animate-spin" />
            <p className="text-lg font-medium text-slate-700">A gerar PDF...</p>
            <p className="text-sm text-slate-500">Slide {currentSlide + 1} de {totalSlides}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div 
          ref={slideContainerRef}
          className="w-full max-w-6xl aspect-[16/9] bg-white rounded-lg shadow-2xl overflow-hidden relative"
        >
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial={isExporting ? false : "enter"}
              animate="center"
              exit={isExporting ? undefined : "exit"}
              transition={isExporting ? { duration: 0 } : {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
              }}
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
              {currentSlide === 9 && <SlidePricing />}
              {currentSlide === 10 && <SlideTerms />}
              {currentSlide === 11 && <SlideFAQ />}
              {currentSlide === 12 && <SlideTimeline />}
              {currentSlide === 13 && <SlideNextSteps />}
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
                onClick={() => handleSlideClick(i)}
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
              onClick={exportToPDF}
              disabled={isExporting}
              className="gap-1 border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevSlide}
              disabled={currentSlide === 0 || isExporting}
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
              onClick={handleNextSlide}
              disabled={currentSlide === totalSlides - 1 || isExporting}
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
// SLIDE 1: CAPA PREMIUM COM HERO IMAGE
// ============================================
const SlideCover = () => (
  <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
    {/* Hero Background Image */}
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/90 via-[#1e3a5f]/85 to-[#3D7081]/80" />
    
    {/* Geometric Pattern Overlay */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rotate-45" />
      <div className="absolute top-20 left-20 w-24 h-24 border border-white/20 rotate-45" />
      <div className="absolute bottom-10 right-10 w-40 h-40 border border-white/30 rotate-12" />
      <div className="absolute bottom-20 right-24 w-28 h-28 border border-white/20 rotate-12" />
    </div>

    {/* AiParaTi Badge - Topo esquerdo */}
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-6 left-6 flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
    >
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
        <span className="text-[#1e3a5f] font-bold text-xs">Ai</span>
      </div>
      <span className="text-sm font-medium text-white/90">AiParaTi</span>
    </motion.div>

    {/* Content */}
    <div className="text-center z-10 px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-20 h-20 mx-auto mb-8 border-2 border-white/80 rotate-45 flex items-center justify-center shadow-2xl bg-white/10 backdrop-blur-sm">
          <span className="text-white font-bold text-2xl -rotate-45">A</span>
        </div>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl md:text-6xl font-light text-white mb-4 tracking-tight"
      >
        Plataforma Digital <span className="font-semibold">ARIFA</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl text-white/80 font-light mt-2"
      >
        Para o teu estúdio de arquitetura
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
      >
        <Timer className="w-5 h-5 text-white/70" />
        <span className="text-xl text-white/90 font-light">
          Transformar em 6-8 semanas
        </span>
      </motion.div>
      
      {/* Rodapé com créditos */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 flex flex-col items-center gap-3"
      >
        <div className="flex items-center justify-center gap-4 text-sm text-white/60">
          <span className="flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            navegar
          </span>
          <span className="text-white/40">•</span>
          <span>F para fullscreen</span>
        </div>
        <p className="text-xs text-white/50 mt-2">
          Proposição por <span className="font-medium text-white/70">AiParaTi</span> | Design por <span className="font-medium text-white/70">Helder Faria</span>
        </p>
      </motion.div>
    </div>
    
    <div className="absolute bottom-3 right-4 text-xs text-white/40">
      AiParaTi | Plataforma ARIFA | Design: Helder Faria
    </div>
  </div>
);

// ============================================
// SLIDE 2: O PROBLEMA (Grid premium com cores)
// ============================================
const SlideProblem = () => {
  const problemBlocks = [
    {
      title: "COMUNICAÇÃO",
      color: "from-rose-50 to-rose-100",
      borderColor: "border-rose-200",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-500",
      items: [
        { icon: Mail, text: "Demasiados emails e WhatsApps com clientes" },
        { icon: AlertCircle, text: "Informação dispersa e difícil de encontrar" },
      ]
    },
    {
      title: "GESTÃO",
      color: "from-sky-50 to-sky-100",
      borderColor: "border-sky-200",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-500",
      items: [
        { icon: FolderOpen, text: "Projetos espalhados por email, drives e cadernos" },
        { icon: FileText, text: "Processo de briefing desorganizado" },
      ]
    },
    {
      title: "TEMPO",
      color: "from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-500",
      items: [
        { icon: Clock, text: "2h/dia em follow-ups manuais" },
        { icon: Timer, text: "Sem automações de tarefas repetitivas" },
      ]
    },
    {
      title: "VISIBILIDADE",
      color: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      items: [
        { icon: Eye, text: "Clientes não sabem o estado do projeto" },
        { icon: Target, text: "Falta de transparência no progresso" },
      ]
    },
    {
      title: "NEGÓCIO",
      color: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-500",
      items: [
        { icon: Users, text: "Difícil mostrar trabalho anterior" },
        { icon: TrendingDown, text: "Sem portfólio profissional online" },
      ]
    },
    {
      title: "VALOR",
      color: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-500",
      items: [
        { icon: Euro, text: "Difícil demonstrar o valor do trabalho" },
        { icon: TrendingUp, text: "Clientes não entendem o processo" },
      ]
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-slate-50 p-8 relative">
      <div className="mb-4">
        <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Teresa, sabemos que...</span>
        <h2 className="text-3xl font-light text-[#1e3a5f] mt-3">Onde estás hoje</h2>
        <p className="text-slate-500 mt-2 text-sm">
          A AiParaTi viu isto dezenas de vezes em estúdios como o teu. Não estás sozinha:
        </p>
      </div>
      
      <div className="flex-1 grid grid-cols-3 gap-4 content-center">
        {problemBlocks.map((block, blockIndex) => (
          <motion.div
            key={blockIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: blockIndex * 0.08 }}
            className={`bg-gradient-to-br ${block.color} rounded-2xl p-4 border ${block.borderColor} shadow-sm hover:shadow-md transition-shadow`}
          >
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${block.iconBg}`} />
              {block.title}
            </h3>
            <div className="space-y-3">
              {block.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${block.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <item.icon className={`w-4 h-4 ${block.iconColor}`} />
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-slate-500 text-sm mt-4 bg-white/50 py-2 rounded-lg"
      >
        Isto é comum no teu setor. <span className="font-medium text-[#1e3a5f]">Mas não tem de ser assim.</span>
      </motion.p>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 3: A SOLUÇÃO (Ícones grandes + descrições)
// ============================================
const SlideSolution = () => {
  const solutions = [
    { 
      icon: Globe, 
      title: "Site Público", 
      desc: "Portfólio + Credibilidade",
      detail: "Mostra o teu trabalho ao mundo com SEO otimizado"
    },
    { 
      icon: Lock, 
      title: "Portal Privado", 
      desc: "Para os teus clientes",
      detail: "Tudo num só lugar, organizado e acessível"
    },
    { 
      icon: LayoutDashboard, 
      title: "Dashboard Admin", 
      desc: "Gestão centralizada",
      detail: "Controla tudo de um único painel"
    },
    { 
      icon: Zap, 
      title: "Automações", 
      desc: "Trabalho invisível",
      detail: "Follow-ups e notificações automáticas"
    },
    { 
      icon: Shield, 
      title: "Segurança", 
      desc: "Dados protegidos",
      detail: "Backup automático e RGPD compliant"
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white via-blue-50/30 to-white p-8 relative">
      <div className="mb-6">
        <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">A solução</span>
        <h2 className="text-3xl font-light text-[#1e3a5f] mt-3">
          O que tu vais ter
        </h2>
        <p className="text-slate-500 text-sm mt-1">Entregue por AiParaTi + Helder Faria</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-5 w-full">
          {solutions.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-slate-100 shadow-lg hover:shadow-xl transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-[#1e3a5f] text-sm mb-1">{item.title}</h3>
              <p className="text-[#3D7081] text-xs font-medium mb-2">{item.desc}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4 text-center"
      >
        <p className="text-xs text-slate-400 bg-slate-50 inline-flex items-center gap-2 px-4 py-2 rounded-full">
          <Sparkles className="w-3 h-3 text-[#3D7081]" />
          Tudo desenvolvido, integrado e entregue por <span className="font-medium text-[#1e3a5f]">AiParaTi</span>
        </p>
      </motion.div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 4: TRANSFORMAÇÃO (Antes/Depois melhorado)
// ============================================
const SlideTransformation = () => {
  const comparisons = [
    { 
      before: "Gerir 5 projetos em 5 lugares diferentes", 
      after: "Um único hub centralizado",
      iconBefore: FolderOpen,
      iconAfter: LayoutDashboard
    },
    { 
      before: "2h/dia em emails e follow-ups", 
      after: "20 minutos automático",
      iconBefore: Clock,
      iconAfter: Zap
    },
    { 
      before: "Clientes à deriva sem saber o progresso", 
      after: "Portal com progresso em tempo real",
      iconBefore: AlertCircle,
      iconAfter: Eye
    },
    { 
      before: "Vendas apenas por 'boca a boca'", 
      after: "Portfolio que vende por ti 24/7",
      iconBefore: Users,
      iconAfter: Globe
    },
    { 
      before: "Documentos no Drive desordenado", 
      after: "Organização 100% clara",
      iconBefore: FileText,
      iconAfter: Layers
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white p-8 relative">
      <div className="mb-6">
        <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">A transformação</span>
        <h2 className="text-3xl font-light text-[#1e3a5f] mt-3">O que muda para ti</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-3">
        {comparisons.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="grid grid-cols-[1fr,auto,1fr] gap-4 items-center"
          >
            {/* Before */}
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-l-4 border-red-400 rounded-r-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <item.iconBefore className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-slate-600 text-sm">{item.before}</p>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>
            
            {/* After */}
            <div className="bg-gradient-to-r from-green-100/50 to-green-50 border-r-4 border-green-500 rounded-l-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <item.iconAfter className="w-5 h-5 text-green-600" />
              </div>
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
// SLIDE 5: COMPARAÇÃO MERCADO
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
        <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Comparação</span>
        <h2 className="text-2xl font-light text-[#1e3a5f] mt-3">Outras soluções vs. Solução integrada</h2>
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
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-4 flex-1 border border-red-200">
            <div className="grid grid-cols-2 gap-1">
              {traditionalTools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex justify-between items-center py-1.5 px-2 bg-white rounded-lg text-xs shadow-sm"
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
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] rounded-2xl p-4 flex-1 text-white shadow-xl">
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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-center gap-3"
      >
        <Puzzle className="w-6 h-6 text-[#1e3a5f] flex-shrink-0" />
        <p className="text-[#1e3a5f] text-xs">
          <span className="font-semibold">A grande diferença?</span> Tudo funciona junto. Sem ferramentas soltas, sem dados espalhados.
        </p>
      </motion.div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 6: SITE PÚBLICO (com área mockup)
// ============================================
const SlidePublicSite = () => {
  const features = [
    "Portfólio com filtros (tipo, localização, tema)",
    "Galeria profissional (high-res, rápida, mobile)",
    "Sobre a Teresa & equipa (storytelling)",
    "Blog/News (para SEO + autoridade)",
    "Formulário inteligente → direto para admin",
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-blue-50/30 p-6 relative">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <Globe className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 1</span>
          <h2 className="text-2xl font-light text-[#1e3a5f]">Site Público</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-5">
        {/* Área do Mockup */}
        <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-6">
          <MonitorPlay className="w-16 h-16 text-slate-300 mb-4" />
          <p className="text-slate-400 text-center font-medium">Visualização da plataforma</p>
          <p className="text-slate-300 text-sm text-center mt-1">Mockup em desenvolvimento</p>
          <div className="mt-4 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-300" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
            <div className="w-3 h-3 rounded-full bg-slate-200" />
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-sm">O teu cartão de visita digital</p>
          <div className="space-y-2.5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#3D7081]" />
                </div>
                <p className="text-slate-700 text-sm">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-[#1e3a5f] text-xs font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Otimizado para Google — os teus clientes encontram-te.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 7: PORTAL CLIENTE (com área mockup)
// ============================================
const SlideClientPortal = () => {
  const features = [
    "Briefing estruturado (formulário configurável)",
    "Galeria de progresso (uploads, renders, aprovações)",
    "Timeline do projeto (marcos, datas)",
    "Documentos centralizados (PDFs, especificações)",
    "Notificações automáticas",
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-purple-50/30 p-6 relative">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 2</span>
          <h2 className="text-2xl font-light text-[#1e3a5f]">Portal Privado</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-5">
        {/* Área do Mockup */}
        <div className="bg-gradient-to-br from-purple-100/50 to-purple-50 rounded-2xl border-2 border-dashed border-purple-200 flex flex-col items-center justify-center p-6">
          <Lock className="w-16 h-16 text-purple-200 mb-4" />
          <p className="text-purple-400 text-center font-medium">Portal do Cliente</p>
          <p className="text-purple-300 text-sm text-center mt-1">Mockup em desenvolvimento</p>
          <div className="mt-4 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-300" />
            <div className="w-3 h-3 rounded-full bg-purple-200" />
            <div className="w-3 h-3 rounded-full bg-purple-200" />
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-sm">Controlo total sobre a experiência do cliente</p>
          <div className="space-y-2.5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-slate-700 text-sm">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <p className="text-purple-700 text-xs font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              O cliente vê só o que precisa. Tu decides o que é visível.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 8: DASHBOARD ADMIN (com área mockup)
// ============================================
const SlideAdminDashboard = () => {
  const features = [
    "Visão de todos os projetos (status, datas)",
    "Gestão de clientes (histórico, contratos)",
    "Biblioteca de documentos (templates)",
    "Automações configuráveis (sem código)",
    "Relatórios (projetos/mês, valor médio)",
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-emerald-50/30 p-6 relative">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <LayoutDashboard className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 3</span>
          <h2 className="text-2xl font-light text-[#1e3a5f]">Dashboard Admin</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-5">
        {/* Área do Mockup */}
        <div className="bg-gradient-to-br from-emerald-100/50 to-emerald-50 rounded-2xl border-2 border-dashed border-emerald-200 flex flex-col items-center justify-center p-6">
          <Settings className="w-16 h-16 text-emerald-200 mb-4" />
          <p className="text-emerald-500 text-center font-medium">Painel Administrativo</p>
          <p className="text-emerald-300 text-sm text-center mt-1">Mockup em desenvolvimento</p>
          <div className="mt-4 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-300" />
            <div className="w-3 h-3 rounded-full bg-emerald-200" />
            <div className="w-3 h-3 rounded-full bg-emerald-200" />
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-sm">O teu painel de comando</p>
          <div className="space-y-2.5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-slate-700 text-sm">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
            <p className="text-emerald-700 text-xs font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              Tudo que precisas para gerir a empresa com um golpe de vista.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 9: AUTOMAÇÕES (com área mockup)
// ============================================
const SlideAutomations = () => {
  const features = [
    "Follow-ups automáticos (5 dias sem resposta? Lembrete)",
    "Notificações smart (Teresa + clientes sabem tudo)",
    "Geração automática de documentos",
    "IA integrada (sugestões, análise de feedbacks)",
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-amber-50/30 p-6 relative">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <Zap className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 4</span>
          <h2 className="text-2xl font-light text-[#1e3a5f]">Automações Inteligentes</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-5">
        {/* Área do Mockup */}
        <div className="bg-gradient-to-br from-amber-100/50 to-amber-50 rounded-2xl border-2 border-dashed border-amber-200 flex flex-col items-center justify-center p-6">
          <Zap className="w-16 h-16 text-amber-200 mb-4" />
          <p className="text-amber-500 text-center font-medium">Sistema de Automações</p>
          <p className="text-amber-300 text-sm text-center mt-1">Mockup em desenvolvimento</p>
          <div className="mt-4 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-300" />
            <div className="w-3 h-3 rounded-full bg-amber-200" />
            <div className="w-3 h-3 rounded-full bg-amber-200" />
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-sm">O trabalho invisível que liberta o teu tempo</p>
          <div className="space-y-2.5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-slate-700 text-sm">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
            <p className="text-amber-700 text-xs font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Estas automações funcionam 24/7. Tu dormes, elas trabalham.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 10: PRICING - 3 TIERS (melhorado)
// ============================================
const SlidePricing = () => {
  const tiers = [
    {
      name: "Essencial",
      price: "3.500",
      description: "Para quem quer começar",
      features: [
        { text: "Site público profissional", icon: Globe },
        { text: "Portal básico do cliente", icon: Lock },
        { text: "Dashboard admin simplificado", icon: LayoutDashboard },
        { text: "30 dias suporte pós-launch", icon: MessageSquare },
        { text: "Design visual Helder Faria", icon: Sparkles },
      ],
      notIncluded: ["Automações avançadas", "IA integrada", "Multi-idioma"],
      recommended: false,
    },
    {
      name: "Profissional",
      price: "4.888",
      description: "A solução completa",
      features: [
        { text: "Tudo do Essencial +", icon: CheckCircle2 },
        { text: "Portal completo do cliente", icon: Lock },
        { text: "Dashboard admin completo", icon: LayoutDashboard },
        { text: "Automações inteligentes", icon: Zap },
        { text: "IA integrada", icon: Sparkles },
        { text: "Multi-idioma (PT/EN)", icon: Globe },
        { text: "60 dias suporte pós-launch", icon: MessageSquare },
        { text: "Segurança RGPD/LGPD", icon: Shield },
      ],
      notIncluded: [],
      recommended: true,
    },
    {
      name: "Premium",
      price: "6.500",
      description: "Tudo incluído + manutenção",
      features: [
        { text: "Tudo do Profissional +", icon: CheckCircle2 },
        { text: "6 meses manutenção incluída", icon: Settings },
        { text: "Prioridade no suporte", icon: Star },
        { text: "Atualizações de segurança", icon: Shield },
        { text: "Backup diário garantido", icon: FileText },
        { text: "Relatórios mensais", icon: TrendingUp },
      ],
      notIncluded: [],
      recommended: false,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-slate-50 p-6 relative">
      <div className="mb-4 text-center">
        <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Escolhe o teu plano</span>
        <h2 className="text-2xl font-light text-[#1e3a5f] mt-3">3 opções à tua medida</h2>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-4">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-4 flex flex-col relative ${
              tier.recommended
                ? "bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] text-white ring-4 ring-[#3D7081]/30 ring-offset-2 shadow-2xl scale-105 z-10"
                : "bg-white border border-slate-200 shadow-lg"
            }`}
          >
            {tier.recommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  RECOMENDADO
                </span>
              </div>
            )}
            <h3 className={`text-lg font-semibold ${tier.recommended ? "text-white mt-2" : "text-[#1e3a5f]"}`}>
              {tier.name}
            </h3>
            <p className={`text-xs mb-3 ${tier.recommended ? "text-blue-200" : "text-slate-500"}`}>
              {tier.description}
            </p>
            <p className={`text-3xl font-bold mb-3 ${tier.recommended ? "text-white" : "text-[#1e3a5f]"}`}>
              {tier.price} €
            </p>
            
            <div className="flex-1 space-y-1.5">
              {tier.features.map((feature, j) => (
                <div key={j} className="flex items-start gap-1.5">
                  <feature.icon className={`w-3 h-3 mt-0.5 flex-shrink-0 ${tier.recommended ? "text-green-300" : "text-[#3D7081]"}`} />
                  <span className={`text-xs ${tier.recommended ? "text-blue-100" : "text-slate-600"}`}>{feature.text}</span>
                </div>
              ))}
              {tier.notIncluded.map((item, j) => (
                <div key={j} className="flex items-start gap-1.5">
                  <X className={`w-3 h-3 mt-0.5 flex-shrink-0 ${tier.recommended ? "text-red-300" : "text-slate-400"}`} />
                  <span className={`text-xs line-through ${tier.recommended ? "text-blue-200/50" : "text-slate-400"}`}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bónus destacado */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-3 p-3 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-xl border-2 border-amber-300 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Zap className="w-5 h-5 text-amber-900" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-900 text-sm">Bónus Exclusivo: 4 horas de Formação IA</h3>
            <p className="text-amber-700 text-xs">Valor: 400 € — Válido se aceitares até 18 de Janeiro de 2025</p>
          </div>
        </div>
      </motion.div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 11: CONDIÇÕES COMERCIAIS (com ícones)
// ============================================
const SlideTerms = () => {
  const included = [
    { text: "Site público completo", icon: Globe },
    { text: "Portal do cliente", icon: Lock },
    { text: "Dashboard admin", icon: LayoutDashboard },
    { text: "Automações", icon: Zap },
    { text: "Segurança & backup", icon: Shield },
    { text: "60 dias suporte", icon: MessageSquare },
  ];

  const notIncluded = [
    { text: "Conteúdo editorial", icon: FileText },
    { text: "Fotografia profissional", icon: Eye },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-slate-50 p-6 relative">
      <div className="mb-3">
        <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Termos & Condições</span>
        <h2 className="text-2xl font-light text-[#1e3a5f] mt-3">Como funciona</h2>
      </div>

      {/* OFERTA ESPECIAL - URGÊNCIA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-3 p-3 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl border-2 border-amber-300 relative overflow-hidden shadow-lg"
      >
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-yellow-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-bl-xl">
          OFERTA LIMITADA
        </div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="w-7 h-7 text-amber-900" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900 text-sm">Bónus Exclusivo: 4 horas de Formação IA</h3>
            <p className="text-amber-700 text-xs">Para ti e toda a equipa — Valor: 400 €</p>
            <p className="text-amber-800 font-semibold text-xs mt-1 flex items-center gap-1">
              <Timer className="w-3 h-3" />
              Válido se aceitares até <span className="underline">18 de Janeiro de 2025</span>
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 grid grid-cols-3 gap-3">
        {/* Payment */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-md">
          <h3 className="font-semibold text-[#1e3a5f] mb-3 flex items-center gap-2 text-sm">
            <div className="w-8 h-8 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
              <Euro className="w-4 h-4 text-[#1e3a5f]" />
            </div>
            Pagamento
          </h3>
          <p className="text-2xl font-bold text-[#1e3a5f] mb-3">4.888 €</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">40% assinatura</span>
              <span className="font-semibold text-[#1e3a5f]">1.955 €</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">40% go-live</span>
              <span className="font-semibold text-[#1e3a5f]">1.955 €</span>
            </div>
            <div className="flex justify-between items-center py-2 px-3 bg-slate-50 rounded-lg">
              <span className="text-slate-600">20% após 30 dias</span>
              <span className="font-semibold text-[#1e3a5f]">978 €</span>
            </div>
          </div>
        </div>

        {/* Timeline & Included */}
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 border border-blue-100">
            <h3 className="font-semibold text-[#1e3a5f] mb-1 flex items-center gap-2 text-xs">
              <Calendar className="w-4 h-4" /> Prazo de Entrega
            </h3>
            <p className="text-2xl font-bold text-[#1e3a5f]">6-8 semanas</p>
            <p className="text-xs text-slate-500">Após aprovação do design</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-3 border border-green-100">
            <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-1 text-xs">
              <CheckCircle2 className="w-4 h-4" /> Incluído
            </h3>
            <ul className="space-y-1">
              {included.map((item, i) => (
                <li key={i} className="text-xs text-green-700 flex items-center gap-1.5">
                  <item.icon className="w-3 h-3" /> {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Not Included & Optional */}
        <div className="space-y-3">
          <div className="bg-slate-100 rounded-2xl p-3">
            <h3 className="font-semibold text-slate-600 mb-2 text-xs flex items-center gap-1">
              <X className="w-4 h-4" /> Não incluído
            </h3>
            <ul className="space-y-1">
              {notIncluded.map((item, i) => (
                <li key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                  <item.icon className="w-3 h-3" /> {item.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-3 border border-purple-100">
            <h3 className="font-semibold text-purple-700 mb-1 text-xs flex items-center gap-1">
              <Settings className="w-4 h-4" /> Opcional
            </h3>
            <p className="text-xs text-purple-600">Manutenção mensal</p>
            <p className="text-lg font-bold text-purple-700">150-250 €/mês</p>
          </div>
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] rounded-2xl p-3 text-white">
            <p className="text-xs text-blue-200">Quem entrega:</p>
            <p className="text-sm font-semibold">AiParaTi + Helder Faria</p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 12: FAQ (Cards visuais)
// ============================================
const SlideFAQ = () => {
  const faqs = [
    {
      question: "Posso pedir alterações durante o desenvolvimento?",
      answer: "Sim! Até 3 rondas de revisão estão incluídas. Trabalhamos em sprints semanais com feedback contínuo.",
      icon: Settings,
      color: "from-blue-50 to-indigo-50",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      question: "E se precisar de mais funcionalidades depois?",
      answer: "Orçamento adicional com 20% de desconto para clientes. Ou escolhe o plano Premium com manutenção incluída.",
      icon: Puzzle,
      color: "from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      question: "Quem faz a manutenção após os 60 dias?",
      answer: "Opção 1: Contrato mensal (150-250€). Opção 2: Formamos a tua equipa para gerir autonomamente.",
      icon: Shield,
      color: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      question: "Posso pagar em prestações?",
      answer: "Sim! 40% na assinatura, 40% no go-live, 20% após 30 dias. Flexível conforme necessidade.",
      icon: Euro,
      color: "from-amber-50 to-yellow-50",
      borderColor: "border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-slate-50 p-6 relative">
      <div className="mb-4 text-center">
        <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Perguntas Frequentes</span>
        <h2 className="text-2xl font-light text-[#1e3a5f] mt-3">O que podes estar a pensar</h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-gradient-to-br ${faq.color} rounded-2xl p-5 border ${faq.borderColor} shadow-md hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${faq.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                <faq.icon className={`w-5 h-5 ${faq.iconColor}`} />
              </div>
              <h3 className="font-semibold text-[#1e3a5f] text-sm leading-tight">
                {faq.question}
              </h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed pl-13">{faq.answer}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center"
      >
        <p className="text-sm text-slate-500 bg-white/80 inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm">
          <HelpCircle className="w-4 h-4 text-[#3D7081]" />
          Tens mais dúvidas? <span className="font-medium text-[#1e3a5f]">bilal.machraa@aiparati.pt</span>
        </p>
      </motion.div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 13: TIMELINE (com ícones e barra de progresso)
// ============================================
const SlideTimeline = () => {
  const weeks = [
    { week: "Sem. 1", title: "Kickoff", tasks: ["Briefing detalhado", "Paleta cores c/ Helder", "Definição de conteúdos"], icon: Rocket, color: "bg-blue-100", iconColor: "text-blue-600" },
    { week: "Sem. 2", title: "Design", tasks: ["Design homepage", "Wireframes portal", "Feedback Teresa"], icon: Sparkles, color: "bg-purple-100", iconColor: "text-purple-600" },
    { week: "Sem. 3", title: "Site", tasks: ["Desenvolvimento site", "Portfólio", "Blog/SEO"], icon: Globe, color: "bg-indigo-100", iconColor: "text-indigo-600" },
    { week: "Sem. 4", title: "Portal", tasks: ["Portal privado", "Sistema documentos", "Notificações"], icon: Lock, color: "bg-pink-100", iconColor: "text-pink-600" },
    { week: "Sem. 5", title: "Dashboard", tasks: ["Admin completo", "Integrações", "Automações"], icon: LayoutDashboard, color: "bg-amber-100", iconColor: "text-amber-600" },
    { week: "Sem. 6", title: "Testes", tasks: ["QA completo", "Ajustes finais", "Feedback final"], icon: Shield, color: "bg-cyan-100", iconColor: "text-cyan-600" },
    { week: "Sem. 7", title: "Formação", tasks: ["Formação equipa", "Migração dados", "Documentação"], icon: Users, color: "bg-orange-100", iconColor: "text-orange-600" },
    { week: "Sem. 8", title: "GO-LIVE!", tasks: ["Lançamento", "Monitorização", "Início suporte"], icon: Star, color: "bg-green-100", iconColor: "text-green-600" },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-white to-slate-50 p-6 relative">
      <div className="mb-3 text-center">
        <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Roadmap detalhado</span>
        <h2 className="text-2xl font-light text-[#1e3a5f] mt-3">As 8 semanas do projeto</h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 px-4">
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-[#1e3a5f] via-[#3D7081] to-green-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-400">Início</span>
          <span className="text-xs text-green-600 font-medium">Go-Live!</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2">
        {weeks.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-2xl p-3 ${
              i === 7 
                ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl ring-2 ring-green-300 ring-offset-1" 
                : "bg-white border border-slate-100 shadow-md"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-xl ${i === 7 ? "bg-white/20" : item.color} flex items-center justify-center`}>
                <item.icon className={`w-4 h-4 ${i === 7 ? "text-white" : item.iconColor}`} />
              </div>
              <div>
                <span className={`text-xs font-medium ${i === 7 ? "text-green-100" : "text-[#3D7081]"}`}>
                  {item.week}
                </span>
                <h3 className={`font-semibold text-sm ${i === 7 ? "text-white" : "text-[#1e3a5f]"}`}>
                  {item.title}
                </h3>
              </div>
            </div>
            <ul className="space-y-1">
              {item.tasks.map((task, j) => (
                <li key={j} className={`text-xs flex items-start gap-1 ${i === 7 ? "text-green-100" : "text-slate-600"}`}>
                  <Check className={`w-2.5 h-2.5 mt-0.5 flex-shrink-0 ${i === 7 ? "text-green-200" : "text-[#3D7081]"}`} />
                  {task}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 text-center"
      >
        <p className="text-[#1e3a5f] text-xs flex items-center justify-center gap-2">
          <Calendar className="w-4 h-4" />
          <span className="font-semibold">Comunicação semanal:</span> Reunião de 30min todas as sextas para alinhamento
        </p>
      </motion.div>
      
      <GlobalSignature />
    </div>
  );
};

// ============================================
// SLIDE 14: CTA FINAL (com equipa e badges)
// ============================================
const SlideNextSteps = () => {
  const techBadges = [
    { name: "Lovable", color: "bg-pink-100 text-pink-700" },
    { name: "Supabase", color: "bg-emerald-100 text-emerald-700" },
    { name: "Vercel", color: "bg-slate-100 text-slate-700" },
    { name: "React", color: "bg-sky-100 text-sky-700" },
    { name: "TypeScript", color: "bg-blue-100 text-blue-700" },
    { name: "Tailwind", color: "bg-cyan-100 text-cyan-700" },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#3D7081] p-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-40 h-40 border border-white/30 rotate-45" />
        <div className="absolute bottom-10 left-10 w-32 h-32 border border-white/30 rotate-12" />
      </div>

      <div className="mb-3 text-center">
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full">O momento</span>
        <h2 className="text-2xl font-light text-white mt-3">Pronta para começar, Teresa?</h2>
      </div>

      {/* Lembrete da oferta */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 p-3 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-xl border border-amber-400/30 text-center backdrop-blur-sm"
      >
        <p className="text-amber-200 text-sm font-medium flex items-center justify-center gap-2">
          <Timer className="w-4 h-4" />
          <span className="font-bold text-amber-100">4h Formação IA GRÁTIS</span> se aceitares até 18 Janeiro
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {/* Equipa */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-white/70" />
            Quem vai trabalhar contigo
          </h3>
          <div className="flex items-center gap-4 mb-4">
            {/* Placeholders para fotos */}
            <div className="flex -space-x-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-400 border-3 border-white/30 flex items-center justify-center text-amber-900 font-bold text-lg shadow-xl">
                BM
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-3 border-white/30 flex items-center justify-center text-purple-900 font-bold text-lg shadow-xl">
                HF
              </div>
            </div>
            <div>
              <p className="text-white font-semibold">AiParaTi + Helder Faria Design</p>
              <p className="text-white/60 text-sm">A tua equipa dedicada para este projeto</p>
            </div>
          </div>
          
          {/* Tech badges */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-white/50 text-xs mb-2">Tecnologias utilizadas:</p>
            <div className="flex flex-wrap gap-1.5">
              {techBadges.map((badge, i) => (
                <span key={i} className={`text-xs px-2 py-1 rounded-full font-medium ${badge.color}`}>
                  {badge.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA Principal */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-2xl flex flex-col"
        >
          <div className="text-center mb-4">
            <Rocket className="w-12 h-12 text-[#3D7081] mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-[#1e3a5f]">Vamos avançar juntos?</h3>
            <p className="text-slate-500 text-sm mt-1">
              Estamos prontos para transformar o teu estúdio.
            </p>
          </div>
          
          {/* Botões CTA */}
          <div className="space-y-2 mb-4">
            <Button size="lg" className="w-full gap-2 bg-gradient-to-r from-[#1e3a5f] to-[#3D7081] hover:from-[#2a4a6f] hover:to-[#4D8091] text-white shadow-lg">
              <CheckCircle2 className="w-5 h-5" />
              Aceitar Proposta
            </Button>
            <Button size="lg" variant="outline" className="w-full gap-2 border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f]/5">
              <Calendar className="w-5 h-5" />
              Agendar Call
            </Button>
          </div>
          
          {/* Contactos Reais */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center mb-2">Contacta-nos diretamente:</p>
            <div className="flex flex-col gap-2">
              <a 
                href="mailto:bilal.machraa@aiparati.pt" 
                className="flex items-center justify-center gap-2 text-[#1e3a5f] hover:underline bg-slate-50 rounded-lg py-2"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">bilal.machraa@aiparati.pt</span>
              </a>
              <a 
                href="https://wa.me/351918911308" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-green-600 hover:underline bg-green-50 rounded-lg py-2"
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">+351 918 911 308</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Assinatura fixa no fundo */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-3 text-center"
      >
        <p className="text-xs text-white/40">
          Proposta por <span className="font-medium text-white/60">AiParaTi</span> | Design: <span className="font-medium text-white/60">Helder Faria</span>
        </p>
      </motion.div>
      
      <div className="absolute bottom-3 right-4 text-xs text-white/30">
        AiParaTi | Plataforma ARIFA | Design: Helder Faria
      </div>
    </div>
  );
};

export default SalesPresentation;
