'use client';

import { ReactNode } from 'react';
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
  md: 'px-5 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base',
  lg: 'px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-base',
};

export function GlowButton({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
}: GlowButtonProps) {
  const baseClasses = `
    relative inline-flex items-center justify-center
    font-semibold rounded-xl
    transition-all duration-200
    active:scale-95
    ${sizeClasses[size]}
    ${className}
  `;

  const primaryClasses = `
    bg-gradient-to-r from-primary-500 to-accent-500
    text-white
    hover:scale-105
  `;

  const secondaryClasses = `
    bg-transparent
    border-2 border-primary-500/50
    text-primary-400
    hover:bg-primary-500/10
    hover:border-primary-400
  `;

  const variantClasses = variant === 'primary' ? primaryClasses : secondaryClasses;

  const combinedClasses = `${baseClasses} ${variantClasses}`;

  const content = children;

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
