'use client';

import { ReactNode, useRef, useState, useCallback, useEffect, MouseEvent as ReactMouseEvent } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  unstyled?: boolean;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 10,
  glare = false,
  unstyled = false,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = useCallback(
    (e: ReactMouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * maxTilt * 2;
      const rotateY = (x - 0.5) * maxTilt * 2;

      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      );
      setGlarePosition({ x: x * 100, y: y * 100 });
    },
    [maxTilt, prefersReducedMotion]
  );

  const handleMouseEnter = useCallback(() => {
    if (!prefersReducedMotion) {
      setIsHovering(true);
    }
  }, [prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition({ x: 50, y: 50 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden
        transition-all duration-200 ease-out
        ${unstyled ? '' : 'rounded-2xl bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10'}
        ${className}
      `}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        willChange: isHovering ? 'transform' : 'auto',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* Glare overlay */}
      {glare && isHovering && !prefersReducedMotion && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
