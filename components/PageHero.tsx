'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface CTAButton {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface PageHeroProps {
  videoSrc: string;
  videoSrcMobile?: string;
  poster?: string;
  title: string | React.ReactNode;
  subtitle: string;
  badge?: {
    text: string;
    icon?: React.ReactNode;
  };
  ctaButtons?: CTAButton[];
  overlay?: 'light' | 'medium' | 'dark';
}

export default function PageHero({
  videoSrc,
  videoSrcMobile,
  poster,
  title,
  subtitle,
  badge,
  ctaButtons,
  overlay = 'medium',
}: PageHeroProps) {
  const overlayClasses = {
    light: 'bg-dark-900/20 dark:bg-dark-900/40',
    medium: 'bg-dark-900/40 dark:bg-dark-900/60',
    dark: 'bg-dark-900/60 dark:bg-dark-900/80',
  };

  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        {/* Desktop Hero Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster={poster}
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>

        {/* Mobile Hero Video */}
        {videoSrcMobile && (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={poster}
            className="block md:hidden absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSrcMobile} type="video/mp4" />
          </video>
        )}

        {/* If no mobile video, show desktop video on mobile */}
        {!videoSrcMobile && (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={poster}
            className="block md:hidden absolute inset-0 w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        )}

        {/* Overlay */}
        <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
      </div>

      {/* Animated overlay elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-accent-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full mb-6 md:mb-8 backdrop-blur-sm"
            >
              {badge.icon && badge.icon}
              <span className="text-sm font-medium text-primary-300 dark:text-primary-200">
                {badge.text}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 md:mb-8 leading-tight"
          >
            {typeof title === 'string' ? (
              <span className="text-white drop-shadow-2xl">{title}</span>
            ) : (
              title
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-100 dark:text-gray-200 mb-8 md:mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>

          {/* CTA Buttons */}
          {ctaButtons && ctaButtons.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {ctaButtons.map((button, index) => (
                <Link
                  key={index}
                  href={button.href}
                  className={
                    button.variant === 'secondary'
                      ? 'px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105'
                      : 'px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full font-semibold text-white hover:shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105'
                  }
                >
                  {button.text}
                </Link>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
