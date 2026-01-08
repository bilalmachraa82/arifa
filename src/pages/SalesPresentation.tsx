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
  Bell,
  ZoomIn,
  Rotate3D,
  Play,
  Wallet,
  FileSignature
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
import screenshotPortfolioFilters from "@/assets/screenshot-portfolio-filters.png";
import screenshotProjectGallery from "@/assets/screenshot-project-detail-gallery.png";
import teamBilal from "@/assets/team-bilal.png";
import teamHelder from "@/assets/team-helder.png";

// ============================================
// CONSTANTS
// ============================================
const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;
const TOTAL_SLIDES = 19;

// ============================================
// GLOBAL SIGNATURE - Bigger for Zoom 2026
// ============================================
const GlobalSignature = () => (
  <div className="absolute bottom-6 right-8 flex items-center gap-3">
    <div className="h-px w-12 bg-gradient-to-r from-transparent to-slate-300" />
    <span className="text-[14px] text-slate-400 font-medium tracking-wide">
      AiParaTi
    </span>
    <span className="text-slate-300">•</span>
    <span className="text-[14px] text-slate-400">
      Plataforma ARIFA
    </span>
    <span className="text-slate-300">•</span>
    <span className="text-[14px] text-slate-400">
      Design: Helder Faria
    </span>
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
                {currentSlide === 8 && <SlidePhotoGallery />}
                {currentSlide === 9 && <SlideAdminDashboard />}
                {currentSlide === 10 && <SlideCRM />}
                {currentSlide === 11 && <SlideAutomations />}
                {currentSlide === 12 && <SlideContacto />}
                {currentSlide === 13 && <SlideTimeline />}
                {currentSlide === 14 && <SlideFAQ />}
                {currentSlide === 15 && <SlideComparison />}
                {currentSlide === 16 && <SlidePricing />}
                {currentSlide === 17 && <SlideTerms />}
                {currentSlide === 18 && <SlideNextSteps />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div
        className={`bg-slate-800 border-t border-slate-700 px-4 py-3 transition-all duration-300 ${hideControls ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <button
                key={i}
                onClick={() => handleSlideClick(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${i === currentSlide
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

    {/* AiParaTi Badge - Premium */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="absolute top-12 left-12 flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20 shadow-2xl"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white to-white/90 flex items-center justify-center shadow-lg">
        <span className="text-[#1e3a5f] font-bold text-xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] bg-clip-text text-transparent">Ai</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-semibold text-white">AiParaTi</span>
        <span className="text-[12px] text-white/50 uppercase tracking-widest">Digital Solutions</span>
      </div>
    </motion.div>

    {/* Content */}
    <div className="text-center z-10 px-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="relative">
          <div className="w-36 h-36 mx-auto border-2 border-white/60 rotate-45 flex items-center justify-center shadow-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md">
            <span className="text-white font-bold text-6xl -rotate-45 drop-shadow-lg">A</span>
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 w-36 h-36 mx-auto rotate-45 bg-white/10 blur-xl" />
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
      title: "GESTÃO NÃO INTEGRADA",
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
      title: "INFORMAÇÃO DISPERSA",
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
      desc: "Portfólio + SEO",
      badge: null
    },
    {
      icon: Lock,
      title: "Portal do Cliente",
      desc: "Área privada",
      badge: "PRIVADO"
    },
    {
      icon: LayoutDashboard,
      title: "Backoffice",
      desc: "Gestão centralizada",
      badge: "ADMIN"
    },
    {
      icon: Zap,
      title: "Automações",
      desc: "Follow-ups automáticos",
      badge: null
    },
    {
      icon: Shield,
      title: "Segurança",
      desc: "RGPD compliant",
      badge: null
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
              className="flex flex-col items-center text-center p-8 pt-10 rounded-3xl bg-white border border-slate-100 shadow-xl relative mt-4"
            >
              {item.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className={`text-[12px] font-bold px-3 py-1 rounded-full whitespace-nowrap ${item.badge === "PRIVADO"
                    ? "bg-indigo-100 text-indigo-700 border border-indigo-200"
                    : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    }`}>
                    {item.badge}
                  </span>
                </div>
              )}
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center mb-6 shadow-xl">
                <item.icon className="w-12 h-12 text-white" />
              </div>
              <h3 className="font-bold text-[#1e3a5f] text-[22px] mb-2 leading-tight">{item.title}</h3>
              <p className="text-[#3D7081] text-[16px] font-medium">{item.desc}</p>
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
    "Homepage com segmentos (Privado, Empresas, Investidores)",
    "Portfolio com filtros + pesquisa + estados visuais",
    "Blog + Lead Magnets + Newsletter",
    "Páginas de Serviços + Sobre + Contacto com CRM",
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
        {/* Screenshot - Premium Frame with Multiple Views */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(61, 112, 129, 0.25)' }}
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 h-12 flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-sm" />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-sm" />
              <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm" />
            </div>
            <div className="bg-slate-600/50 rounded-lg px-4 py-1.5 text-[13px] text-slate-300 font-mono">
              arifa.pt
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-[#3D7081] text-white text-[10px] px-2 py-0.5 rounded font-bold">SSL</div>
              <div className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">i18n</div>
            </div>
          </div>
          <div className="p-5 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-48px)]">
            {/* Header Mockup */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg" />
                <div className="h-3 w-16 bg-slate-200 rounded" />
              </div>
              <div className="flex gap-3 text-[10px]">
                <span className="text-slate-500">Serviços</span>
                <span className="text-slate-500">Portfolio</span>
                <span className="text-slate-500">Blog</span>
                <span className="bg-[#3D7081] text-white px-2 py-0.5 rounded">Contacto</span>
              </div>
            </div>

            {/* Hero with Segment Selector */}
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#3D7081] rounded-2xl p-4 mb-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <div className="h-4 w-2/3 bg-white/30 rounded mb-2" />
              <div className="h-2.5 w-1/2 bg-white/20 rounded mb-3" />
              {/* Segment Pills */}
              <div className="flex gap-2 mb-3">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="px-2 py-1 bg-white/90 rounded-full text-[9px] font-bold text-[#1e3a5f]">🏠 Privados</motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="px-2 py-1 bg-white/20 rounded-full text-[9px] text-white">🏢 Empresas</motion.div>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="px-2 py-1 bg-white/20 rounded-full text-[9px] text-white">📈 Investidores</motion.div>
              </div>
              <div className="h-6 w-24 bg-white rounded-lg" />
            </div>

            {/* Featured Projects Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { status: "Concluído", color: "bg-emerald-500" },
                { status: "Em Projeto", color: "bg-amber-500" },
                { status: "Em Construção", color: "bg-blue-500" },
              ].map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
                >
                  <div className="h-16 bg-gradient-to-br from-slate-200 to-slate-300 relative">
                    <span className={`absolute top-1 right-1 text-[7px] text-white px-1.5 py-0.5 rounded-full ${project.color}`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="p-1.5">
                    <div className="h-2 w-3/4 bg-slate-200 rounded mb-0.5" />
                    <div className="h-1.5 w-1/2 bg-slate-100 rounded" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Testimonials + Blog Preview */}
            <div className="grid grid-cols-2 gap-2">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-lg p-2 border border-slate-100"
              >
                <div className="flex items-center gap-1 mb-1">
                  <div className="w-5 h-5 rounded-full bg-slate-200" />
                  <div className="text-[8px] text-slate-400">★★★★★</div>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded mb-0.5" />
                <div className="h-1.5 w-3/4 bg-slate-100 rounded" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
                className="bg-white rounded-lg p-2 border border-slate-100"
              >
                <div className="h-2 w-full bg-slate-200 rounded mb-1" />
                <div className="h-1.5 w-2/3 bg-slate-100 rounded mb-1" />
                <div className="text-[7px] text-[#3D7081] font-bold">Ler artigo →</div>
              </motion.div>
            </div>
          </div>
        </motion.div>

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
                <p className="text-slate-800 text-[20px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <p className="text-[#1e3a5f] text-[18px] font-semibold flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              SEO + Analytics + PWA — performance máxima.
            </p>
          </div>
        </div>
      </div>

      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 6: PORTFOLIO - 5 features aligned with real app
// ============================================
const SlidePortfolio = () => {
  const features = [
    "Filtros por categoria, localização e segmento",
    "Estados visuais (Em Estudo, Em Construção, Concluído)",
    "Pesquisa instantânea + ordenação",
    "Galeria Premium com Lightbox (zoom 400%, slideshow)",
    "Página de detalhe rica com galeria + info",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-purple-50/30 relative">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <FolderOpen className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 2</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Portfolio de Projetos</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Screenshot - Premium Frame with Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(61, 112, 129, 0.25)' }}
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 h-10 flex items-center justify-between px-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="bg-slate-600/50 rounded-lg px-3 py-1 text-[11px] text-slate-300 font-mono">
              arifa.pt/portfolio
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">LIVE</div>
              <div className="bg-purple-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">i18n</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-40px)]">
            {/* Search + Filters Row */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1 flex items-center gap-1">
                <Eye className="w-3 h-3 text-slate-400" />
                <div className="h-2 w-16 bg-slate-200 rounded" />
              </div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="h-6 px-2 bg-[#1e3a5f] text-white text-[9px] rounded-lg flex items-center">Todos</motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="h-6 px-2 bg-slate-100 text-slate-600 text-[9px] rounded-lg flex items-center">Residencial</motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="h-6 px-2 bg-slate-100 text-slate-600 text-[9px] rounded-lg flex items-center">Comercial</motion.div>
            </div>

            {/* Segment Pills */}
            <div className="flex gap-1 mb-3">
              {['🏠 Privados', '🏢 Empresas', '📈 Investidores'].map((seg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className={`px-2 py-0.5 rounded-full text-[8px] font-medium ${i === 0 ? 'bg-[#3D7081] text-white' : 'bg-slate-100 text-slate-500'}`}
                >
                  {seg}
                </motion.div>
              ))}
            </div>

            {/* Projects Grid Mockup */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { status: "Concluído", color: "bg-emerald-500" },
                { status: "Em Estudo", color: "bg-amber-500" },
                { status: "Concluído", color: "bg-emerald-500" },
                { status: "Em Construção", color: "bg-blue-500" },
              ].map((project, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.05 }}
                  className="bg-white rounded-lg overflow-hidden border border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
                >
                  <div className="h-16 bg-gradient-to-br from-slate-200 to-slate-300 relative">
                    <span className={`absolute top-1 right-1 text-[7px] text-white px-1.5 py-0.5 rounded-full ${project.color}`}>
                      {project.status}
                    </span>
                    <div className="absolute bottom-1 left-1 text-[6px] text-slate-600 bg-white/80 px-1 rounded">📍 Lisboa</div>
                  </div>
                  <div className="p-1.5">
                    <div className="h-2 w-3/4 bg-slate-200 rounded mb-0.5" />
                    <div className="h-1.5 w-1/2 bg-slate-100 rounded" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Lightbox Preview Hint */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-2 flex items-center justify-center gap-1 text-[8px] text-[#3D7081]"
            >
              <Camera className="w-3 h-3" />
              <span>Clica para abrir Lightbox Premium</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-5 text-[22px]">Mostra o teu trabalho com classe</p>
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[18px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
            <p className="text-[#1e3a5f] text-[16px] font-semibold flex items-center gap-3">
              <Eye className="w-5 h-5 text-[#3D7081]" />
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
// SLIDE 7: BLOG - 5 features aligned with real app
// ============================================
const SlideBlog = () => {
  const features = [
    "Artigos com imagens + tempo de leitura",
    "Categorias dinâmicas + pesquisa",
    "Artigos destacados (Featured)",
    "Newsletter integrada com Resend",
    "Lead magnets para captura de contactos",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-orange-50/30 relative">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <FileText className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 3</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Blog & Conteúdo</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Screenshot - Premium Frame with Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(61, 112, 129, 0.25)' }}
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 h-10 flex items-center justify-between px-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="bg-slate-600/50 rounded-lg px-3 py-1 text-[11px] text-slate-300 font-mono">
              arifa.pt/blog
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">SEO</div>
              <div className="bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">RSS</div>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-40px)]">
            {/* Categories Row */}
            <div className="flex gap-1.5 mb-3 flex-wrap">
              {['Tendências', 'Sustentabilidade', 'Materiais', 'Inovação'].map((cat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className={`h-5 px-2 text-[9px] font-medium rounded-full flex items-center ${i === 0 ? 'bg-[#3D7081] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors'
                    }`}
                >
                  {cat}
                </motion.div>
              ))}
            </div>

            {/* Featured Article */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl p-2 border border-slate-100 shadow-sm mb-2 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 bg-amber-500 text-white text-[7px] px-1.5 py-0.5 rounded-full font-bold">
                ⭐ DESTAQUE
              </div>
              <div className="flex gap-2">
                <div className="w-20 h-14 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-2.5 w-full bg-slate-200 rounded mb-1" />
                  <div className="h-2 w-2/3 bg-slate-100 rounded mb-1.5" />
                  <div className="flex items-center gap-2 text-[7px] text-slate-400">
                    <span>📅 5 Jan 2025</span>
                    <span>⏱ 5 min</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Article List */}
            <div className="space-y-1.5">
              {[1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex gap-2 bg-white rounded-lg p-2 border border-slate-100 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all"
                >
                  <div className="w-12 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-2 w-full bg-slate-200 rounded mb-0.5" />
                    <div className="h-1.5 w-3/4 bg-slate-100 rounded mb-1" />
                    <div className="text-[6px] text-slate-400">⏱ {3 + i} min</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Newsletter CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-2 bg-gradient-to-r from-[#1e3a5f] to-[#3D7081] rounded-lg p-2 text-white"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <div className="flex-1">
                  <div className="text-[9px] font-medium">Subscreve a Newsletter</div>
                  <div className="text-[7px] opacity-70">Recebe novidades semanais</div>
                </div>
                <div className="bg-white text-[#1e3a5f] text-[8px] px-2 py-1 rounded font-bold">OK</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-5 text-[22px]">Conteúdo que gera autoridade</p>
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[18px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
            <p className="text-[#1e3a5f] text-[16px] font-semibold flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-[#3D7081]" />
              SEO otimizado — clientes encontram-te no Google.
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
    "Timeline RIBA (7 fases) + Milestones",
    "AI Weekly Updates (resumo inteligente)",
    "Fotos de progresso + Galeria Premium",
    "Orçamento + Contratos + Documentos versionados",
    "Mensagens internas em tempo real",
  ];

  const tabs = [
    { icon: FolderOpen, label: "Projetos", active: true },
    { icon: Camera, label: "Fotos", active: false },
    { icon: Wallet, label: "Budget", active: false },
    { icon: FileText, label: "Docs", active: false },
    { icon: FileSignature, label: "Contratos", active: false },
    { icon: MessageSquare, label: "Msgs", count: 3, active: false },
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-indigo-50/30 relative">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 4</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Portal do Cliente</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Visual Mockup - Enhanced */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(61, 112, 129, 0.25)' }}
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 h-10 flex items-center justify-between px-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center gap-2 text-[12px] text-slate-300">
              <Lock className="w-3 h-3" />
              <span className="font-mono">arifa.pt/cliente</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">MFA</div>
              <div className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">RLS</div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-40px)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center text-white font-bold text-sm">T</div>
                <div>
                  <p className="font-semibold text-[#1e3a5f] text-sm">Olá, Teresa!</p>
                  <p className="text-slate-500 text-[10px]">Casa na Comporta</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-slate-400" />
                <div className="w-2 h-2 rounded-full bg-red-500 -ml-2 -mt-3" />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-3 overflow-x-auto">
              {tabs.map((tab, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.03 }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-medium whitespace-nowrap ${tab.active
                    ? 'bg-[#3D7081] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  <tab.icon className="w-3 h-3" />
                  {tab.label}
                  {tab.count && <span className="bg-red-500 text-white text-[7px] px-1 rounded-full">{tab.count}</span>}
                </motion.div>
              ))}
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-[#1e3a5f] text-sm">Progresso</span>
                <span className="text-[#3D7081] font-bold">75%</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-full bg-gradient-to-r from-[#3D7081] to-emerald-500 rounded-full"
                />
              </div>
              <p className="text-slate-500 text-[10px] mt-1">Fase atual: Construção (RIBA 5)</p>
            </div>

            {/* AI Weekly Update Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-3 border border-purple-100 mb-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-800 text-[11px]">AI Weekly Update</span>
                <span className="bg-purple-200 text-purple-700 text-[8px] px-1.5 py-0.5 rounded-full font-bold">NOVO</span>
              </div>
              <div className="h-1.5 w-full bg-purple-200/50 rounded mb-1" />
              <div className="h-1.5 w-4/5 bg-purple-200/50 rounded" />
            </motion.div>

            {/* Timeline Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1">
              {['Prep', 'Conceito', 'Coord', 'Técnico', 'Construção', 'Entrega', 'Uso'].map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.03 }}
                  className={`px-2 py-1 rounded-full text-[8px] font-medium whitespace-nowrap ${i < 4 ? 'bg-emerald-100 text-emerald-700' :
                    i === 4 ? 'bg-[#3D7081] text-white ring-2 ring-[#3D7081]/30' :
                      'bg-slate-100 text-slate-400'
                    }`}
                >
                  {phase}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-5 text-[22px]">Onde os clientes acompanham tudo</p>
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[18px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <p className="text-[#1e3a5f] text-[16px] font-semibold flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#3D7081]" />
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
// SLIDE 9: GALERIA DE FOTOS - Screenshots Reais
// ============================================
const SlidePhotoGallery = () => {
  const features = [
    "Zoom até 400% com pan suave",
    "Rotação 90° e slideshow automático",
    "Navegação por teclado e touch",
    "Download individual de imagens",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-violet-50/30 relative">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <Camera className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 5</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Galeria de Fotos Premium</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[62%,38%] gap-6">
        {/* Layout em L - Lightbox Principal + Mockups Secundários */}
        <div className="grid grid-cols-[65%,35%] gap-4 h-full">
          {/* Lightbox Premium - Elemento Principal (row-span-2) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="row-span-2 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl relative"
            style={{ boxShadow: '0 0 60px rgba(61, 112, 129, 0.3)' }}
          >
            <div className="bg-slate-800 h-10 flex items-center justify-between px-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-[13px] text-white font-semibold">Lightbox Premium</span>
              <div className="flex items-center gap-2">
                <div className="bg-[#3D7081] text-white text-[10px] px-2 py-0.5 rounded font-bold">HD</div>
                <X className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Controls Bar */}
            <div className="bg-slate-800/80 px-4 py-2 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
                <div className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Rotate3D className="w-4 h-4 text-white" />
                </div>
                <div className="p-2 bg-[#3D7081] rounded-lg">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <div className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <Download className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-slate-400 text-sm">3 de 24 fotos</span>
            </div>

            {/* Main Image Area */}
            <div className="relative flex-1 p-4">
              <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3D7081]/20 to-transparent" />
                <Camera className="w-16 h-16 text-slate-500" />
                <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <span className="text-white text-sm font-bold">400%</span>
                </div>
                {/* Navigation Arrows */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
                  <ChevronLeft className="w-6 h-6 text-white" />
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="w-[12%] h-full bg-[#3D7081] rounded-full" />
              </div>

              {/* Thumbnails */}
              <div className="mt-3 flex gap-2 justify-center">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`w-14 h-10 rounded-lg ${i === 3 ? 'ring-2 ring-[#3D7081] ring-offset-2 ring-offset-slate-900' : ''} bg-gradient-to-br from-slate-700 to-slate-600 transition-all hover:scale-105`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Portfolio Grid - Superior Direito */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xl"
          >
            <div className="bg-slate-100 h-8 flex items-center gap-1.5 px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-[10px] text-slate-500 ml-2">/portfolio</span>
            </div>
            <div className="p-3 bg-gradient-to-br from-slate-50 to-white">
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-12 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 ${i === 1 ? 'ring-2 ring-[#3D7081]' : ''} hover:scale-105 transition-transform`}
                  />
                ))}
              </div>
              <div className="mt-2 flex gap-1">
                {['Todos', 'Residencial', 'Comercial'].map((cat, i) => (
                  <span key={i} className={`text-[8px] px-2 py-0.5 rounded-full ${i === 0 ? 'bg-[#3D7081] text-white' : 'bg-slate-100 text-slate-500'}`}>{cat}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Project Detail - Inferior Direito */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xl"
          >
            <div className="bg-slate-100 h-8 flex items-center gap-1.5 px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-[10px] text-slate-500 ml-2">/projeto</span>
            </div>
            <div className="p-3 bg-gradient-to-br from-slate-50 to-white">
              <div className="h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl mb-2 flex items-center justify-center relative overflow-hidden">
                <Camera className="w-6 h-6 text-slate-400" />
                <div className="absolute bottom-1 right-1 bg-black/40 backdrop-blur-sm text-white text-[8px] px-1.5 py-0.5 rounded">
                  +12 fotos
                </div>
              </div>
              <div className="h-2 w-3/4 bg-slate-200 rounded mb-1" />
              <div className="h-1.5 w-1/2 bg-slate-100 rounded" />
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-5 text-[22px]">Lightbox premium em cada projeto</p>
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[20px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
            <p className="text-[#1e3a5f] text-[16px] font-semibold flex items-center gap-3">
              <Eye className="w-5 h-5 text-[#3D7081]" />
              Clica em qualquer foto → abre em fullscreen.
            </p>
          </div>
        </div>
      </div>

      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 10: DASHBOARD ADMIN - All real features
// ============================================
const SlideAdminDashboard = () => {
  const features = [
    "KPIs em tempo real (projetos, leads, valor)",
    "Gestão de projetos + milestones + fotos",
    "Orçamentos + Ordens de alteração",
    "Orçamentos PDF + Contratos assinatura digital",
    "Audit logs de todas as ações",
  ];

  const tabs = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: FolderOpen, label: "Projetos", active: false },
    { icon: Target, label: "Milestones", active: false },
    { icon: Camera, label: "Fotos", active: false },
    { icon: Users, label: "Leads", active: false },
    { icon: FileText, label: "Blog", active: false },
    { icon: FileSignature, label: "Quotes", active: false },
    { icon: Wallet, label: "Budget", active: false },
  ];

  const kpis = [
    { label: "Projetos", value: "12", color: "bg-blue-100 text-blue-700", icon: FolderOpen },
    { label: "Ativos", value: "5", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    { label: "Leads", value: "8", color: "bg-amber-100 text-amber-700", icon: Users },
    { label: "Valor", value: "245k", color: "bg-purple-100 text-purple-700", icon: Euro },
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-emerald-50/30 relative">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <LayoutDashboard className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 6</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Dashboard Admin</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Visual Mockup - Enhanced */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(61, 112, 129, 0.25)' }}
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 h-10 flex items-center justify-between px-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-300">
              <Lock className="w-3 h-3" />
              <span className="font-mono">arifa.pt/admin</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">ADMIN</div>
              <div className="bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">RLS</div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-40px)]">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-bold text-[#1e3a5f]">Dashboard</h4>
              <span className="text-slate-500 text-[10px]">Janeiro 2025</span>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-3 overflow-x-auto">
              {tabs.map((tab, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.02 }}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[8px] font-medium whitespace-nowrap ${tab.active
                    ? 'bg-[#3D7081] text-white'
                    : 'bg-slate-100 text-slate-500'
                    }`}
                >
                  <tab.icon className="w-2.5 h-2.5" />
                  {tab.label}
                </motion.div>
              ))}
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              {kpis.map((kpi, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className={`${kpi.color} rounded-xl p-2 text-center`}
                >
                  <kpi.icon className="w-4 h-4 mx-auto mb-1 opacity-70" />
                  <p className="text-lg font-bold">{kpi.value}</p>
                  <p className="text-[9px] font-medium opacity-80">{kpi.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Chart mockup */}
            <div className="bg-white rounded-xl p-2 border border-slate-100 shadow-sm mb-2">
              <p className="text-[10px] font-medium text-slate-600 mb-2">Projetos por mês</p>
              <div className="flex items-end gap-2 h-14">
                {[40, 65, 50, 80, 60, 90].map((height, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
                    className="flex-1 bg-gradient-to-t from-[#1e3a5f] to-[#3D7081] rounded-t"
                  />
                ))}
              </div>
            </div>

            {/* Recent leads */}
            <div className="bg-white rounded-xl p-2 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-medium text-slate-600">Leads recentes</p>
                <span className="text-[8px] text-[#3D7081] font-medium">Ver Kanban →</span>
              </div>
              <div className="space-y-1">
                {["Teresa Oliveira", "João Silva"].map((name, i) => (
                  <div key={i} className="flex items-center justify-between py-1 px-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">{name[0]}</div>
                      <span className="text-[10px] text-slate-700">{name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${i === 0 ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>
                        {i === 0 ? "Novo" : "Proposta"}
                      </span>
                      <span className="text-[8px] text-emerald-600 font-bold">AI: {85 - i * 10}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-5 text-[22px]">O teu painel de comando</p>
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[18px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
            <p className="text-[#1e3a5f] text-[16px] font-semibold flex items-center gap-3">
              <Target className="w-5 h-5 text-[#3D7081]" />
              Gestão completa num único lugar.
            </p>
          </div>
        </div>
      </div>

      <GlobalSignature />
    </SlideFrame>
  );
};

// ============================================
// SLIDE 11: CRM KANBAN - All real features
// ============================================
const SlideCRM = () => {
  const stages = [
    { name: "Novo", count: 3, color: "bg-blue-500", borderColor: "border-blue-500" },
    { name: "Contactado", count: 5, color: "bg-yellow-500", borderColor: "border-yellow-500" },
    { name: "Qualificado", count: 2, color: "bg-purple-500", borderColor: "border-purple-500" },
    { name: "Convertido", count: 4, color: "bg-green-500", borderColor: "border-green-500" },
    { name: "Perdido", count: 1, color: "bg-red-400", borderColor: "border-red-400" },
  ];

  const features = [
    "Kanban visual drag & drop (5 etapas)",
    "AI Lead Scoring automático (0-100)",
    "Histórico de atividades por lead",
    "Fases personalizáveis com cores",
    "Conversão automática lead → cliente",
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-cyan-50/30 relative">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#3D7081] flex items-center justify-center shadow-xl p-4">
          <Users className="w-10 h-10 text-white" />
        </div>
        <div>
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 7</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">CRM de Leads</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-8">
        {/* Kanban Mockup - Enhanced */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(61, 112, 129, 0.25)' }}
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 h-10 flex items-center justify-between px-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="text-[11px] text-slate-300 font-mono">arifa.pt/admin/leads</div>
            <div className="flex items-center gap-1">
              <div className="bg-cyan-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">CRM</div>
              <div className="bg-purple-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">AI</div>
            </div>
          </div>

          <div className="p-3 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-40px)]">
            {/* Kanban Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#1e3a5f]">Pipeline de Leads</span>
                <span className="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded-full">15 total</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="bg-[#3D7081]/10 text-[#3D7081] text-[8px] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  Configurar
                </div>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="flex gap-2 h-[calc(100%-40px)] overflow-x-auto">
              {stages.map((stage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="flex-shrink-0 w-28 flex flex-col"
                >
                  <div className={`text-center text-[9px] font-bold py-1.5 rounded-t-lg border-t-2 ${stage.borderColor} bg-white`}>
                    <div className="flex items-center justify-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                      {stage.name}
                    </div>
                    <div className="text-[8px] text-slate-400">({stage.count})</div>
                  </div>
                  <div className="flex-1 bg-slate-100/50 border-x border-b border-slate-200 rounded-b-lg p-1.5 space-y-1.5 min-h-[160px]">
                    {[...Array(Math.min(stage.count, 2))].map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.05 + j * 0.03 }}
                        className="bg-white rounded-lg p-1.5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-1 mb-0.5">
                          <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[6px] font-bold text-slate-500">
                            {String.fromCharCode(65 + i + j)}
                          </div>
                          <div className="h-1.5 w-10 bg-slate-200 rounded" />
                        </div>
                        <div className="h-1 w-14 bg-slate-100 rounded mb-1" />
                        <div className="flex items-center justify-between">
                          <span className="text-[6px] text-slate-400">📧</span>
                          <span className={`text-[7px] font-bold ${85 - i * 15 >= 70 ? 'text-emerald-600' :
                            85 - i * 15 >= 50 ? 'text-amber-600' : 'text-red-500'
                            }`}>
                            AI: {85 - i * 15 - j * 5}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {stage.count > 2 && (
                      <div className="text-center text-[8px] text-slate-400 py-1">
                        +{stage.count - 2} mais
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <div className="flex flex-col justify-center">
          <p className="text-slate-700 mb-5 text-[22px]">Nunca percas um lead</p>
          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-lg"
              >
                <div className="w-10 h-10 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-[#3D7081]" />
                </div>
                <p className="text-slate-800 text-[18px] font-medium">{feature}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100">
            <p className="text-[#1e3a5f] text-[16px] font-semibold flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#3D7081]" />
              A IA qualifica leads automaticamente.
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
          <span className="text-[16px] font-semibold text-[#3D7081] uppercase tracking-wider">Funcionalidade 8</span>
          <h2 className="text-[48px] font-light text-[#1e3a5f]">Processos Automatizados</h2>
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
        <h2 className="text-[56px] font-light text-[#1e3a5f] mt-6">8 Semanas até ao lançamento</h2>
      </div>

      <div className="flex-1 flex items-center">
        <div className="w-full grid grid-cols-4 gap-6 relative">
          {/* Connection Line */}
          <div className="absolute top-12 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-blue-200 via-purple-200 via-amber-200 to-green-200 rounded-full" />

          {weeks.map((week, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="text-center relative z-10"
            >
              <div className={`w-24 h-24 mx-auto rounded-3xl ${week.color} flex items-center justify-center mb-5 shadow-xl border-4 border-white`}>
                <week.icon className={`w-12 h-12 ${week.iconColor}`} />
              </div>
              <p className="text-[#3D7081] text-[16px] font-semibold uppercase tracking-wider mb-2">{week.week}</p>
              <h3 className="text-[28px] font-bold text-[#1e3a5f] mb-4">{week.title}</h3>
              <ul className="space-y-2">
                {week.tasks.map((task, j) => (
                  <li key={j} className="text-slate-600 text-[18px]">{task}</li>
                ))}
              </ul>
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
    { name: "Website Premium (WordPress)", cost: "3.000-5.000 €" },
    { name: "Portal Cliente (SaaS/ano)", cost: "1.200 €/ano" },
    { name: "CRM (HubSpot/ano)", cost: "600 €/ano" },
    { name: "Gestão Docs (Notion/ano)", cost: "240 €/ano" },
    { name: "Chat/Suporte (Intercom/ano)", cost: "500 €/ano" },
    { name: "Email Marketing (Mailchimp/ano)", cost: "360 €/ano" },
    { name: "Analytics (Plausible/ano)", cost: "100 €/ano" },
    { name: "Hosting + SSL + Domínio", cost: "300 €/ano" },
    { name: "Automações (Zapier/ano)", cost: "240 €/ano" },
    { name: "AI Chatbot (Intercom AI/ano)", cost: "600 €/ano" },
    { name: "Gestão Contratos (DocuSign/ano)", cost: "300 €/ano" },
    { name: "Backups + Segurança", cost: "200 €/ano" },
  ];

  const arifaBenefits = [
    "Tudo integrado em 1 plataforma",
    "100% à medida do teu estúdio",
    "Sem subscrições mensais SaaS",
    "Suporte direto AiParaTi",
    "Código e dados são teus",
  ];

  return (
    <SlideFrame className="bg-white relative">
      <div className="mb-6">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">Comparação</span>
        <h2 className="text-[48px] font-light text-[#1e3a5f] mt-4">Outras soluções vs. ARIFA</h2>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Traditional */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <h3 className="text-[18px] font-bold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-3">
            <X className="w-5 h-5" /> Abordagem Tradicional
          </h3>
          <div className="bg-gradient-to-br from-red-50 to-red-100/50 rounded-3xl p-5 flex-1 border-2 border-red-200">
            <div className="grid grid-cols-2 gap-2">
              {traditionalTools.map((tool, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex justify-between items-center py-2.5 px-3 bg-white rounded-lg text-[14px] shadow-sm"
                >
                  <span className="text-slate-700 flex items-center gap-2">
                    <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="truncate">{tool.name}</span>
                  </span>
                  <span className="text-red-600 font-bold whitespace-nowrap ml-2">{tool.cost}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t-2 border-red-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-red-700 text-[18px]">1º ANO</span>
                <span className="font-bold text-red-700 text-[28px]">~8.500-10.500 €</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-red-600 text-[16px]">Anos seguintes</span>
                <span className="text-red-600 font-semibold text-[18px]">~4.500 €/ano</span>
              </div>
              <div className="mt-4 p-3 bg-red-100 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-800 text-[16px]">TOTAL 3 ANOS</span>
                  <span className="font-bold text-red-800 text-[24px]">~17.500-19.500 €</span>
                </div>
              </div>
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
          <h3 className="text-[18px] font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-3">
            <Check className="w-5 h-5" /> Solução ARIFA
          </h3>
          <div className="bg-gradient-to-br from-[#1e3a5f] via-[#2a4a6f] to-[#3D7081] rounded-3xl p-6 flex-1 text-white shadow-[0_25px_60px_-15px_rgba(30,58,95,0.5)] relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="space-y-3 mb-6 relative z-10">
              {arifaBenefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-center gap-3 py-2"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-300 flex-shrink-0" />
                  <span className="text-blue-100 text-[18px]">{benefit}</span>
                </motion.div>
              ))}
            </div>
            <div className="pt-5 border-t border-white/20 relative z-10">
              <span className="text-blue-200 text-[16px]">Plano Premium</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-[48px] font-bold leading-none">7.888</span>
                <span className="text-[24px] text-blue-200">€</span>
              </div>
              <p className="text-blue-300 text-[14px] mt-1">investimento único</p>
              <div className="mt-4 p-3 bg-emerald-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-emerald-300" />
                  <span className="text-emerald-200 font-semibold text-[18px]">Poupança: ~10.000 € em 3 anos</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="text-[12px] bg-white/20 text-white font-bold px-3 py-1 rounded-full">Premium 7.888€</span>
                <span className="text-[12px] bg-white/10 text-white/70 px-3 py-1 rounded-full">Outros desde 3.590€</span>
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
  // Price Anchoring: Premium first (left) with maximum visual prominence - this is what we want to sell
  const tiers = [
    {
      name: "Premium",
      price: "7.888",
      description: "A solução completa",
      valueStatement: "Tudo incluído. Zero preocupações. Nós cuidamos da tua plataforma 12 meses.",
      features: [
        "Site + Portal + Backoffice",
        "CRM + Lead Scoring IA",
        "Cotações + Contratos digitais",
        "Automações inteligentes",
        "12 meses manutenção incluída",
        "Suporte prioritário 24/7",
        "4h Formação IA GRÁTIS",
      ],
      recommended: true,
      highlight: true,
    },
    {
      name: "Profissional",
      price: "5.888",
      description: "Para crescer",
      valueStatement: "Ideal para estúdios com 10-50 projetos/ano que precisam de portal cliente",
      features: [
        "Site público completo",
        "Portal Cliente completo",
        "Dashboard Admin",
        "CRM + Gestão de Leads",
        "Mensagens + Documentos",
        "Blog + Newsletter",
        "60 dias suporte",
      ],
      recommended: false,
      highlight: false,
    },
    {
      name: "Essencial",
      price: "3.590",
      description: "Para começar",
      valueStatement: "Presença digital profissional para quem está a começar",
      features: [
        "Site público (5 páginas)",
        "Portfólio básico",
        "Formulário de contacto",
        "SEO otimizado",
        "30 dias suporte",
      ],
      recommended: false,
      highlight: false,
    },
  ];

  return (
    <SlideFrame className="bg-gradient-to-br from-white to-slate-50 relative">
      <div className="mb-6 text-center">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">Escolhe o teu plano</span>
        <h2 className="text-[48px] font-light text-[#1e3a5f] mt-4">3 opções à tua medida</h2>
        <p className="text-slate-500 text-[18px] mt-2">Investimento único • Sem mensalidades</p>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 items-stretch">
        {tiers.map((tier, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-3xl p-7 flex flex-col relative ${tier.recommended
              ? "bg-gradient-to-br from-[#1e3a5f] via-[#2a4a6f] to-[#3D7081] text-white ring-4 ring-[#3D7081]/30 shadow-[0_25px_60px_-15px_rgba(30,58,95,0.5)] z-10 scale-[1.03]"
              : tier.highlight
                ? "bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 shadow-xl scale-[1.05] z-20 ring-2 ring-purple-400/50"
                : "bg-white border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-shadow"
              }`}
          >
            {tier.recommended && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-900 text-[14px] font-bold px-6 py-2.5 rounded-full shadow-lg flex items-center gap-2"
                >
                  <Award className="w-5 h-5" />
                  MELHOR VALOR
                </motion.span>
              </div>
            )}
            <h3 className={`text-[26px] font-bold ${tier.recommended ? "text-white mt-3" : tier.highlight ? "text-purple-800 mt-3" : "text-[#1e3a5f]"}`}>
              {tier.name}
            </h3>
            <p className={`text-[15px] mb-2 ${tier.recommended ? "text-blue-200" : tier.highlight ? "text-purple-600" : "text-slate-500"}`}>
              {tier.description}
            </p>
            <p className={`text-[13px] mb-4 italic ${tier.recommended ? "text-blue-100/80" : tier.highlight ? "text-purple-500" : "text-slate-400"}`}>
              {tier.valueStatement}
            </p>
            <div className="flex items-baseline gap-1 mb-5">
              <span className={`text-[48px] font-bold leading-none ${tier.recommended ? "text-white" : tier.highlight ? "text-purple-800" : "text-[#1e3a5f]"}`}>
                {tier.price}
              </span>
              <span className={`text-[22px] ${tier.recommended ? "text-blue-200" : tier.highlight ? "text-purple-500" : "text-slate-400"}`}>€</span>
            </div>

            <div className="flex-1 space-y-2.5">
              {tier.features.map((feature, j) => (
                <div key={j} className="flex items-center gap-2.5">
                  <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${tier.recommended ? "text-green-300" :
                    tier.highlight ? "text-purple-600" :
                      "text-[#3D7081]"
                    }`} />
                  <span className={`text-[15px] ${tier.recommended ? "text-blue-100" :
                    tier.highlight ? "text-purple-700" :
                      "text-slate-700"
                    } ${feature.includes("GRÁTIS") ? "font-bold" : ""}`}>{feature}</span>
                </div>
              ))}
            </div>

            {tier.recommended && (
              <div className="mt-5 pt-4 border-t border-white/20">
                <p className="text-blue-200 text-[14px] flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-300" />
                  Tranquilidade total durante 12 meses
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Validity Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Timer className="w-6 h-6 text-amber-600" />
          <div>
            <span className="text-slate-700 text-[18px]">Preços de lançamento válidos até <strong>31 Janeiro 2026</strong></span>
            <p className="text-amber-600 text-[14px] font-medium mt-0.5">Após esta data, os preços sobem 15%</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-[14px]">Pagamento flexível: 40% + 40% + 20%</span>
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
      <div className="mb-6">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">Termos & Condições</span>
        <h2 className="text-[48px] font-light text-[#1e3a5f] mt-4">Como funciona</h2>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-6">
        {/* Payment - Flexible based on chosen tier */}
        <div className="bg-white rounded-3xl p-6 border-2 border-slate-100 shadow-xl">
          <h3 className="font-bold text-[#1e3a5f] mb-4 flex items-center gap-3 text-[20px]">
            <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f]/10 flex items-center justify-center">
              <Euro className="w-6 h-6 text-[#1e3a5f]" />
            </div>
            Pagamento
          </h3>
          <p className="text-[16px] text-slate-500 mb-3">Estrutura flexível 40/40/20</p>
          <div className="space-y-3">
            <div className="py-3 px-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-700 text-[16px] font-medium">40% assinatura</span>
                <span className="text-[#1e3a5f] text-[14px]">início do projeto</span>
              </div>
            </div>
            <div className="py-3 px-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-700 text-[16px] font-medium">40% go-live</span>
                <span className="text-[#1e3a5f] text-[14px]">lançamento</span>
              </div>
            </div>
            <div className="py-3 px-4 bg-slate-50 rounded-xl">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-700 text-[16px] font-medium">20% após 30 dias</span>
                <span className="text-[#1e3a5f] text-[14px]">validação</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[14px] text-slate-500">Aplica-se a todos os planos</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-5 border-2 border-blue-100">
            <h3 className="font-bold text-[#1e3a5f] mb-3 flex items-center gap-3 text-[20px]">
              <Calendar className="w-6 h-6" /> Prazo de Entrega
            </h3>
            <p className="text-[42px] font-bold text-[#1e3a5f]">6-8 semanas</p>
            <p className="text-[16px] text-slate-600">Após aprovação do design</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-5 border-2 border-green-100">
            <h3 className="font-bold text-green-700 mb-3 flex items-center gap-3 text-[18px]">
              <CheckCircle2 className="w-6 h-6" /> Incluído em Todos
            </h3>
            <ul className="space-y-2">
              {["Site público completo", "SEO otimizado", "Design responsivo", "Hosting 1º ano"].map((item, i) => (
                <li key={i} className="text-[15px] text-green-700 flex items-center gap-2">
                  <Check className="w-4 h-4" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What's in each tier */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200">
            <h4 className="font-bold text-[#1e3a5f] text-[16px] mb-2">Essencial — 3.590€</h4>
            <p className="text-[14px] text-slate-600">Site + Portfólio + 30 dias suporte</p>
          </div>
          <div className="bg-gradient-to-br from-[#1e3a5f]/5 to-[#3D7081]/10 rounded-2xl p-4 border-2 border-[#3D7081]/30">
            <h4 className="font-bold text-[#1e3a5f] text-[16px] mb-2 flex items-center gap-2">
              Profissional — 5.888€
              <span className="text-[10px] bg-amber-400 text-amber-900 px-2 py-0.5 rounded-full">RECOMENDADO</span>
            </h4>
            <p className="text-[14px] text-slate-600">+ Portal Cliente + Admin + 60 dias</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border-2 border-purple-200">
            <h4 className="font-bold text-purple-800 text-[16px] mb-2 flex items-center gap-2">
              Premium — 7.888€
              <Zap className="w-4 h-4 text-purple-600" />
            </h4>
            <p className="text-[14px] text-purple-700">+ CRM + 12 meses manutenção + Formação IA</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border border-amber-200">
            <h4 className="font-bold text-amber-800 text-[14px] mb-1">Manutenção (opcional)</h4>
            <p className="text-[18px] font-bold text-amber-900">150-250 €/mês</p>
            <p className="text-[12px] text-amber-700">Após período incluído no plano</p>
          </div>
        </div>

        {/* O que inclui a manutenção */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-5 border-2 border-emerald-200">
          <h3 className="font-bold text-emerald-700 mb-4 flex items-center gap-3 text-[18px]">
            <Shield className="w-5 h-5" /> Manutenção Inclui
          </h3>
          <ul className="space-y-2">
            {[
              "Atualizações de segurança",
              "Backup semanal automático",
              "Correção de bugs",
              "2 horas/mês de melhorias",
              "Suporte por email/WhatsApp",
            ].map((item, i) => (
              <li key={i} className="text-[15px] text-emerald-700 flex items-center gap-2">
                <Check className="w-4 h-4" /> {item}
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-3 border-t border-emerald-200">
            <p className="text-emerald-600 text-[13px]">
              Premium: 12 meses incluídos
            </p>
            <p className="text-emerald-600 text-[13px]">
              Outros: após 30-60 dias
            </p>
          </div>
          <div className="mt-4 p-3 bg-white/60 rounded-xl">
            <p className="text-[12px] text-slate-500 flex items-center gap-2">
              <Timer className="w-4 h-4" />
              Válido até 31 Janeiro 2026
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
    {
      q: "Quantos projetos posso gerir?",
      a: "Ilimitados. Não há limite de projetos, clientes ou documentos na plataforma.",
      icon: FolderOpen
    },
    {
      q: "Os meus clientes pagam para aceder?",
      a: "Não. Tu geres tudo, os clientes acedem gratuitamente com login seguro.",
      icon: Users
    },
    {
      q: "O site funciona em telemóvel?",
      a: "Sim, 100% responsivo e otimizado para todos os dispositivos (PWA ready).",
      icon: Layers
    },
    {
      q: "Quanto tempo demora a ficar pronto?",
      a: "6-8 semanas do briefing ao lançamento, com reuniões semanais de acompanhamento.",
      icon: Calendar
    },
    {
      q: "E se precisar de ajustes após o lançamento?",
      a: "60 dias de suporte incluído. Depois, manutenção mensal opcional (150€/mês).",
      icon: Settings
    },
    {
      q: "Quem é o dono do código e dados?",
      a: "Tu. Todo o código, design e dados são teus. Podes migrar quando quiseres.",
      icon: Shield
    },
  ];

  return (
    <SlideFrame className="bg-white relative">
      <div className="mb-8 text-center">
        <span className="text-[18px] font-semibold text-[#3D7081] uppercase tracking-wider bg-[#3D7081]/10 px-4 py-2 rounded-full">Dúvidas frequentes</span>
        <h2 className="text-[56px] font-light text-[#1e3a5f] mt-4">Perguntas & Respostas</h2>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6">
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-100 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#3D7081]/10 flex items-center justify-center flex-shrink-0">
                <faq.icon className="w-6 h-6 text-[#3D7081]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1e3a5f] text-[18px] mb-2">{faq.q}</h3>
                <p className="text-slate-600 text-[16px] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
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
    <SlideFrame className="bg-gradient-to-br from-white to-purple-50/30 relative">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-xl">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[14px] font-bold text-purple-600 uppercase tracking-wider bg-purple-100 px-3 py-1 rounded-full">Premium Only</span>
          </div>
          <h2 className="text-[44px] font-light text-[#1e3a5f]">Página de Contacto Premium</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[55%,45%] gap-10">
        {/* Screenshot - Premium Frame with Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-3xl overflow-hidden border-2 border-slate-700 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(61, 112, 129, 0.25)' }}
        >
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 h-12 flex items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-sm" />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-sm" />
              <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm" />
            </div>
            <div className="bg-slate-600/50 rounded-lg px-4 py-1.5 text-[13px] text-slate-300 font-mono">
              arifa.pt/contacto
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">CRM</div>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-slate-50 to-white h-[calc(100%-48px)]">
            {/* Form Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-lg"
            >
              <div className="h-4 w-32 bg-slate-200 rounded mb-5" />
              <div className="grid grid-cols-2 gap-3 mb-3">
                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                  <div className="h-2 w-12 bg-slate-200 rounded mb-1" />
                  <div className="h-8 bg-slate-100 rounded-lg border border-slate-300 hover:border-[#3D7081]/50 transition-colors" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <div className="h-2 w-12 bg-slate-200 rounded mb-1" />
                  <div className="h-8 bg-slate-100 rounded-lg border border-slate-300 hover:border-[#3D7081]/50 transition-colors" />
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mb-3">
                <div className="h-2 w-16 bg-slate-200 rounded mb-1" />
                <div className="h-8 bg-slate-100 rounded-lg border border-slate-300" />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mb-3">
                <div className="h-2 w-20 bg-slate-200 rounded mb-1" />
                <div className="h-8 bg-slate-100 rounded-lg border border-slate-300 flex items-center px-2 gap-2">
                  <div className="flex gap-1">
                    {['Privado', 'Empresa', 'Investidor'].map((seg, i) => (
                      <span key={i} className={`text-[7px] px-1.5 py-0.5 rounded ${i === 0 ? 'bg-[#3D7081] text-white' : 'bg-slate-200 text-slate-500'}`}>{seg}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mb-4">
                <div className="h-2 w-16 bg-slate-200 rounded mb-1" />
                <div className="h-16 bg-slate-100 rounded-lg border border-slate-300" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="h-10 bg-gradient-to-r from-[#1e3a5f] to-[#3D7081] rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <div className="h-3 w-20 bg-white/30 rounded" />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

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
    { name: "React 18", color: "bg-sky-100 text-sky-700" },
    { name: "TypeScript", color: "bg-blue-100 text-blue-700" },
    { name: "Tailwind CSS", color: "bg-teal-100 text-teal-700" },
    { name: "PostgreSQL", color: "bg-indigo-100 text-indigo-700" },
    { name: "PWA Ready", color: "bg-purple-100 text-purple-700" },
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
        <h2 className="text-[56px] font-light text-white mt-6">Prontos para começar, André e Teresa?</h2>
      </div>

      {/* Urgency Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-gradient-to-r from-slate-100/20 to-white/10 rounded-2xl border border-white/20 text-center backdrop-blur-sm relative z-10"
      >
        <p className="text-white/80 text-[20px] font-medium flex items-center justify-center gap-4">
          <Timer className="w-5 h-5" />
          Preços de lançamento válidos até <span className="font-bold text-white">31 Janeiro 2026</span>
        </p>
        <p className="text-amber-300 text-[14px] font-medium mt-2">Após esta data, os preços sobem 15%</p>
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
          <div className="flex items-center gap-8 mb-6">
            <img
              src={teamBilal}
              alt="Bilal Machraa"
              className="w-32 h-32 rounded-full object-cover border-4 border-amber-400/50 shadow-xl"
            />
            <img
              src={teamHelder}
              alt="Helder Faria"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-400/50 shadow-xl"
            />
            <div>
              <p className="text-white font-bold text-[28px]">Bilal & Helder</p>
              <p className="text-white/60 text-[20px]">AiParaTi — A tua equipa</p>
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
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Button size="lg" className="w-full gap-4 bg-gradient-to-r from-[#1e3a5f] to-[#3D7081] hover:from-[#2a4a6f] hover:to-[#4D8091] text-white shadow-[0_10px_40px_-10px_rgba(30,58,95,0.5)] text-[20px] h-16 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <CheckCircle2 className="w-7 h-7" />
                Aceitar Proposta
              </Button>
            </motion.div>
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
