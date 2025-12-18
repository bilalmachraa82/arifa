import { useEffect } from "react";
import { useOnboardingTour } from "@/hooks/useOnboardingTour";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface GuidedTourProps {
  autoStart?: boolean;
}

export function GuidedTour({ autoStart = true }: GuidedTourProps) {
  const { hasCompletedTour, startTour } = useOnboardingTour();

  useEffect(() => {
    // Auto-start tour for first-time users after a short delay
    if (autoStart && !hasCompletedTour) {
      const timer = setTimeout(() => {
        startTour();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoStart, hasCompletedTour, startTour]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={startTour}
            className="h-9 w-9"
            aria-label="Iniciar tour guiado"
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tour Guiado</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default GuidedTour;
