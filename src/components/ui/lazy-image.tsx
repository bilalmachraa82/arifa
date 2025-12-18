import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  priority?: boolean;
  onLoad?: () => void;
  blurDataURL?: string;
}

// Generate a simple blur placeholder color based on image URL
const generateBlurColor = (src: string): string => {
  const colors = [
    "from-slate-200 to-slate-300",
    "from-stone-200 to-stone-300",
    "from-zinc-200 to-zinc-300",
    "from-neutral-200 to-neutral-300",
  ];
  const hash = src.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export function LazyImage({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio = "aspect-[4/5]",
  priority = false,
  onLoad,
  blurDataURL,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const blurGradient = generateBlurColor(src);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "100px",
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        aspectRatio,
        "relative overflow-hidden rounded-sm",
        containerClassName
      )}
    >
      {/* Blur placeholder background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br transition-opacity duration-500",
          blurGradient,
          isLoaded ? "opacity-0" : "opacity-100"
        )}
      />

      {/* Animated shimmer effect while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
          />
        </div>
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out",
            isLoaded 
              ? "opacity-100 scale-100 blur-0" 
              : "opacity-0 scale-105 blur-sm",
            className
          )}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <span className="text-xs text-muted-foreground">Imagem indisponível</span>
        </div>
      )}
    </div>
  );
}

export default LazyImage;
