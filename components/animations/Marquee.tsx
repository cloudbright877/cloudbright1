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
  gap?: number;
}

export function Marquee({
  children,
  speed = 40,
  direction = 'left',
  pauseOnHover = true,
  className = '',
  gap = 16,
}: MarqueeProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const styleId = 'marquee-keyframes';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = MARQUEE_KEYFRAMES;
    document.head.appendChild(style);
  }, []);

  const animationDirection = direction === 'left' ? 'normal' : 'reverse';
  const durationSeconds = `${speed}s`;

  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <div
        className="flex w-max"
        style={
          prefersReducedMotion
            ? {}
            : {
                animation: `marquee-scroll ${durationSeconds} linear infinite`,
                animationDirection,
                animationPlayState: paused ? 'paused' : 'running',
              }
        }
      >
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>{children}</div>
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px`, marginLeft: `${gap}px` }} aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
