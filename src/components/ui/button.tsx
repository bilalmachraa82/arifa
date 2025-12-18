import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[10px] font-light font-body tracking-[0.05em] uppercase transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-arifa-coral hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(237,110,101,0.3)] active:translate-y-0 active:scale-[0.98] shadow-soft rounded-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] rounded-sm",
        outline:
          "border border-muted bg-transparent text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] rounded-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] rounded-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground rounded-sm",
        link: "text-primary underline-offset-4 hover:underline",
        hero: "bg-primary text-primary-foreground hover:bg-arifa-coral hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(237,110,101,0.3)] active:translate-y-0 active:scale-[0.98] shadow-elevated rounded-sm",
        "hero-outline": "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] rounded-sm",
        // Brand Book: Sub-marcas com hover premium
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(61,112,129,0.3)] active:translate-y-0 active:scale-[0.98] shadow-soft rounded-sm",
        coral: "bg-arifa-coral text-white hover:bg-arifa-coral/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(237,110,101,0.3)] active:translate-y-0 active:scale-[0.98] shadow-soft rounded-sm",
        yellow: "bg-arifa-yellow text-foreground hover:bg-arifa-yellow/90 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(230,178,30,0.3)] active:translate-y-0 active:scale-[0.98] shadow-soft rounded-sm",
        minimal: "text-foreground hover:text-accent underline-offset-8 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        xl: "h-16 px-12 text-lg",
        icon: "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
