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
  Star,
  Image,
  Camera,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import heroBg from "@/assets/presentation-hero-bg.jpg";
import screenshotHomepage from "@/assets/screenshot-homepage-new.png";
import screenshotPortfolio from "@/assets/screenshot-portfolio-new.png";
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
// GLOBAL SIGNATURE - Bigger for Zoom 2026
// ============================================
const GlobalSignature = () => (
  <div className="absolute bottom-6 right-8 text-[16px] text-slate-500">
    AiParaTi | Plataforma ARIFA | Design: Helder Faria
  </div>
);

// ============================================
// SLIDE FRAME (safe area wrapper) - More padding
// ============================================
const SlideFrame = ({ 
  children, 
  className = "",
  padding = "p-16"
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
      const availableWidth = container.clientWidth - 32;
      const availableHeight = container.clientHeight - 32;
      
      const scaleX = availableWidth / STAGE_WIDTH;
      const scaleY = availableHeight / STAGE_HEIGHT;
      const scale = Math.min(scaleX, scaleY, 1);
      
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
      className="absolute top-12 left-12 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3"
    >
      <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
        <span className="text-[#1e3a5f] font-bold text-lg">Ai</span>
      </div>
      <span className="text-xl font-medium text-white/90">AiParaTi</span>
    </motion.div>

    {/* Content */}
    <div className="text-center z-10 px-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="w-32 h-32 mx-auto border-2 border-white/80 rotate-45 flex items-center justify-center shadow-2xl bg-white/10 backdrop-blur-sm">
          <span className="text-white font-bold text-5xl -rotate-45">A</span>
        </div>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-[80px] font-light text-white mb-8 tracking-tight leading-none"
      >
        Plataforma Digital <span className="font-semibold">ARIFA</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-[36px] text-white/80 font-light"
      >
        Para o teu estúdio de arquitetura
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 inline-flex items-center gap-5 px-10 py-5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
      >
        <Timer className="w-8 h-8 text-white/70" />
        <span className="text-[28px] text-white/90 font-light">
          Transformar em 6-8 semanas
        </span>
      </motion.div>
      
      {/* Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-24 flex flex-col items-center gap-5"
      >
        <div className="flex items-center justify-center gap-8 text-[18px] text-white/60">
          <span className="flex items-center gap-2">
            <ChevronLeft className="w-6 h-6" />
            <ChevronRight className="w-6 h-6" />
            navegar
          </span>
          <span className="text-white/40">•</span>
          <span>F para fullscreen</span>
          <span className="text-white/40">•</span>
          <span>H para ocultar controlos</span>
        </div>
        <p className="text-[16px] text-white/50">
          Proposição por <span className="font-medium text-white/70">AiParaTi</span> | Design por <span className="font-medium text-white/70">Helder Faria</span>
        </p>
      </motion.div>
    </div>
  </div>
);

// ============================================
// SLIDE 2: PROBLEMA - Reduced to 4 blocks
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
        { icon: Mail, text: "Demasiados emails e WhatsApps" },
        { icon: AlertCircle, text: "Informação dispersa" },
      ]
    },
    {
      title: "GESTÃO",
      color: "from-sky-50 to-sky-100",
      borderColor: "border-sky-200",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-500",
      items: [
        { icon: FolderOpen, text: "Projetos espalhados" },
        { icon: FileText, text: "Briefing desorganizado" },
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
        { icon: Timer, text: "Sem automações" },
      ]
    },
    {
      title: "VISIBILIDADE",
      color: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-500",
      items: [
        { icon: Eye, text: "Clientes à deriva" },
        { icon: Target, text: "Sem portfólio online" },
      ]
    },
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-slate-50 relative">
      <div className="mb-10">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">Teresa, sabemos que...</span>
        <h2 className="text-[56px] font-light text-[#1e3a5f] mt-6">Onde estás hoje</h2>
        <p className="text-slate-600 mt-3 text-[24px]">
          A AiParaTi viu isto dezenas de vezes em estúdios como o teu:
        </p>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-8 content-center">
        {problemBlocks.map((block, blockIndex) => (
          <motion.div
            key={blockIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: blockIndex * 0.08 }}
            className={`bg-gradient-to-br ${block.color} rounded-3xl p-8 border-2 ${block.borderColor} shadow-lg`}
          >
            <h3 className="text-[18px] font-bold text-slate-700 uppercase tracking-wider mb-6 flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${block.iconBg}`} />
              {block.title}
            </h3>
            <div className="space-y-5">
              {block.items.map((item, i) => (
                <div key={i} className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl ${block.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-7 h-7 ${block.iconColor}`} />
                  </div>
                  <p className="text-slate-800 text-[22px] font-medium">{item.text}</p>
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
        className="text-center text-slate-600 text-[22px] mt-8 bg-white/60 py-5 rounded-2xl"
      >
        Isto é comum. <span className="font-semibold text-[#1e3a5f]">Mas não tem de ser assim.</span>
      </motion.p>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 3: TRANSFORMAÇÃO - Reduced to 4 items
// ============================================
const SlideTransformation = () => {
  const comparisons = [
    { 
      before: "5 projetos em 5 lugares diferentes", 
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
      before: "Clientes à deriva sem saber progresso", 
      after: "Portal com progresso em tempo real",
      iconBefore: AlertCircle,
      iconAfter: Eye
    },
    { 
      before: "Vendas apenas por 'boca a boca'", 
      after: "Portfolio que vende 24/7",
      iconBefore: Users,
      iconAfter: Globe
    },
  ];

  return (
    <SlideFrame className="bg-white relative">
      <div className="mb-10">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">A transformação</span>
        <h2 className="text-[56px] font-light text-[#1e3a5f] mt-6">O que muda para ti</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-8">
        {comparisons.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="grid grid-cols-[1fr,100px,1fr] gap-8 items-center"
          >
            {/* Before */}
            <div className="bg-gradient-to-r from-red-50 to-red-100/50 border-l-4 border-red-400 rounded-r-2xl p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <item.iconBefore className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-slate-700 text-[22px]">{item.before}</p>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl">
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* After */}
            <div className="bg-gradient-to-r from-green-100/50 to-green-50 border-r-4 border-green-500 rounded-l-2xl p-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <item.iconAfter className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-slate-800 text-[22px] font-semibold">{item.after}</p>
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
      desc: "Portfólio + SEO"
    },
    { 
      icon: Lock, 
      title: "Portal Privado", 
      desc: "Para clientes"
    },
    { 
      icon: LayoutDashboard, 
      title: "Dashboard Admin", 
      desc: "Gestão centralizada"
    },
    { 
      icon: Zap, 
      title: "Automações", 
      desc: "Follow-ups automáticos"
    },
    { 
      icon: Shield, 
      title: "Segurança", 
      desc: "RGPD compliant"
    },
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white via-blue-50/30 to-white relative">
      <div className="mb-10">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">A solução</span>
        <h2 className="text-[56px] font-light text-[#1e3a5f] mt-6">
          O que tu vais ter
        </h2>
        <p className="text-slate-600 text-[24px] mt-3">Entregue por AiParaTi + Helder Faria</p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-5 gap-8 w-full">
          {solutions.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white border border-slate-100 shadow-xl"
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center mb-6 shadow-xl">
                <item.icon className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-bold text-[#1e3a5f] text-[24px] mb-2">{item.title}</h3>
              <p className="text-[#3D7081] text-[18px] font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-[18px] text-slate-500 bg-slate-50 inline-flex items-center gap-3 px-6 py-3 rounded-full">
          <Sparkles className="w-5 h-5 text-[#3D7081]" />
          Tudo desenvolvido por <span className="font-semibold text-[#1e3a5f]">AiParaTi</span>
        </p>
      </motion.div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 5: SITE PÚBLICO - 4 features max
// ============================================
const SlidePublicSite = () => {
  const features = [
    "Portfólio com filtros inteligentes",
    "Galeria profissional high-res",
    "Blog/News para SEO + autoridade",
    "Formulário → direto para admin",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-blue-50/30 relative">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <Globe className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 1</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Site Público</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-10">
        {/* Screenshot */}
        <div className="bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl">
          <div className="bg-slate-200 h-10 flex items-center gap-2 px-5">
            <div className="w-4 h-4 rounded-full bg-red-400" />
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-[14px] text-slate-500 ml-3">arifa.pt</span>
          </div>
          <img 
            src={screenshotHomepage} 
            alt="Screenshot Homepage" 
            className="w-full h-[calc(100%-40px)] object-cover object-top"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-6 text-[24px]">O teu cartão de visita digital</p>
          <div className="space-y-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[22px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <p className="text-[#1e3a5f] text-[18px] font-semibold flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
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
// SLIDE 6: PORTFOLIO - 4 features max
// ============================================
const SlidePortfolio = () => {
  const features = [
    "Filtros por categoria e localização",
    "Estados visuais (Em Projeto, Concluído)",
    "Pesquisa instantânea de projetos",
    "Galeria com Lightbox premium",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-purple-50/30 relative">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <FolderOpen className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 2</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Portfolio de Projetos</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-10">
        {/* Screenshot */}
        <div className="bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl">
          <div className="bg-slate-200 h-10 flex items-center gap-2 px-5">
            <div className="w-4 h-4 rounded-full bg-red-400" />
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-[14px] text-slate-500 ml-3">arifa.pt/portfolio</span>
          </div>
          <img 
            src={screenshotPortfolio} 
            alt="Screenshot Portfolio" 
            className="w-full h-[calc(100%-40px)] object-cover object-top"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-6 text-[24px]">Mostra o teu trabalho com classe</p>
          <div className="space-y-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[22px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
            <p className="text-[#1e3a5f] text-[18px] font-semibold flex items-center gap-3">
              <Eye className="w-6 h-6 text-[#3D7081]" />
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
// SLIDE 7: BLOG - 4 features max
// ============================================
const SlideBlog = () => {
  const features = [
    "Artigos formatados profissionalmente",
    "Categorização e pesquisa",
    "SEO otimizado para Google",
    "Lead magnets integrados",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-orange-50/30 relative">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <FileText className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 3</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Blog & Conteúdo</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-10">
        {/* Screenshot */}
        <div className="bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl">
          <div className="bg-slate-200 h-10 flex items-center gap-2 px-5">
            <div className="w-4 h-4 rounded-full bg-red-400" />
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-[14px] text-slate-500 ml-3">arifa.pt/blog</span>
          </div>
          <img 
            src={screenshotBlog} 
            alt="Screenshot Blog" 
            className="w-full h-[calc(100%-40px)] object-cover object-top"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-6 text-[24px]">Posiciona-te como especialista</p>
          <div className="space-y-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[22px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
            <p className="text-[#1e3a5f] text-[18px] font-semibold flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-[#3D7081]" />
              Conteúdo que atrai clientes.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 8: PORTAL CLIENTE - Visual Mockup
// ============================================
const SlideClientPortal = () => {
  const features = [
    "Login seguro por cliente",
    "Timeline visual do projeto",
    "Galeria de fotos e renders",
    "Mensagens internas (fim do WhatsApp)",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-indigo-50/30 relative">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 4</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Portal do Cliente</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-10">
        {/* Visual Mockup */}
        <div className="bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl">
          <div className="bg-slate-200 h-10 flex items-center gap-2 px-5">
            <div className="w-4 h-4 rounded-full bg-red-400" />
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-[14px] text-slate-500 ml-3 flex items-center gap-2">
              <Lock className="w-3 h-3" /> arifa.pt/cliente
            </span>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-40px)]">
            {/* Header mockup */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center text-white font-bold text-xl">T</div>
                <div>
                  <p className="font-semibold text-[#1e3a5f] text-lg">Olá, Teresa!</p>
                  <p className="text-slate-500 text-sm">Casa na Comporta</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-6 h-6 text-slate-400" />
                <div className="w-2 h-2 rounded-full bg-red-500 -ml-2 -mt-3" />
              </div>
            </div>
            
            {/* Progress */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="font-medium text-[#1e3a5f]">Progresso do Projeto</span>
                <span className="text-[#3D7081] font-bold text-xl">75%</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-full bg-gradient-to-r from-[#3D7081] to-[#4D8091] rounded-full"
                />
              </div>
              <p className="text-slate-500 text-sm mt-2">Fase atual: Construção</p>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: Clock, label: "Timeline", count: "" },
                { icon: Image, label: "Fotos", count: "24" },
                { icon: FileText, label: "Docs", count: "12" },
                { icon: MessageSquare, label: "Msgs", count: "3" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center"
                >
                  <div className="w-10 h-10 mx-auto rounded-lg bg-[#3D7081]/10 flex items-center justify-center mb-2">
                    <item.icon className="w-5 h-5 text-[#3D7081]" />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">{item.label}</p>
                  {item.count && <span className="text-xs text-[#3D7081] font-bold">{item.count}</span>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-6 text-[24px]">Onde os teus clientes acompanham tudo</p>
          <div className="space-y-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[22px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <p className="text-[#1e3a5f] text-[18px] font-semibold flex items-center gap-3">
              <Shield className="w-6 h-6 text-[#3D7081]" />
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
// SLIDE 9: DASHBOARD ADMIN - Visual Mockup
// ============================================
const SlideAdminDashboard = () => {
  const features = [
    "Visão de todos os projetos",
    "Gestão de clientes e contratos",
    "Biblioteca de documentos",
    "Relatórios automáticos",
  ];

  const kpis = [
    { label: "Projetos", value: "12", color: "bg-blue-100 text-blue-700" },
    { label: "Ativos", value: "5", color: "bg-green-100 text-green-700" },
    { label: "Leads", value: "8", color: "bg-amber-100 text-amber-700" },
    { label: "Valor", value: "245k", color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-emerald-50/30 relative">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <LayoutDashboard className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 5</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Dashboard Admin</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-10">
        {/* Visual Mockup */}
        <div className="bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl">
          <div className="bg-slate-200 h-10 flex items-center gap-2 px-5">
            <div className="w-4 h-4 rounded-full bg-red-400" />
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-[14px] text-slate-500 ml-3 flex items-center gap-2">
              <Lock className="w-3 h-3" /> arifa.pt/admin
            </span>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-40px)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-[#1e3a5f]">Dashboard</h4>
              <span className="text-slate-500 text-sm">Janeiro 2025</span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-4 mb-5">
              {kpis.map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className={`${kpi.color} rounded-2xl p-4 text-center`}
                >
                  <p className="text-3xl font-bold">{kpi.value}</p>
                  <p className="text-sm font-medium opacity-80">{kpi.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Chart mockup */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-4">
              <p className="text-sm font-medium text-slate-600 mb-3">Projetos por mês</p>
              <div className="flex items-end gap-3 h-24">
                {[40, 65, 50, 80, 60, 90].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-[#1e3a5f] to-[#3D7081] rounded-t-lg"
                  />
                ))}
              </div>
            </div>

            {/* Recent leads */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
              <p className="text-sm font-medium text-slate-600 mb-3">Leads recentes</p>
              <div className="space-y-2">
                {["Teresa Oliveira", "João Silva"].map((name, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-700">{name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${i === 0 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                      {i === 0 ? "Novo" : "Proposta"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-6 text-[24px]">O teu painel de comando</p>
          <div className="space-y-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[22px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
            <p className="text-[#1e3a5f] text-[18px] font-semibold flex items-center gap-3">
              <Target className="w-6 h-6 text-[#3D7081]" />
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
// SLIDE 10: CRM KANBAN - 4 features max
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
    "Histórico de atividades",
    "Conversão lead → cliente",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-cyan-50/30 relative">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <Users className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 6</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">CRM de Leads</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-10">
        {/* Kanban Mockup */}
        <div className="bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl">
          <div className="bg-slate-200 h-10 flex items-center gap-2 px-5">
            <div className="w-4 h-4 rounded-full bg-red-400" />
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-[14px] text-slate-500 ml-3">arifa.pt/admin/leads</span>
          </div>
          <div className="p-5 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-40px)]">
            <div className="grid grid-cols-4 gap-4 h-full">
              {stages.map((stage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col"
                >
                  <div className={`text-center text-sm font-bold py-3 rounded-t-xl border-2 ${stage.color}`}>
                    {stage.name} ({stage.count})
                  </div>
                  <div className="flex-1 bg-white/80 border-x-2 border-b-2 border-slate-200 rounded-b-xl p-3 space-y-3">
                    {[...Array(Math.min(stage.count, 3))].map((_, j) => (
                      <div key={j} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                        <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
                        <div className="h-2 w-14 bg-slate-100 rounded" />
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
          <p className="text-slate-700 mb-6 text-[24px]">Nunca percas um lead</p>
          <div className="space-y-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[22px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100">
            <p className="text-[#1e3a5f] text-[18px] font-semibold flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#3D7081]" />
              A IA qualifica leads por ti.
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 11: AUTOMAÇÕES - 4 features max
// ============================================
const SlideAutomations = () => {
  const automations = [
    { name: "Follow-up Automático", trigger: "Cliente sem resposta 5 dias", action: "Email enviado" },
    { name: "Notificação Documento", trigger: "Novo documento", action: "Push notification" },
    { name: "Milestone Concluída", trigger: "Estado muda", action: "Email + Portal" },
  ];

  const features = [
    "Follow-ups automáticos",
    "Notificações smart",
    "Geração de documentos",
    "IA integrada",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-slate-50 relative">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 7</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Automações Inteligentes</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-10">
        {/* Mockup */}
        <div className="bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl">
          <div className="bg-slate-200 h-10 flex items-center gap-2 px-5">
            <div className="w-4 h-4 rounded-full bg-red-400" />
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-[14px] text-slate-500 ml-3">arifa.pt/admin/automacoes</span>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-40px)]">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-[#1e3a5f]">Automações Ativas</h4>
              <div className="px-4 py-2 bg-[#3D7081] text-white text-sm rounded-xl font-medium">+ Nova</div>
            </div>
            
            <div className="space-y-4">
              {automations.map((auto, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-[#1e3a5f] text-lg">{auto.name}</span>
                    <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Se: <span className="font-medium">{auto.trigger}</span> → <span className="text-[#3D7081] font-semibold">{auto.action}</span>
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-6 text-[24px]">O trabalho invisível que liberta tempo</p>
          <div className="space-y-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[22px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <p className="text-[#1e3a5f] text-[18px] font-semibold flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#3D7081]" />
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
// SLIDE 12: TIMELINE
// ============================================
const SlideTimeline = () => {
  const weeks = [
    { week: "Semana 1-2", title: "Discovery", icon: Target, color: "bg-blue-100", iconColor: "text-blue-600", tasks: ["Briefing", "Análise", "Wireframes"] },
    { week: "Semana 3-4", title: "Design", icon: Lightbulb, color: "bg-purple-100", iconColor: "text-purple-600", tasks: ["Visual", "Protótipo", "Feedback"] },
    { week: "Semana 5-6", title: "Desenvolvimento", icon: Settings, color: "bg-amber-100", iconColor: "text-amber-600", tasks: ["Frontend", "Backend", "Testes"] },
    { week: "Semana 7-8", title: "Launch", icon: Rocket, color: "bg-green-100", iconColor: "text-green-600", tasks: ["Deploy", "Formação", "Go-live"] },
  ];

  return (
    <SlideFrame className="bg-white relative">
      <div className="mb-10">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">Plano de entrega</span>
        <h2 className="text-[56px] font-light text-[#1e3a5f] mt-6">6-8 Semanas até ao lançamento</h2>
      </div>

      <div className="flex-1 flex items-center">
        <div className="w-full grid grid-cols-4 gap-6">
          {weeks.map((week, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className={`w-24 h-24 mx-auto rounded-3xl ${week.color} flex items-center justify-center mb-5 shadow-lg`}>
                <week.icon className={`w-12 h-12 ${week.iconColor}`} />
              </div>
              <p className="text-[#3D7081] text-[16px] font-semibold uppercase tracking-wider mb-2">{week.week}</p>
              <h3 className="text-[28px] font-bold text-[#1e3a5f] mb-4">{week.title}</h3>
              <ul className="space-y-2">
                {week.tasks.map((task, j) => (
                  <li key={j} className="text-slate-600 text-[18px]">{task}</li>
                ))}
              </ul>
              {i < weeks.length - 1 && (
                <div className="absolute top-1/2 right-0 w-8 h-0.5 bg-slate-200 translate-x-full" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 text-center"
      >
        <p className="text-[#1e3a5f] text-[20px] flex items-center justify-center gap-4">
          <Calendar className="w-6 h-6" />
          <span className="font-semibold">Comunicação semanal:</span> Reunião de 30min todas as sextas
        </p>
      </motion.div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 13: COMPARAÇÃO
// ============================================
const SlideComparison = () => {
  const traditionalTools = [
    { name: "Website Premium", cost: "1.680 €" },
    { name: "Portal Cliente", cost: "648 €" },
    { name: "CRM + Gestão", cost: "2.028 €" },
    { name: "Assinaturas + Chat", cost: "1.056 €" },
    { name: "PWA Mobile", cost: "12.000 €" },
    { name: "Segurança + Multi-idioma", cost: "2.952 €" },
  ];

  const arifaBenefits = [
    "Tudo integrado em 1 plataforma",
    "100% à medida do teu estúdio",
    "Sem subscrições mensais",
    "Suporte direto AiParaTi",
  ];

  return (
    <SlideFrame className="bg-white relative">
      <div className="mb-8">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">Comparação</span>
        <h2 className="text-[56px] font-light text-[#1e3a5f] mt-6">Outras soluções vs. ARIFA</h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-10">
        {/* Traditional */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <h3 className="text-[20px] font-bold text-red-600 uppercase tracking-wider mb-5 flex items-center gap-3">
            <X className="w-6 h-6" /> Abordagem Tradicional
          </h3>
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-3xl p-6 flex-1 border-2 border-red-200">
            <div className="space-y-3">
              {traditionalTools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex justify-between items-center py-4 px-5 bg-white rounded-xl text-[18px] shadow-sm"
                >
                  <span className="text-slate-700 flex items-center gap-3">
                    <X className="w-5 h-5 text-red-400" />
                    {tool.name}
                  </span>
                  <span className="text-red-600 font-bold">{tool.cost}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t-2 border-red-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-red-700 text-[22px]">TOTAL/ANO</span>
                <span className="font-bold text-red-700 text-[36px]">~20.364 €</span>
              </div>
              <p className="text-[16px] text-red-500 mt-2">+ tempo a integrar manualmente</p>
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
          <h3 className="text-[20px] font-bold text-green-600 uppercase tracking-wider mb-5 flex items-center gap-3">
            <Check className="w-6 h-6" /> Solução ARIFA
          </h3>
          <div className="bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] rounded-3xl p-8 flex-1 text-white shadow-2xl">
            <div className="space-y-4 mb-8">
              {arifaBenefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-center gap-4 py-3"
                >
                  <CheckCircle2 className="w-7 h-7 text-green-300 flex-shrink-0" />
                  <span className="text-blue-100 text-[22px]">{benefit}</span>
                </motion.div>
              ))}
            </div>
            <div className="pt-6 border-t border-white/20">
              <span className="text-blue-200 text-[18px]">Investimento único</span>
              <p className="text-[64px] font-bold mt-2">4.888 €</p>
              <div className="mt-5 flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-green-300" />
                <span className="text-green-300 font-semibold text-[22px]">Poupança: ~56.000 € em 3 anos</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 14: PRICING
// ============================================
const SlidePricing = () => {
  const tiers = [
    {
      name: "Essencial",
      price: "3.500",
      description: "Para começar",
      features: ["Site público", "Portal básico", "30 dias suporte"],
      recommended: false,
    },
    {
      name: "Profissional",
      price: "4.888",
      description: "Solução completa",
      features: ["Tudo do Essencial", "Portal completo", "Automações + IA", "60 dias suporte"],
      recommended: true,
    },
    {
      name: "Premium",
      price: "6.500",
      description: "Tudo + manutenção",
      features: ["Tudo do Profissional", "6 meses manutenção", "Prioridade suporte"],
      recommended: false,
    },
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-slate-50 relative">
      <div className="mb-8 text-center">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">Escolhe o teu plano</span>
        <h2 className="text-[56px] font-light text-[#1e3a5f] mt-6">3 opções à tua medida</h2>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-3xl p-8 flex flex-col relative ${
              tier.recommended
                ? "bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] text-white ring-4 ring-[#3D7081]/30 shadow-2xl z-10 scale-105"
                : "bg-white border-2 border-slate-200 shadow-xl"
            }`}
          >
            {tier.recommended && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-[16px] font-bold px-6 py-2.5 rounded-full shadow-lg flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  RECOMENDADO
                </span>
              </div>
            )}
            <h3 className={`text-[32px] font-bold ${tier.recommended ? "text-white mt-4" : "text-[#1e3a5f]"}`}>
              {tier.name}
            </h3>
            <p className={`text-[18px] mb-5 ${tier.recommended ? "text-blue-200" : "text-slate-500"}`}>
              {tier.description}
            </p>
            <p className={`text-[56px] font-bold mb-6 ${tier.recommended ? "text-white" : "text-[#1e3a5f]"}`}>
              {tier.price} €
            </p>
            
            <div className="flex-1 space-y-4">
              {tier.features.map((feature, j) => (
                <div key={j} className="flex items-center gap-3">
                  <CheckCircle2 className={`w-6 h-6 flex-shrink-0 ${tier.recommended ? "text-green-300" : "text-[#3D7081]"}`} />
                  <span className={`text-[20px] ${tier.recommended ? "text-blue-100" : "text-slate-700"}`}>{feature}</span>
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
        className="mt-8 p-5 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl border-2 border-amber-300 shadow-lg"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
            <Zap className="w-8 h-8 text-amber-900" />
          </div>
          <div>
            <h3 className="font-bold text-amber-900 text-[22px]">Bónus: 4 horas de Formação IA</h3>
            <p className="text-amber-700 text-[18px]">Valor: 400 € — Válido até 18 Janeiro 2025</p>
          </div>
        </div>
      </motion.div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 15: TERMOS
// ============================================
const SlideTerms = () => {
  return (
    <SlideFrame className="bg-gradient-to-br from-white to-slate-50 relative">
      <div className="mb-8">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">Termos & Condições</span>
        <h2 className="text-[56px] font-light text-[#1e3a5f] mt-6">Como funciona</h2>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-8">
        {/* Payment */}
        <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-xl">
          <h3 className="font-bold text-[#1e3a5f] mb-6 flex items-center gap-4 text-[24px]">
            <div className="w-14 h-14 rounded-2xl bg-[#1e3a5f]/10 flex items-center justify-center">
              <Euro className="w-7 h-7 text-[#1e3a5f]" />
            </div>
            Pagamento
          </h3>
          <p className="text-[48px] font-bold text-[#1e3a5f] mb-6">4.888 €</p>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-4 px-5 bg-slate-50 rounded-2xl">
              <span className="text-slate-700 text-[20px]">40% assinatura</span>
              <span className="font-bold text-[#1e3a5f] text-[22px]">1.955 €</span>
            </div>
            <div className="flex justify-between items-center py-4 px-5 bg-slate-50 rounded-2xl">
              <span className="text-slate-700 text-[20px]">40% go-live</span>
              <span className="font-bold text-[#1e3a5f] text-[22px]">1.955 €</span>
            </div>
            <div className="flex justify-between items-center py-4 px-5 bg-slate-50 rounded-2xl">
              <span className="text-slate-700 text-[20px]">20% após 30 dias</span>
              <span className="font-bold text-[#1e3a5f] text-[22px]">978 €</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 border-2 border-blue-100">
            <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-3 text-[22px]">
              <Calendar className="w-7 h-7" /> Prazo de Entrega
            </h3>
            <p className="text-[48px] font-bold text-[#1e3a5f]">6-8 semanas</p>
            <p className="text-[18px] text-slate-600">Após aprovação do design</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-6 border-2 border-green-100 flex-1">
            <h3 className="font-bold text-green-700 mb-4 flex items-center gap-3 text-[22px]">
              <CheckCircle2 className="w-7 h-7" /> Incluído
            </h3>
            <ul className="space-y-3">
              {["Site público completo", "Portal do cliente", "Dashboard admin", "60 dias suporte"].map((item, i) => (
                <li key={i} className="text-[18px] text-green-700 flex items-center gap-3">
                  <Check className="w-5 h-5" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Optional + Bonus */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-6 border-2 border-purple-100">
            <h3 className="font-bold text-purple-700 mb-4 flex items-center gap-3 text-[22px]">
              <Settings className="w-7 h-7" /> Opcional
            </h3>
            <p className="text-[18px] text-purple-600">Manutenção mensal</p>
            <p className="text-[36px] font-bold text-purple-700">150-250 €/mês</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-6 border-2 border-amber-300">
            <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-3 text-[22px]">
              <Sparkles className="w-7 h-7" /> Bónus Exclusivo
            </h3>
            <p className="text-[18px] text-amber-700">4 horas Formação IA</p>
            <p className="text-[28px] font-bold text-amber-900">Valor: 400 €</p>
            <p className="text-[16px] text-amber-700 mt-2 flex items-center gap-2">
              <Timer className="w-5 h-5" /> Até 18 Janeiro 2025
            </p>
          </div>
        </div>
      </div>
      
      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 16: FAQ - Reduced to 4 questions
// ============================================
const SlideFAQ = () => {
  const faqs = [
    { q: "E se quiser mudar algo depois?", a: "60 dias de suporte incluído. Depois, manutenção mensal opcional." },
    { q: "E se o projeto atrasar?", a: "Comunicação semanal. Se atrasar do nosso lado, desconto proporcional." },
    { q: "Posso adicionar funcionalidades?", a: "Sim! Orçamento adicional para novas features." },
    { q: "Como funciona o suporte?", a: "Email + WhatsApp. Resposta em 24h úteis." },
  ];

  return (
    <SlideFrame className="bg-white relative">
      <div className="mb-10 text-center">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">Dúvidas frequentes</span>
        <h2 className="text-[56px] font-light text-[#1e3a5f] mt-6">Perguntas & Respostas</h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 border-2 border-slate-100 shadow-lg"
          >
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                <HelpCircle className="w-7 h-7 text-[#3D7081]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1e3a5f] text-[24px] mb-3">{faq.q}</h3>
                <p className="text-slate-600 text-[20px] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-slate-500 text-[20px]">
          Mais perguntas? <span className="font-semibold text-[#1e3a5f]">Falamos na call!</span>
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
    "Formulário inteligente com segmento",
    "Notificação instantânea",
    "AI Lead Scoring automático",
    "Integração com WhatsApp",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-rose-50/30 relative">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <Mail className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade Bónus</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Página de Contacto</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-10">
        {/* Screenshot */}
        <div className="bg-slate-100 rounded-3xl overflow-hidden border-2 border-slate-200 shadow-2xl">
          <div className="bg-slate-200 h-10 flex items-center gap-2 px-5">
            <div className="w-4 h-4 rounded-full bg-red-400" />
            <div className="w-4 h-4 rounded-full bg-yellow-400" />
            <div className="w-4 h-4 rounded-full bg-green-400" />
            <span className="text-[14px] text-slate-500 ml-3">arifa.pt/contacto</span>
          </div>
          <img 
            src={screenshotContacto} 
            alt="Screenshot Contacto" 
            className="w-full h-[calc(100%-40px)] object-cover object-top"
          />
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-6 text-[24px]">Converte visitantes em leads</p>
          <div className="space-y-5">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-5 p-6 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-12 h-12 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[22px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl border border-rose-100">
            <p className="text-[#1e3a5f] text-[18px] font-semibold flex items-center gap-3">
              <Zap className="w-6 h-6 text-[#3D7081]" />
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
    { name: "React", color: "bg-sky-100 text-sky-700" },
    { name: "TypeScript", color: "bg-blue-100 text-blue-700" },
  ];

  return (
    <SlideFrame padding="p-14" className="bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#3D7081] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-56 h-56 border border-white/30 rotate-45" />
        <div className="absolute bottom-20 left-20 w-40 h-40 border border-white/30 rotate-12" />
      </div>

      <div className="mb-6 text-center relative z-10">
        <span className="text-[18px] font-semibold text-white/60 uppercase tracking-wider bg-white/10 px-5 py-2 rounded-full">O momento</span>
        <h2 className="text-[56px] font-light text-white mt-6">Pronta para começar, Teresa?</h2>
      </div>

      {/* Offer Reminder */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-5 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-2xl border border-amber-400/30 text-center backdrop-blur-sm relative z-10"
      >
        <p className="text-amber-200 text-[22px] font-medium flex items-center justify-center gap-4">
          <Timer className="w-6 h-6" />
          <span className="font-bold text-amber-100">4h Formação IA GRÁTIS</span> se aceitares até 18 Janeiro
        </p>
      </motion.div>

      <div className="flex-1 grid grid-cols-2 gap-8 relative z-10">
        {/* Team */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
        >
          <h3 className="text-white font-bold mb-6 flex items-center gap-4 text-[26px]">
            <Users className="w-8 h-8 text-white/70" />
            Quem vai trabalhar contigo
          </h3>
          <div className="flex items-center gap-6 mb-6">
            <div className="flex -space-x-4">
              <img 
                src={teamBilal} 
                alt="Bilal Machraa" 
                className="w-24 h-24 rounded-full object-cover border-4 border-amber-400/50 shadow-xl"
              />
              <img 
                src={teamHelder} 
                alt="Helder Faria" 
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-400/50 shadow-xl"
              />
            </div>
            <div>
              <p className="text-white font-bold text-[24px]">Bilal & Helder</p>
              <p className="text-white/60 text-[18px]">AiParaTi — A tua equipa</p>
            </div>
          </div>
          
          {/* Tech badges */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-white/50 text-[16px] mb-4">Tecnologias:</p>
            <div className="flex flex-wrap gap-3">
              {techBadges.map((badge, i) => (
                <span key={i} className={`text-[16px] px-4 py-2 rounded-full font-semibold ${badge.color}`}>
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
          className="bg-white rounded-3xl p-8 shadow-2xl flex flex-col"
        >
          <div className="text-center mb-6">
            <Rocket className="w-16 h-16 text-[#3D7081] mx-auto mb-5" />
            <h3 className="text-[32px] font-bold text-[#1e3a5f]">Vamos avançar?</h3>
            <p className="text-slate-500 mt-2 text-[20px]">
              Estamos prontos para transformar o teu estúdio.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="space-y-4 mb-6">
            <Button size="lg" className="w-full gap-4 bg-gradient-to-r from-[#1e3a5f] to-[#3D7081] hover:from-[#2a4a6f] hover:to-[#4D8091] text-white shadow-lg text-[20px] h-16">
              <CheckCircle2 className="w-7 h-7" />
              Aceitar Proposta
            </Button>
            <Button size="lg" variant="outline" className="w-full gap-4 border-2 border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f]/5 text-[20px] h-16">
              <Calendar className="w-7 h-7" />
              Agendar Call
            </Button>
          </div>
          
          {/* Contacts */}
          <div className="pt-5 border-t border-slate-100">
            <p className="text-[16px] text-slate-500 text-center mb-4">Contacta-nos:</p>
            <div className="flex flex-col gap-3">
              <a 
                href="mailto:bilal.machraa@aiparati.pt" 
                className="flex items-center justify-center gap-3 text-[#1e3a5f] hover:underline bg-slate-50 rounded-xl py-4 text-[18px] font-medium"
              >
                <Mail className="w-6 h-6" />
                bilal.machraa@aiparati.pt
              </a>
              <a 
                href="https://wa.me/351918911308" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 text-green-600 hover:underline bg-green-50 rounded-xl py-4 text-[18px] font-medium"
              >
                <Phone className="w-6 h-6" />
                +351 918 911 308
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
        className="mt-6 text-center relative z-10"
      >
        <p className="text-[18px] text-white/50">
          Proposta por <span className="font-semibold text-white/70">AiParaTi</span> | Design: <span className="font-semibold text-white/70">Helder Faria</span>
        </p>
      </motion.div>
    </SlideFrame>
  );
};

export default SalesPresentation;
