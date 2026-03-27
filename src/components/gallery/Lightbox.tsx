import { useState, useEffect, useCallback, useRef } from "react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause,
  Maximize,
  RotateCw,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const Lightbox = ({ 
  images, 
  initialIndex = 0, 
  isOpen, 
  onClose,
  title 
}: LightboxProps) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const slideshowIntervalRef = useRef<ReturnType<typeof setInterval>>();

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(initialIndex);
      resetTransform();
    }
  }, [isOpen, initialIndex]);

  // Slideshow
  useEffect(() => {
    if (isPlaying && images.length > 1) {
      slideshowIntervalRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % images.length);
        resetTransform();
      }, 3000);
    }
    return () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    };
  }, [isPlaying, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          nextImage();
          break;
        case "ArrowLeft":
          prevImage();
          break;
        case "Escape":
          onClose();
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
          zoomOut();
          break;
        case " ":
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case "r":
          rotate();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, images.length]);

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (!isDragging) setShowControls(false);
    }, 3000);
  }, [isDragging]);

  useEffect(() => {
    if (isOpen) {
      resetControlsTimeout();
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isOpen, resetControlsTimeout]);

  const resetTransform = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const nextImage = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % images.length);
    resetTransform();
  }, [images.length]);

  const prevImage = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    resetTransform();
  }, [images.length]);

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.5, 4));
  const zoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) setPosition({ x: 0, y: 0 });
      return newZoom;
    });
  };
  const rotate = () => setRotation((prev) => (prev + 90) % 360);

  // Touch/drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    resetControlsTimeout();
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch gestures
  const touchStartRef = useRef<{ x: number; y: number; distance?: number }>({ x: 0, y: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartRef.current = { x: 0, y: 0, distance };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartRef.current.distance) {
      const newDistance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = newDistance / touchStartRef.current.distance;
      setZoom((prev) => Math.max(1, Math.min(4, prev * scale)));
      touchStartRef.current.distance = newDistance;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.changedTouches.length === 1 && zoom === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) prevImage();
        else nextImage();
      }
    }
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = images[activeIndex];
    link.download = `image-${activeIndex + 1}.jpg`;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top controls */}
      <div 
        className={cn(
          "absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex items-center gap-4">
          {title && (
            <h3 className="text-white font-medium hidden sm:block">{title}</h3>
          )}
          <span className="text-white/70 text-sm">
            {activeIndex + 1} / {images.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={zoomOut}
            disabled={zoom <= 1}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Diminuir zoom (-)"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <span className="text-white text-sm w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={zoomIn}
            disabled={zoom >= 4}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Aumentar zoom (+)"
          >
            <ZoomIn className="h-5 w-5" />
          </button>

          {/* Rotate */}
          <button
            onClick={rotate}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            title="Rodar (R)"
          >
            <RotateCw className="h-5 w-5" />
          </button>

          {/* Slideshow */}
          {images.length > 1 && (
            <button
              onClick={() => setIsPlaying((prev) => !prev)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors",
                isPlaying ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
              )}
              title="Slideshow (Espaço)"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
          )}

          {/* Download */}
          <button
            onClick={downloadImage}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            title="Download"
          >
            <Download className="h-5 w-5" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors ml-2"
            title="Fechar (Esc)"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div 
        className="flex-1 flex items-center justify-center overflow-hidden cursor-move"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        onClick={(e) => {
          if (e.target === e.currentTarget && zoom === 1) onClose();
        }}
      >
        <img
          src={images[activeIndex]}
          alt={`Imagem ${activeIndex + 1}`}
          className="max-w-full max-h-full object-contain select-none transition-transform duration-200"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
            cursor: zoom > 1 ? "grab" : "default",
          }}
          draggable={false}
        />
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all",
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            title="Anterior (←)"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all",
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            title="Próxima (→)"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex justify-center gap-2 overflow-x-auto py-2 max-w-full">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  resetTransform();
                }}
                className={cn(
                  "flex-shrink-0 w-16 h-12 rounded overflow-hidden transition-all",
                  activeIndex === index
                    ? "ring-2 ring-white scale-110"
                    : "opacity-50 hover:opacity-100"
                )}
              >
                <img
                  src={img}
                  alt={`Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div 
        className={cn(
          "absolute bottom-20 left-1/2 -translate-x-1/2 text-white/50 text-xs hidden md:block transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        ← → Navegar • + - Zoom • R Rodar • Espaço Slideshow • Esc Fechar
      </div>
    </div>
  );
};
