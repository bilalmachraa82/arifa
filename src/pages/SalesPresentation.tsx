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
  Sparkles,
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
import screenshotHomepage from "@/assets/screenshot-homepage-new.png";
import screenshotPortfolio from "@/assets/screenshot-portfolio-new.png";
import screenshotServicos from "@/assets/screenshot-servicos-new.png";
import screenshotBlog from "@/assets/screenshot-blog.png";
import screenshotContacto from "@/assets/screenshot-contacto.png";
import teamBilal from "@/assets/team-bilal.png";
import teamHelder from "@/assets/team-helder.png";

// ============================================
// CONSTANTS
// ============================================
const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;
const TOTAL_SLIDES = 18;

// ============================================
// GLOBAL SIGNATURE
// ============================================
const GlobalSignature = () => (
  <div className="absolute bottom-4 right-6 text-[11px] text-slate-400/80">
    AiParaTi | Plataforma ARIFA | Design: Helder Faria
  </div>
);

// ============================================
// SLIDE FRAME (safe area wrapper)
// ============================================
const SlideFrame = ({ 
  children, 
  className = "",
  padding = "p-12"
}: { 
  children: React.ReactNode; 
  className?: string;
  padding?: string;
}) => (
  <div className={`w-full h-full flex flex-col ${padding} ${className}`}>
    {children}
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const SalesPresentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [stageScale, setStageScale] = useState(1);
  const [direction, setDirection] = useState(0);
  const [hideControls, setHideControls] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Calculate scale to fit viewport
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const availableWidth = container.clientWidth - 32; // padding
      const availableHeight = container.clientHeight - 32; // padding
      
      const scaleX = availableWidth / STAGE_WIDTH;
      const scaleY = availableHeight / STAGE_HEIGHT;
      const scale = Math.min(scaleX, scaleY, 1); // Never scale up beyond 1
      
      setStageScale(scale);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, TOTAL_SLIDES - 1));
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

  // Export to PDF
  const exportToPDF = useCallback(async () => {
    if (!stageRef.current || isExporting) return;
    
    setIsExporting(true);
    toast.info("A gerar PDF... Aguarda enquanto cada slide é capturado.");
    
    // Wait for fonts
    await document.fonts.ready;
    
    const originalSlide = currentSlide;
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [STAGE_WIDTH, STAGE_HEIGHT]
    });

    try {
      for (let i = 0; i < TOTAL_SLIDES; i++) {
        setCurrentSlide(i);
        
        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const canvas = await html2canvas(stageRef.current!, {
          scale: 1,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
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
          pdf.addPage([STAGE_WIDTH, STAGE_HEIGHT], "landscape");
        }
        
        pdf.addImage(imgData, "JPEG", 0, 0, STAGE_WIDTH, STAGE_HEIGHT);
        toast.info(`Slide ${i + 1} de ${TOTAL_SLIDES} capturado...`);
      }
      
      pdf.save("ARIFA-Proposta-Comercial.pdf");
      toast.success("PDF exportado com sucesso!");
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
      toast.error("Erro ao exportar PDF. Tenta novamente.");
    } finally {
      setCurrentSlide(originalSlide);
      setIsExporting(false);
    }
  }, [currentSlide, isExporting]);

  // Keyboard navigation
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
      } else if (e.key === "h" || e.key === "H") {
        setHideControls(prev => !prev);
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

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
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
    <div className="min-h-screen bg-slate-900 flex flex-col overflow-hidden">
      {/* Export Overlay */}
      {isExporting && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 className="w-12 h-12 text-[#1e3a5f] animate-spin" />
            <p className="text-lg font-medium text-slate-700">A gerar PDF...</p>
            <p className="text-sm text-slate-500">Slide {currentSlide + 1} de {TOTAL_SLIDES}</p>
          </div>
        </div>
      )}

      {/* Stage Container */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4"
      >
        {/* Scaled Stage Wrapper */}
        <div
          style={{
            width: STAGE_WIDTH * stageScale,
            height: STAGE_HEIGHT * stageScale,
          }}
          className="relative"
        >
          {/* Fixed 1920x1080 Stage */}
          <div
            ref={stageRef}
            style={{
              width: STAGE_WIDTH,
              height: STAGE_HEIGHT,
              transform: `scale(${stageScale})`,
              transformOrigin: "top left",
            }}
            className="bg-white rounded-lg shadow-2xl overflow-hidden"
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
                  x: { type: "spring", stiffness: 400, damping: 40 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                {currentSlide === 0 && <SlideCover />}
                {currentSlide === 1 && <SlideProblem />}
                {currentSlide === 2 && <SlideTransformation />}
                {currentSlide === 3 && <SlideSolution />}
                {currentSlide === 4 && <SlidePublicSite />}
                {currentSlide === 5 && <SlidePortfolio />}
                {currentSlide === 6 && <SlideBlog />}
                {currentSlide === 7 && <SlideClientPortal />}
                {currentSlide === 8 && <SlideAdminDashboard />}
                {currentSlide === 9 && <SlideCRM />}
                {currentSlide === 10 && <SlideAutomations />}
                {currentSlide === 11 && <SlideTimeline />}
                {currentSlide === 12 && <SlideComparison />}
                {currentSlide === 13 && <SlidePricing />}
                {currentSlide === 14 && <SlideTerms />}
                {currentSlide === 15 && <SlideFAQ />}
                {currentSlide === 16 && <SlideContacto />}
                {currentSlide === 17 && <SlideNextSteps />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div 
        className={`bg-slate-800 border-t border-slate-700 px-4 py-3 transition-all duration-300 ${
          hideControls ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleSlideClick(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  i === currentSlide 
                    ? "bg-white scale-125" 
                    : i < currentSlide 
                      ? "bg-[#3D7081]" 
                      : "bg-slate-600"
                }`}
              />
            ))}
            <span className="ml-4 text-sm text-slate-400 font-medium">
              {currentSlide + 1} / {TOTAL_SLIDES}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToPDF}
              disabled={isExporting}
              className="gap-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
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
              className="gap-1 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              onClick={handleNextSlide}
              disabled={currentSlide === TOTAL_SLIDES - 1 || isExporting}
              className="gap-1 bg-[#3D7081] hover:bg-[#4D8091] text-white"
            >
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
  <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
    {/* Hero Background */}
    <div 
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    {/* Overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f]/90 via-[#1e3a5f]/85 to-[#3D7081]/80" />
    
    {/* Geometric Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-20 w-48 h-48 border border-white/30 rotate-45" />
      <div className="absolute bottom-20 right-20 w-56 h-56 border border-white/30 rotate-12" />
    </div>

    {/* AiParaTi Badge */}
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-12 left-12 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2.5"
    >
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
        <span className="text-[#1e3a5f] font-bold text-sm">Ai</span>
      </div>
      <span className="text-base font-medium text-white/90">AiParaTi</span>
    </motion.div>

    {/* Content */}
    <div className="text-center z-10 px-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="w-28 h-28 mx-auto border-2 border-white/80 rotate-45 flex items-center justify-center shadow-2xl bg-white/10 backdrop-blur-sm">
          <span className="text-white font-bold text-4xl -rotate-45">A</span>
        </div>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-7xl font-light text-white mb-6 tracking-tight"
      >
        Plataforma Digital <span className="font-semibold">ARIFA</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl text-white/80 font-light"
      >
        Para o teu estúdio de arquitetura
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 inline-flex items-center gap-4 px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
      >
        <Timer className="w-6 h-6 text-white/70" />
        <span className="text-2xl text-white/90 font-light">
          Transformar em 6-8 semanas
        </span>
      </motion.div>
      
      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-20 flex flex-col items-center gap-4"
      >
        <div className="flex items-center justify-center gap-6 text-base text-white/60">
          <span className="flex items-center gap-2">
            <ChevronLeft className="w-5 h-5" />
            <ChevronRight className="w-5 h-5" />
            navegar
          </span>
          <span className="text-white/40">•</span>
          <span>F para fullscreen</span>
          <span className="text-white/40">•</span>
          <span>H para ocultar controlos</span>
        </div>
        <p className="text-sm text-white/50">
          Proposição por <span className="font-medium text-white/70">AiParaTi</span> | Design por <span className="font-medium text-white/70">Helder Faria</span>
        </p>
      </motion.div>
    </div>
  </div>
);

