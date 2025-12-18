import { useEffect, useRef, ReactNode } from "react";

interface SkipLinkProps {
  targetId: string;
  children: ReactNode;
}

/**
 * Skip to main content link for keyboard/screen reader users
 * WCAG 2.2 Level A requirement
 */
export function SkipLink({ targetId, children }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
    >
      {children}
    </a>
  );
}

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
}

/**
 * Trap focus within a container (for modals, dialogs)
 * WCAG 2.2 Level A requirement for modal dialogs
 */
export function FocusTrap({ children, active = true }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return (
    <div ref={containerRef}>
      {children}
    </div>
  );
}

interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive";
}

/**
 * Announce dynamic content changes to screen readers
 * WCAG 2.2 Level A requirement
 */
export function LiveRegion({ message, politeness = "polite" }: LiveRegionProps) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

/**
 * Heading levels for proper document outline
 */
interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Heading({ level, children, className, id }: HeadingProps) {
  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  switch (level) {
    case 1: return <h1 className={className} id={id}>{children}</h1>;
    case 2: return <h2 className={className} id={id}>{children}</h2>;
    case 3: return <h3 className={className} id={id}>{children}</h3>;
    case 4: return <h4 className={className} id={id}>{children}</h4>;
    case 5: return <h5 className={className} id={id}>{children}</h5>;
    case 6: return <h6 className={className} id={id}>{children}</h6>;
    default: return <h2 className={className} id={id}>{children}</h2>;
  }
}

export default { SkipLink, FocusTrap, LiveRegion, Heading };
