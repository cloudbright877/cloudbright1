'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

/* ── Container ── */

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export function Spotlight({ children, className = '' }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [boxes, setBoxes] = useState<HTMLElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    if (containerRef.current) {
      setBoxes(Array.from(containerRef.current.children) as HTMLElement[]);
    }
  }, []);

  const initContainer = useCallback(() => {
    if (containerRef.current) {
      sizeRef.current.w = containerRef.current.offsetWidth;
      sizeRef.current.h = containerRef.current.offsetHeight;
    }
  }, []);

  useEffect(() => {
    initContainer();
    window.addEventListener('resize', initContainer);
    return () => window.removeEventListener('resize', initContainer);
  }, [initContainer]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const { w, h } = sizeRef.current;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x > 0 && x < w && y > 0 && y < h) {
        mouseRef.current = { x, y };
        boxes.forEach((box) => {
          const bx = -(box.getBoundingClientRect().left - rect.left) + x;
          const by = -(box.getBoundingClientRect().top - rect.top) + y;
          box.style.setProperty('--mouse-x', `${bx}px`);
          box.style.setProperty('--mouse-y', `${by}px`);
        });
      }
    },
    [boxes],
  );

  return (
    <div
      ref={containerRef}
      className={`group ${className}`}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
}

/* ── Card ── */

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

export function SpotlightCard({ children, className = '' }: SpotlightCardProps) {
  return (
    <div
      className={[
        'relative h-full rounded-3xl p-px overflow-hidden',
        'bg-dark-700/40',
        /* border glow — follows cursor */
        'before:absolute before:w-80 before:h-80 before:-left-40 before:-top-40',
        'before:bg-primary-400 before:rounded-full',
        'before:opacity-0 before:pointer-events-none',
        'before:transition-opacity before:duration-500',
        'before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)]',
        'before:group-hover:opacity-100 before:z-10 before:blur-[100px]',
        className,
      ].join(' ')}
    >
      <div className="relative h-full bg-dark-900 rounded-[inherit] z-20 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
