'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'gradient' | 'glow';
  gradient?: string;
  hover?: boolean;
  blur?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export default function GlassCard({
  children,
  variant = 'default',
  gradient = 'from-primary-500/20 to-accent-500/20',
  hover = true,
  blur = 'sm',
  padding = 'md',
  className = '',
  ...props
}: GlassCardProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const baseClasses = `
    relative rounded-2xl
    bg-gradient-to-br from-dark-800/95 to-dark-900/95
    ${blurClasses[blur]}
    ${paddingClasses[padding]}
    transition-all duration-300
  `;

  const variantClasses = {
    default: 'border-2 border-dark-700',
    gradient: `border-2 border-transparent bg-clip-padding`,
    glow: 'border-2 border-primary-500/20',
  };

  const hoverClasses = hover
    ? 'hover:border-primary-500/40 hover:shadow-2xl'
    : '';

  return (
    <motion.div
      className={`group ${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      {...props}
    >
      {/* Gradient border effect for 'gradient' variant */}
      {variant === 'gradient' && (
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
          style={{ padding: '2px' }}
        >
          <div className="absolute inset-[2px] rounded-[calc(1rem-2px)] bg-gradient-to-br from-dark-800/95 to-dark-900/95" />
        </div>
      )}

      {/* Glow effect for 'glow' variant */}
      {variant === 'glow' && hover && (
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10`}
        />
      )}

      {/* Content */}
      {children}
    </motion.div>
  );
}
