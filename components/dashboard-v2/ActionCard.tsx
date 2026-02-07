'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ActionCardProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  onClick: () => void;
  variant: 'quickstart' | 'addbot';
}

export function ActionCard({
  title,
  subtitle,
  backgroundImage,
  onClick,
  variant,
}: ActionCardProps) {
  // Predefined gradients for Tailwind
  const gradientClasses = {
    quickstart: 'from-green-500 via-blue-500 to-cyan-500',
    addbot: 'from-primary-500 via-accent-500 to-purple-500',
  };

  const gradient = gradientClasses[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="lg:col-span-4"
    >
      <button
        onClick={onClick}
        className="relative w-full h-[140px] overflow-hidden bg-gradient-to-br from-dark-800/95 to-dark-900/95 border border-dark-700 hover:border-primary-500/50 rounded-2xl transition-all group"
      >
        {/* Background Image or Gradient */}
        {backgroundImage ? (
          <>
            <Image
              src={backgroundImage}
              alt={title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </>
        ) : (
          <>
            {variant === 'quickstart' && (
              <div className="absolute inset-0 opacity-80 bg-gradient-to-br from-green-500 via-blue-500 to-cyan-500" />
            )}
            {variant === 'addbot' && (
              <div className="absolute inset-0 opacity-80 bg-gradient-to-br from-primary-500 via-accent-500 to-purple-500" />
            )}
          </>
        )}

        {/* Hover Glow Effect */}
        {variant === 'quickstart' && (
          <div className="absolute -inset-1 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-green-500 via-blue-500 to-cyan-500" />
        )}
        {variant === 'addbot' && (
          <div className="absolute -inset-1 blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-r from-primary-500 via-accent-500 to-purple-500" />
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-4 text-left">
          <h3 className="text-lg font-bold text-white mb-1 group-hover:scale-105 transition-transform">
            {title}
          </h3>
          <p className="text-xs text-dark-300">
            {subtitle}
          </p>
        </div>
      </button>
    </motion.div>
  );
}
