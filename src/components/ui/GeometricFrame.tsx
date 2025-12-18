import { cn } from "@/lib/utils";

interface GeometricFrameProps {
  children: React.ReactNode;
  variant?: "default" | "coral" | "yellow" | "blue";
  className?: string;
  frameClassName?: string;
}

// Brand Book: Molduras geométricas premium baseadas no pattern visual
export function GeometricFrame({ 
  children, 
  variant = "default",
  className,
  frameClassName 
}: GeometricFrameProps) {
  const frameColors = {
    default: "border-accent/30",
    coral: "border-arifa-coral/40",
    yellow: "border-arifa-yellow/40",
    blue: "border-arifa-blue/40",
  };

  const accentColors = {
    default: "bg-accent/10",
    coral: "bg-arifa-coral/10",
    yellow: "bg-arifa-yellow/10",
    blue: "bg-arifa-blue/10",
  };

  const cornerColors = {
    default: "bg-accent",
    coral: "bg-arifa-coral",
    yellow: "bg-arifa-yellow",
    blue: "bg-arifa-blue",
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Main content */}
      {children}
      
      {/* Top-right corner frame */}
      <div 
        className={cn(
          "absolute -top-3 -right-3 w-16 h-16 border-t-2 border-r-2 rounded-tr-sm pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:-top-4 group-hover:-right-4",
          frameColors[variant],
          frameClassName
        )} 
      />
      
      {/* Bottom-left corner frame */}
      <div 
        className={cn(
          "absolute -bottom-3 -left-3 w-20 h-20 border-b-2 border-l-2 rounded-bl-sm pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:-bottom-4 group-hover:-left-4",
          frameColors[variant],
          frameClassName
        )} 
      />
      
      {/* Background accent shape */}
      <div 
        className={cn(
          "absolute -bottom-6 -left-6 w-24 h-24 -z-10 rounded-sm pointer-events-none transition-all duration-500 opacity-0 group-hover:opacity-100",
          accentColors[variant]
        )} 
      />

      {/* Corner dots */}
      <div 
        className={cn(
          "absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full pointer-events-none transition-all duration-300 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100",
          cornerColors[variant]
        )} 
      />
      <div 
        className={cn(
          "absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full pointer-events-none transition-all duration-300 delay-100 opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100",
          cornerColors[variant]
        )} 
      />
    </div>
  );
}

// Simpler frame for grid cards
export function GeometricCardFrame({ 
  children, 
  variant = "default",
  className 
}: GeometricFrameProps) {
  const frameColors = {
    default: "border-accent/20 group-hover:border-accent/50",
    coral: "border-arifa-coral/20 group-hover:border-arifa-coral/50",
    yellow: "border-arifa-yellow/20 group-hover:border-arifa-yellow/50",
    blue: "border-arifa-blue/20 group-hover:border-arifa-blue/50",
  };

  const cornerColors = {
    default: "bg-accent",
    coral: "bg-arifa-coral",
    yellow: "bg-arifa-yellow",
    blue: "bg-arifa-blue",
  };

  return (
    <div className={cn("relative", className)}>
      {children}
      
      {/* Animated corner accent - top right */}
      <div 
        className={cn(
          "absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 transition-all duration-500 pointer-events-none",
          frameColors[variant]
        )} 
      />
      
      {/* Animated corner accent - bottom left */}
      <div 
        className={cn(
          "absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 transition-all duration-500 pointer-events-none",
          frameColors[variant]
        )} 
      />

      {/* Corner dot indicator */}
      <div 
        className={cn(
          "absolute top-0 right-0 w-2 h-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-1 translate-y-1",
          cornerColors[variant]
        )} 
      />
    </div>
  );
}
