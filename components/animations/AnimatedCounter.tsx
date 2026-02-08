'use client';

import { useEffect, useState } from 'react';
import NumberFlow from '@number-flow/react';
import { useInView } from 'react-intersection-observer';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  className = '',
  duration = 1200,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (inView) {
      if (prefersReducedMotion) {
        setDisplayValue(value);
      } else {
        // Small delay so NumberFlow animates from 0 to value
        const timeoutId = window.setTimeout(() => {
          setDisplayValue(value);
        }, 100);
        return () => window.clearTimeout(timeoutId);
      }
    }
  }, [inView, value, prefersReducedMotion]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <NumberFlow
        value={displayValue}
        transformTiming={{
          duration: prefersReducedMotion ? 0 : duration,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        spinTiming={{
          duration: prefersReducedMotion ? 0 : duration,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />
      {suffix}
    </span>
  );
}
