'use client';

import { ReactNode, useRef, useState, useCallback } from 'react';

interface AnimatedBorderGridProps {
  children: ReactNode;
  columns?: number;
  className?: string;
}

/**
 * Grid with visible borders between cells and a mouse-tracking
 * radial glow that illuminates borders near the cursor.
 *
 * Usage:
 * <AnimatedBorderGrid columns={3}>
 *   <AnimatedBorderGrid.Cell>...</AnimatedBorderGrid.Cell>
 *   ...
 * </AnimatedBorderGrid>
 */
export function AnimatedBorderGrid({
  children,
  columns = 3,
  className = '',
}: AnimatedBorderGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    []
  );

  const colsClass =
    columns === 2
      ? 'md:grid-cols-2'
      : columns === 4
      ? 'md:grid-cols-2 lg:grid-cols-4'
      : 'md:grid-cols-3';

  return (
    <div
      ref={containerRef}
      className={`relative grid grid-cols-1 ${colsClass} rounded-2xl overflow-hidden border border-dark-700/40 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePos({ x: -200, y: -200 });
      }}
    >
      {/* Honeycomb pattern — revealed by radial mask around cursor */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34.64' height='60'%3E%3Cpath d='M17.32 0L34.64 10L34.64 30L17.32 40L0 30L0 10ZM17.32 40L17.32 60' fill='none' stroke='%236366f1' stroke-width='1' opacity='0.3'/%3E%3C/svg%3E")`,
          backgroundSize: '34.64px 60px',
          WebkitMaskImage: `radial-gradient(105px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
          maskImage: `radial-gradient(105px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
        }}
      />

      {children}
    </div>
  );
}

/* ─── Cell sub-component ─── */

interface CellProps {
  children: ReactNode;
  className?: string;
  /** If true, the cell has a right border on desktop */
  borderRight?: boolean;
  /** If true, the cell has a bottom border */
  borderBottom?: boolean;
}

function Cell({
  children,
  className = '',
  borderRight = false,
  borderBottom = false,
}: CellProps) {
  return (
    <div
      className={`relative z-20 group p-8 md:p-10 bg-dark-900 transition-colors duration-300 hover:bg-primary-500/[0.04]
        ${borderRight ? 'md:border-r border-dark-700/40' : ''}
        ${borderBottom ? 'border-b border-dark-700/40' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

AnimatedBorderGrid.Cell = Cell;
