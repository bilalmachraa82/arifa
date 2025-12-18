import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'fade' | 'scale';
  delay?: number;
  duration?: number;
}

const animationClasses = {
  'fade-up': {
    hidden: 'opacity-0 translate-y-10',
    visible: 'opacity-100 translate-y-0',
  },
  'fade-left': {
    hidden: 'opacity-0 -translate-x-10',
    visible: 'opacity-100 translate-x-0',
  },
  'fade-right': {
    hidden: 'opacity-0 translate-x-10',
    visible: 'opacity-100 translate-x-0',
  },
  'fade': {
    hidden: 'opacity-0',
    visible: 'opacity-100',
  },
  'scale': {
    hidden: 'opacity-0 scale-95',
    visible: 'opacity-100 scale-100',
  },
};

export function AnimatedSection({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 700,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();
  const { hidden, visible } = animationClasses[animation];

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all ease-out',
        isVisible ? visible : hidden,
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
