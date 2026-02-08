'use client';

import { ReactNode } from 'react';

interface BentoItemProps {
  children: ReactNode;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
  className?: string;
}

export function BentoItem({
  children,
  colSpan = 1,
  rowSpan = 1,
  className = '',
}: BentoItemProps) {
  const colSpanClasses: Record<number, string> = {
    1: 'col-span-1',
    2: 'col-span-1 md:col-span-2',
    3: 'col-span-1 md:col-span-2 lg:col-span-3',
  };

  const rowSpanClasses: Record<number, string> = {
    1: 'row-span-1',
    2: 'row-span-1 md:row-span-2',
  };

  return (
    <div
      className={`
        ${colSpanClasses[colSpan]}
        ${rowSpanClasses[rowSpan]}
        relative overflow-hidden rounded-2xl
        bg-white/5 dark:bg-white/5
        backdrop-blur-xl
        border border-white/10
        p-6
        transition-all duration-300
        hover:bg-white/[0.08] hover:border-white/20
        hover:shadow-lg hover:shadow-primary-500/5
        ${className}
      `}
    >
      {children}
    </div>
  );
}
