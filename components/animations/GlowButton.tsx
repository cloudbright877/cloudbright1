'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';

interface GlowButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function GlowButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
}: GlowButtonProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const baseClasses = `
    relative inline-flex items-center justify-center
    font-semibold rounded-full
    transition-all duration-300
    ${sizeClasses[size]}
    ${className}
  `;

  const primaryClasses = `
    bg-gradient-to-r from-primary-500 to-accent-500
    text-white
    hover:scale-105 hover:shadow-2xl
    ${prefersReducedMotion ? '' : 'animate-glow'}
  `;

  const secondaryClasses = `
    bg-transparent
    border-2 border-primary-500/50
    text-primary-400
    hover:bg-primary-500/10
    hover:border-primary-400
    hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]
  `;

  const variantClasses = variant === 'primary' ? primaryClasses : secondaryClasses;

  const combinedClasses = `${baseClasses} ${variantClasses}`;

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {variant === 'primary' && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={combinedClasses} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={combinedClasses} onClick={onClick}>
      {content}
    </button>
  );
}