// ============================================
// SLIDE 2: PROBLEMA
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
    <SlideFrame className="bg-gradient-to-br from-white to-slate-50 relative">
      <div className="mb-6">
        <span className="text-sm font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Teresa, sabemos que...</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-4">Onde estás hoje</h2>
        <p className="text-slate-500 mt-2 text-lg">
          A AiParaTi viu isto dezenas de vezes em estúdios como o teu. Não estás sozinha:
        </p>
      </div>
      
      <div className="flex-1 grid grid-cols-3 gap-5 content-center">
        {problemBlocks.map((block, blockIndex) => (
          <motion.div
            key={blockIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: blockIndex * 0.05 }}
            className={`bg-gradient-to-br ${block.color} rounded-2xl p-5 border ${block.borderColor} shadow-sm`}
          >
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${block.iconBg}`} />
              {block.title}
            </h3>
            <div className="space-y-3">
              {block.items.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${block.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${block.iconColor}`} />
                  </div>
                  <p className="text-slate-700 text-base leading-snug pt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center text-slate-500 text-lg mt-6 bg-white/50 py-3 rounded-xl"
      >
        Isto é comum. <span className="font-medium text-[#1e3a5f]">Mas não tem de ser assim.</span>
      </motion.p>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 3: TRANSFORMAÇÃO
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
    <SlideFrame className="bg-white relative">
      <div className="mb-8">
        <span className="text-sm font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">A transformação</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-4">O que muda para ti</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-5">
        {comparisons.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="grid grid-cols-[1fr,80px,1fr] gap-6 items-center"
          >
            {/* Before */}
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-l-4 border-red-400 rounded-r-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <item.iconBefore className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-slate-600 text-lg">{item.before}</p>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </div>
            
            {/* After */}
            <div className="bg-gradient-to-r from-green-100/50 to-green-50 border-r-4 border-green-500 rounded-l-xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <item.iconAfter className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-slate-700 text-lg font-medium">{item.after}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 4: SOLUÇÃO
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
    <SlideFrame className="bg-gradient-to-br from-white via-blue-50/30 to-white relative">
      <div className="mb-8">
        <span className="text-sm font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">A solução</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-4">
          O que tu vais ter
        </h2>
        <p className="text-slate-500 text-lg mt-2">Entregue por AiParaTi + Helder Faria</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-6 w-full">
          {solutions.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-slate-100 shadow-lg"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center mb-4 shadow-lg">
                <item.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-semibold text-[#1e3a5f] text-lg mb-1">{item.title}</h3>
              <p className="text-[#3D7081] text-sm font-medium mb-2">{item.desc}</p>
              <p className="text-slate-400 text-sm leading-snug">{item.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-slate-400 bg-slate-50 inline-flex items-center gap-2 px-4 py-2 rounded-full">
          <Sparkles className="w-4 h-4 text-[#3D7081]" />
          Tudo desenvolvido por <span className="font-medium text-[#1e3a5f]">AiParaTi</span>
        </p>
      </motion.div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 5: SITE PÚBLICO
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
    <SlideFrame className="bg-gradient-to-br from-white to-blue-50/30 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <Globe className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 1</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Site Público</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Screenshot */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
          <div className="bg-slate-200 h-8 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-slate-500 ml-2">arifa.pt</span>
          </div>
          <img 
            src={screenshotHomepage} 
            alt="Screenshot Homepage" 
            className="w-full h-[calc(100%-32px)] object-cover object-top"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-lg">O teu cartão de visita digital</p>
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#3D7081]" />
                </div>
                <p className="text-slate-700 text-base">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-[#1e3a5f] text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Otimizado para Google — clientes encontram-te.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 6: PORTFOLIO
// ============================================
const SlidePortfolio = () => {
  const features = [
    "Filtros por categoria (Residencial, Corporativo, etc.)",
    "Filtros por localização e segmento",
    "Estados visuais (Em Projeto, Concluído)",
    "Pesquisa instantânea de projetos",
    "Galeria com Lightbox premium",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-purple-50/30 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <FolderOpen className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 2</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Portfolio de Projetos</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Screenshot */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
          <div className="bg-slate-200 h-8 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-slate-500 ml-2">arifa.pt/portfolio</span>
          </div>
          <img 
            src={screenshotPortfolio} 
            alt="Screenshot Portfolio" 
            className="w-full h-[calc(100%-32px)] object-cover object-top"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-lg">Mostra o teu trabalho com classe</p>
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#3D7081]" />
                </div>
                <p className="text-slate-700 text-base">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <p className="text-[#1e3a5f] text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#3D7081]" />
              Cada projeto vende por ti — 24/7.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 7: BLOG
// ============================================
const SlideBlog = () => {
  const features = [
    "Artigos organizados por categoria",
    "Pesquisa instantânea de conteúdo",
    "Filtros por tema (Arquitetura, Design, etc.)",
    "Autoridade e SEO melhorado",
    "Lead magnets integrados",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-orange-50/30 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <FileText className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 3</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Blog & Conteúdo</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Screenshot */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
          <div className="bg-slate-200 h-8 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-slate-500 ml-2">arifa.pt/blog</span>
          </div>
          <img 
            src={screenshotBlog} 
            alt="Screenshot Blog" 
            className="w-full h-[calc(100%-32px)] object-cover object-top"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-lg">Posiciona-te como especialista</p>
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#3D7081]" />
                </div>
                <p className="text-slate-700 text-base">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
            <p className="text-[#1e3a5f] text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#3D7081]" />
              Conteúdo que atrai clientes e melhora o Google.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 6: PORTAL CLIENTE
// ============================================
const SlideClientPortal = () => {
  const features = [
    "Login seguro (cada cliente vê só o seu projeto)",
    "Timeline visual (onde está o projeto agora?)",
    "Galeria de renders e fotos de obra",
    "Documentos organizados (contratos, plantas)",
    "Mensagens internas (fim do WhatsApp caótico)",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-indigo-50/30 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <Lock className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 4</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Portal do Cliente</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Screenshot */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
          <div className="bg-slate-200 h-8 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-slate-500 ml-2">arifa.pt/cliente</span>
          </div>
          <img 
            src={screenshotPortfolio} 
            alt="Screenshot Portal" 
            className="w-full h-[calc(100%-32px)] object-cover object-top"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-lg">Onde os teus clientes acompanham tudo</p>
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#3D7081]" />
                </div>
                <p className="text-slate-700 text-base">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-[#1e3a5f] text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#3D7081]" />
              100% privado — cada cliente vê apenas o seu.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 9: DASHBOARD ADMIN
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
    <SlideFrame className="bg-gradient-to-br from-white to-emerald-50/30 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <LayoutDashboard className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 5</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Dashboard Admin</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Screenshot */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
          <div className="bg-slate-200 h-8 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-slate-500 ml-2">arifa.pt/admin</span>
          </div>
          <img 
            src={screenshotServicos} 
            alt="Screenshot Admin" 
            className="w-full h-[calc(100%-32px)] object-cover object-top"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-lg">O teu painel de comando</p>
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#3D7081]" />
                </div>
                <p className="text-slate-700 text-base">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-[#1e3a5f] text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-[#3D7081]" />
              Gestão da empresa com um golpe de vista.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 10: CRM KANBAN
// ============================================
const SlideCRM = () => {
  const stages = [
    { name: "Novo", count: 3, color: "bg-blue-100 border-blue-300 text-blue-700" },
    { name: "Contactado", count: 5, color: "bg-yellow-100 border-yellow-300 text-yellow-700" },
    { name: "Proposta", count: 2, color: "bg-purple-100 border-purple-300 text-purple-700" },
    { name: "Fechado", count: 4, color: "bg-green-100 border-green-300 text-green-700" },
  ];

  const features = [
    "Kanban visual drag & drop",
    "AI Lead Scoring automático",
    "Histórico completo de atividades",
    "Conversão lead → cliente integrada",
    "Exportação CSV/PDF",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-cyan-50/30 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 6</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">CRM de Leads</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Kanban Mockup */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
          <div className="bg-slate-200 h-8 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-slate-500 ml-2">arifa.pt/admin/leads</span>
          </div>
          <div className="p-4 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-32px)]">
            <div className="grid grid-cols-4 gap-3 h-full">
              {stages.map((stage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col"
                >
                  <div className={`text-center text-xs font-bold py-2 rounded-t-lg border-2 ${stage.color}`}>
                    {stage.name} ({stage.count})
                  </div>
                  <div className="flex-1 bg-white/80 border-x-2 border-b-2 border-slate-200 rounded-b-lg p-2 space-y-2">
                    {[...Array(Math.min(stage.count, 3))].map((_, j) => (
                      <div key={j} className="bg-white rounded-lg p-2 border border-slate-100 shadow-sm">
                        <div className="h-2 w-16 bg-slate-200 rounded mb-1.5" />
                        <div className="h-2 w-12 bg-slate-100 rounded" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-lg">Nunca percas um lead</p>
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#3D7081]" />
                </div>
                <p className="text-slate-700 text-base">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
            <p className="text-[#1e3a5f] text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3D7081]" />
              A IA qualifica leads por ti. Tu fechas negócios.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 11: AUTOMAÇÕES
// ============================================
const SlideAutomations = () => {
  const automations = [
    { 
      name: "Follow-up Automático", 
      trigger: "Cliente sem resposta 5 dias",
      action: "Email de seguimento"
    },
    { 
      name: "Notificação de Documento", 
      trigger: "Novo documento adicionado",
      action: "Push notification"
    },
    { 
      name: "Milestone Concluída", 
      trigger: "Estado da milestone muda",
      action: "Email + Atualizar portal"
    },
  ];

  const features = [
    "Follow-ups automáticos (nunca perdes um cliente)",
    "Notificações smart (Teresa + clientes informados)",
    "Geração automática de documentos",
    "IA integrada (sugestões, análise de feedback)",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-slate-50 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <Zap className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 4</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Automações Inteligentes</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Mockup visual de automações */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
          {/* Browser chrome */}
          <div className="bg-slate-200 h-8 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-slate-500 ml-2">arifa.pt/admin/automacoes</span>
          </div>
          
          {/* Conteúdo mockup */}
          <div className="p-5 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-32px)]">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-base font-semibold text-[#1e3a5f]">Automações Ativas</h4>
              <div className="px-3 py-1.5 bg-[#3D7081] text-white text-xs rounded-lg cursor-pointer hover:bg-[#2d5a6a] transition-colors">+ Nova</div>
            </div>
            
            <div className="space-y-3">
              {automations.map((auto, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-[#1e3a5f] text-sm">{auto.name}</span>
                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    Se: <span className="text-slate-600">{auto.trigger}</span> → <span className="text-[#3D7081] font-medium">{auto.action}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-lg">O trabalho invisível que liberta o teu tempo</p>
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#3D7081]" />
                </div>
                <p className="text-slate-700 text-base">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <p className="text-[#1e3a5f] text-sm font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3D7081]" />
              Funcionam 24/7. Tu dormes, elas trabalham.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 9: TIMELINE
// ============================================
const SlideTimeline = () => {
  const weeks = [
    {
      week: "Semana 1-2",
      title: "Discovery",
      icon: Target,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      tasks: ["Briefing detalhado", "Análise de conteúdos", "Wireframes"]
    },
    {
      week: "Semana 3-4",
      title: "Design",
      icon: Sparkles,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      tasks: ["UI/UX por Helder Faria", "Revisão com Teresa", "Aprovação"]
    },
    {
      week: "Semana 5-6",
      title: "Desenvolvimento",
      icon: Settings,
      color: "bg-emerald-100",
      iconColor: "text-emerald-600",
      tasks: ["Frontend + Backend", "Integrações", "Testes internos"]
    },
    {
      week: "Semana 7",
      title: "Testes",
      icon: Shield,
      color: "bg-amber-100",
      iconColor: "text-amber-600",
      tasks: ["QA completo", "Testes com Teresa", "Ajustes finais"]
    },
    {
      week: "Semana 8",
      title: "Go-Live!",
      icon: Rocket,
      color: "bg-green-100",
      iconColor: "text-green-600",
      tasks: ["Deploy produção", "Formação", "Suporte ativo"]
    },
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-slate-50 relative">
      <div className="mb-6">
        <span className="text-sm font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Cronograma</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-4">8 Semanas até ao Go-Live</h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 px-4">
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-[#1e3a5f] via-[#3D7081] to-green-500 rounded-full"
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-slate-400">Início</span>
          <span className="text-sm text-green-600 font-medium">Go-Live!</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-5 gap-4">
        {weeks.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-2xl p-5 flex flex-col ${
              i === 4 
                ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl ring-2 ring-green-300" 
                : "bg-white border border-slate-100 shadow-md"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl ${i === 4 ? "bg-white/20" : item.color} flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 ${i === 4 ? "text-white" : item.iconColor}`} />
              </div>
              <div>
                <span className={`text-xs font-medium ${i === 4 ? "text-green-100" : "text-[#3D7081]"}`}>
                  {item.week}
                </span>
                <h3 className={`font-semibold text-lg ${i === 4 ? "text-white" : "text-[#1e3a5f]"}`}>
                  {item.title}
                </h3>
              </div>
            </div>
            <ul className="space-y-2 flex-1">
              {item.tasks.map((task, j) => (
                <li key={j} className={`text-sm flex items-start gap-2 ${i === 4 ? "text-green-100" : "text-slate-600"}`}>
                  <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${i === 4 ? "text-green-200" : "text-[#3D7081]"}`} />
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
        className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 text-center"
      >
        <p className="text-[#1e3a5f] text-base flex items-center justify-center gap-3">
          <Calendar className="w-5 h-5" />
          <span className="font-semibold">Comunicação semanal:</span> Reunião de 30min todas as sextas para alinhamento
        </p>
      </motion.div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 10: COMPARAÇÃO
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
    <SlideFrame className="bg-white relative">
      <div className="mb-6">
        <span className="text-sm font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Comparação</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-4">Outras soluções vs. Solução integrada</h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Traditional */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <h3 className="text-base font-semibold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2">
            <X className="w-4 h-4" /> Abordagem Tradicional
          </h3>
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl p-5 flex-1 border border-red-200">
            <div className="grid grid-cols-2 gap-2">
              {traditionalTools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex justify-between items-center py-2 px-3 bg-white rounded-lg text-sm shadow-sm"
                >
                  <span className="text-slate-600 flex items-center gap-2">
                    <X className="w-3 h-3 text-red-400" />
                    {tool.name}
                  </span>
                  <span className="text-red-600 font-medium">{tool.cost}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-red-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-red-700 text-lg">TOTAL/ANO</span>
                <span className="font-bold text-red-700 text-2xl">~20.364 €</span>
              </div>
              <p className="text-sm text-red-500 mt-2">+ tempo a integrar manualmente</p>
            </div>
          </div>
        </motion.div>

        {/* ARIFA */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col"
        >
          <h3 className="text-base font-semibold text-green-600 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Check className="w-4 h-4" /> Solução ARIFA (por AiParaTi)
          </h3>
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] rounded-2xl p-6 flex-1 text-white shadow-xl">
            <div className="space-y-3 mb-6">
              {arifaBenefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="flex items-center gap-3 py-2"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0" />
                  <span className="text-blue-100 text-lg">{benefit}</span>
                </motion.div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/20">
              <span className="text-blue-200 text-sm">Investimento único</span>
              <p className="text-5xl font-bold mt-2">4.888 €</p>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-300" />
                <span className="text-green-300 font-medium text-lg">Poupança: ~56.000 € em 3 anos</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 flex items-center gap-4"
      >
        <Puzzle className="w-8 h-8 text-[#1e3a5f] flex-shrink-0" />
        <p className="text-[#1e3a5f] text-base">
          <span className="font-semibold">A grande diferença?</span> Tudo funciona junto. Sem ferramentas soltas, sem dados espalhados.
        </p>
      </motion.div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 11: PRICING
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
    <SlideFrame className="bg-gradient-to-br from-white to-slate-50 relative">
      <div className="mb-6 text-center">
        <span className="text-sm font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Escolhe o teu plano</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-4">3 opções à tua medida</h2>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl p-6 flex flex-col relative ${
              tier.recommended
                ? "bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] text-white ring-4 ring-[#3D7081]/30 shadow-2xl z-10"
                : "bg-white border border-slate-200 shadow-lg"
            }`}
          >
            {tier.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-sm font-bold px-5 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  RECOMENDADO
                </span>
              </div>
            )}
            <h3 className={`text-2xl font-semibold ${tier.recommended ? "text-white mt-4" : "text-[#1e3a5f]"}`}>
              {tier.name}
            </h3>
            <p className={`text-sm mb-4 ${tier.recommended ? "text-blue-200" : "text-slate-500"}`}>
              {tier.description}
            </p>
            <p className={`text-4xl font-bold mb-4 ${tier.recommended ? "text-white" : "text-[#1e3a5f]"}`}>
              {tier.price} €
            </p>
            
            <div className="flex-1 space-y-2">
              {tier.features.map((feature, j) => (
                <div key={j} className="flex items-start gap-2">
                  <feature.icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.recommended ? "text-green-300" : "text-[#3D7081]"}`} />
                  <span className={`text-sm ${tier.recommended ? "text-blue-100" : "text-slate-600"}`}>{feature.text}</span>
                </div>
              ))}
              {tier.notIncluded.map((item, j) => (
                <div key={j} className="flex items-start gap-2">
                  <X className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                  <span className="text-sm line-through text-slate-400">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bonus */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-xl border-2 border-amber-300 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Zap className="w-6 h-6 text-amber-900" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-amber-900 text-lg">Bónus Exclusivo: 4 horas de Formação IA</h3>
            <p className="text-amber-700">Valor: 400 € — Válido se aceitares até 18 de Janeiro de 2025</p>
          </div>
        </div>
      </motion.div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 12: TERMOS
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
    <SlideFrame className="bg-gradient-to-br from-white to-slate-50 relative">
      <div className="mb-4">
        <span className="text-sm font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Termos & Condições</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-4">Como funciona</h2>
      </div>

      {/* Special Offer */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-4 p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl border-2 border-amber-300 relative overflow-hidden shadow-lg"
      >
        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-yellow-400 text-amber-900 text-xs font-bold px-5 py-1.5 rounded-bl-xl">
          OFERTA LIMITADA
        </div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Sparkles className="w-8 h-8 text-amber-900" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900 text-lg">Bónus Exclusivo: 4 horas de Formação IA</h3>
            <p className="text-amber-700">Para ti e toda a equipa — Valor: 400 €</p>
            <p className="text-amber-800 font-semibold mt-1 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Válido se aceitares até <span className="underline">18 de Janeiro de 2025</span>
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex-1 grid grid-cols-3 gap-5">
        {/* Payment */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-md">
          <h3 className="font-semibold text-[#1e3a5f] mb-4 flex items-center gap-3 text-lg">
            <div className="w-10 h-10 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
              <Euro className="w-5 h-5 text-[#1e3a5f]" />
            </div>
            Pagamento
          </h3>
          <p className="text-3xl font-bold text-[#1e3a5f] mb-4">4.888 €</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-xl">
              <span className="text-slate-600">40% assinatura</span>
              <span className="font-semibold text-[#1e3a5f]">1.955 €</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-xl">
              <span className="text-slate-600">40% go-live</span>
              <span className="font-semibold text-[#1e3a5f]">1.955 €</span>
            </div>
            <div className="flex justify-between items-center py-3 px-4 bg-slate-50 rounded-xl">
              <span className="text-slate-600">20% após 30 dias</span>
              <span className="font-semibold text-[#1e3a5f]">978 €</span>
            </div>
          </div>
        </div>

        {/* Timeline & Included */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
            <h3 className="font-semibold text-[#1e3a5f] mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Prazo de Entrega
            </h3>
            <p className="text-3xl font-bold text-[#1e3a5f]">6-8 semanas</p>
            <p className="text-sm text-slate-500">Após aprovação do design</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 flex-1">
            <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Incluído
            </h3>
            <ul className="space-y-2">
              {included.map((item, i) => (
                <li key={i} className="text-sm text-green-700 flex items-center gap-2">
                  <item.icon className="w-4 h-4" /> {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Not Included & Optional */}
        <div className="space-y-4">
          <div className="bg-slate-100 rounded-2xl p-4">
            <h3 className="font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <X className="w-5 h-5" /> Não incluído
            </h3>
            <ul className="space-y-2">
              {notIncluded.map((item, i) => (
                <li key={i} className="text-sm text-slate-500 flex items-center gap-2">
                  <item.icon className="w-4 h-4" /> {item.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
              <Settings className="w-5 h-5" /> Opcional
            </h3>
            <p className="text-sm text-purple-600">Manutenção mensal</p>
            <p className="text-2xl font-bold text-purple-700">150-250 €/mês</p>
          </div>
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] rounded-2xl p-4 text-white">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-sm">
              <Award className="w-5 h-5" /> Garantia
            </h3>
            <p className="text-sm text-blue-100">60 dias de suporte incluído</p>
            <p className="text-lg font-bold mt-1">Satisfação garantida</p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 13: FAQ
// ============================================
const SlideFAQ = () => {
  const faqs = [
    {
      question: "Quanto tempo demora?",
      answer: "6-8 semanas desde a assinatura até ao go-live, com reuniões semanais.",
      icon: Calendar
    },
    {
      question: "E se eu quiser alterações depois?",
      answer: "60 dias de suporte incluído. Depois, manutenção opcional a partir de 150€/mês.",
      icon: Settings
    },
    {
      question: "Preciso de conhecimentos técnicos?",
      answer: "Não. O admin é 100% visual. E fazemos formação incluída.",
      icon: Lightbulb
    },
    {
      question: "Os meus dados estão seguros?",
      answer: "Sim. Backups automáticos, HTTPS, RGPD compliant. Tudo em servidores europeus.",
      icon: Shield
    },
    {
      question: "Posso adicionar mais funcionalidades depois?",
      answer: "Sim. A plataforma é modular e pode crescer consigo.",
      icon: Puzzle
    },
    {
      question: "E se não gostar do resultado?",
      answer: "Trabalhamos juntos em cada fase. Aprovação antes de avançar para a seguinte.",
      icon: CheckCircle2
    },
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-slate-50 relative">
      <div className="mb-6 text-center">
        <span className="text-sm font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-3 py-1 rounded-full">Perguntas Frequentes</span>
        <h2 className="text-4xl font-light text-[#1e3a5f] mt-4">Respondemos às tuas dúvidas</h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-md flex gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e3a5f]/10 to-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
              <faq.icon className="w-5 h-5 text-[#3D7081]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1e3a5f] mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#3D7081]" />
                {faq.question}
              </h3>
              <p className="text-slate-600 text-[15px] leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 text-center"
      >
        <p className="text-[#1e3a5f] text-base flex items-center justify-center gap-3">
          <MessageSquare className="w-5 h-5" />
          <span>Mais perguntas? </span>
          <span className="font-semibold">bilal.machraa@aiparati.pt</span>
        </p>
      </motion.div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 17: CONTACTO
// ============================================
const SlideContacto = () => {
  const features = [
    "Formulário inteligente com segmentação",
    "Leads capturados direto no CRM",
    "Notificação instantânea para ti",
    "AI Lead Scoring automático",
    "Integração com WhatsApp",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-rose-50/30 relative">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-lg">
          <Mail className="w-7 h-7 text-white" />
        </div>
        <div>
          <span className="text-xs font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade Bónus</span>
          <h2 className="text-3xl font-light text-[#1e3a5f]">Página de Contacto</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Screenshot */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
          <div className="bg-slate-200 h-8 flex items-center gap-2 px-4">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-xs text-slate-500 ml-2">arifa.pt/contacto</span>
          </div>
          <img 
            src={screenshotContacto} 
            alt="Screenshot Contacto" 
            className="w-full h-[calc(100%-32px)] object-cover object-top"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-600 mb-4 text-lg">Converte visitantes em leads</p>
          <div className="space-y-3">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-[#3D7081]" />
                </div>
                <p className="text-slate-700 text-base">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100">
            <p className="text-[#1e3a5f] text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#3D7081]" />
              Do formulário ao CRM em segundos.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 18: CTA FINAL
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
    <SlideFrame padding="p-10" className="bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#3D7081] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-56 h-56 border border-white/30 rotate-45" />
        <div className="absolute bottom-20 left-20 w-40 h-40 border border-white/30 rotate-12" />
      </div>

      <div className="mb-4 text-center relative z-10">
        <span className="text-sm font-semibold text-white/60 uppercase tracking-wider bg-white/10 px-4 py-1.5 rounded-full">O momento</span>
        <h2 className="text-4xl font-light text-white mt-4">Pronta para começar, Teresa?</h2>
      </div>

      {/* Offer Reminder */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 p-4 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-xl border border-amber-400/30 text-center backdrop-blur-sm relative z-10"
      >
        <p className="text-amber-200 text-lg font-medium flex items-center justify-center gap-3">
          <Timer className="w-5 h-5" />
          <span className="font-bold text-amber-100">4h Formação IA GRÁTIS</span> se aceitares até 18 Janeiro
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-2 gap-6 relative z-10">
        {/* Team */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
        >
          <h3 className="text-white font-semibold mb-5 flex items-center gap-3 text-xl">
            <Users className="w-6 h-6 text-white/70" />
            Quem vai trabalhar contigo
          </h3>
          <div className="flex items-center gap-5 mb-5">
            <div className="flex -space-x-3">
              <img 
                src={teamBilal} 
                alt="Bilal Machraa" 
                className="w-20 h-20 rounded-full object-cover border-4 border-amber-400/50 shadow-xl"
              />
              <img 
                src={teamHelder} 
                alt="Helder Faria" 
                className="w-20 h-20 rounded-full object-cover border-4 border-purple-400/50 shadow-xl"
              />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Bilal Machraa & Helder Faria</p>
              <p className="text-white/60">AiParaTi — A tua equipa dedicada</p>
            </div>
          </div>
          
          {/* Tech badges */}
          <div className="pt-5 border-t border-white/10">
            <p className="text-white/50 text-sm mb-3">Tecnologias utilizadas:</p>
            <div className="flex flex-wrap gap-2">
              {techBadges.map((badge, i) => (
                <span key={i} className={`text-sm px-3 py-1.5 rounded-full font-medium ${badge.color}`}>
                  {badge.name}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-2xl flex flex-col"
        >
          <div className="text-center mb-5">
            <Rocket className="w-14 h-14 text-[#3D7081] mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[#1e3a5f]">Vamos avançar juntos?</h3>
            <p className="text-slate-500 mt-2">
              Estamos prontos para transformar o teu estúdio.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="space-y-3 mb-5">
            <Button size="lg" className="w-full gap-3 bg-gradient-to-r from-[#1e3a5f] to-[#3D7081] hover:from-[#2a4a6f] hover:to-[#4D8091] text-white shadow-lg text-lg h-14">
              <CheckCircle2 className="w-6 h-6" />
              Aceitar Proposta
            </Button>
            <Button size="lg" variant="outline" className="w-full gap-3 border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f]/5 text-lg h-14">
              <Calendar className="w-6 h-6" />
              Agendar Call
            </Button>
          </div>
          
          {/* Contacts */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500 text-center mb-3">Contacta-nos diretamente:</p>
            <div className="flex flex-col gap-2">
              <a 
                href="mailto:bilal.machraa@aiparati.pt" 
                className="flex items-center justify-center gap-2 text-[#1e3a5f] hover:underline bg-slate-50 rounded-xl py-3"
              >
                <Mail className="w-5 h-5" />
                <span className="font-medium">bilal.machraa@aiparati.pt</span>
              </a>
              <a 
                href="https://wa.me/351918911308" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-green-600 hover:underline bg-green-50 rounded-xl py-3"
              >
                <Phone className="w-5 h-5" />
                <span className="font-medium">+351 918 911 308</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Signature */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 text-center relative z-10"
      >
        <p className="text-sm text-white/40">
          Proposta por <span className="font-medium text-white/60">AiParaTi</span> | Design: <span className="font-medium text-white/60">Helder Faria</span>
        </p>
      </motion.div>
    </SlideFrame>
  );
};

export default SalesPresentation;
