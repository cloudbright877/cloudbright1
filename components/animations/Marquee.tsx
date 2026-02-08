'use client';

import { ReactNode, useEffect, useState } from 'react';

const MARQUEE_KEYFRAMES = `
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
`;

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({
  children,
  speed = 40,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}: MarqueeProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Inject keyframes once into <head>
  useEffect(() => {
    const styleId = 'marquee-keyframes';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = MARQUEE_KEYFRAMES;
    document.head.appendChild(style);

    return () => {
      // Only remove if no other Marquee instances are mounted
      // We leave the style in place since it's harmless and shared
    };
  }, []);

  const animationDirection = direction === 'left' ? 'normal' : 'reverse';
  const durationSeconds = `${speed}s`;

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
    >
      <div
        className={`flex w-max ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
        style={
          prefersReducedMotion
            ? {}
            : {
                animation: `marquee-scroll ${durationSeconds} linear infinite`,
                animationDirection,
              }
        }
      >
        <div className="flex shrink-0 items-center gap-4">{children}</div>
        <div className="flex shrink-0 items-center gap-4" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
