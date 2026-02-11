'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TimelineStep {
  title: string;
  description: string;
  icon?: ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface ScrollProgressTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function ScrollProgressTimeline({
  steps,
  className = '',
}: ScrollProgressTimelineProps) {
  const segmentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [progress, setProgress] = useState<number[]>(
    () => new Array(steps.length - 1).fill(0)
  );

  useEffect(() => {
    const handleScroll = () => {
      const updated = segmentRefs.current.map((el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const start = windowHeight * 0.7;
        const end = windowHeight * 0.25;
        let percent = (start - rect.top) / (start - end);
        return Math.min(Math.max(percent, 0), 1);
      });
      setProgress(updated);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < steps.length - 1 ? progress[index] > 0.95 : false;
        const previousCompleted = index === 0 ? true : progress[index - 1] > 0.95;

        return (
          <div key={index} className="relative">
            {/* Step row */}
            <motion.div
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-start gap-6 ${index > 0 ? 'mt-4' : ''}`}
            >
              {/* Dot indicator */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-5 h-5 rounded-full border-[3px] transition-all duration-500 ${
                    previousCompleted
                      ? 'border-primary-500 bg-primary-500 shadow-lg shadow-primary-500/30'
                      : 'border-dark-600 bg-dark-800'
                  }`}
                />
              </div>

              {/* Content card */}
              <div
                className={`flex-1 p-6 rounded-2xl border transition-all duration-500 ${
                  previousCompleted
                    ? 'bg-dark-800/80 border-primary-500/30 shadow-lg shadow-primary-500/5'
                    : 'bg-dark-800/40 border-dark-700/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {step.icon && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                      {step.icon}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                    {step.badge && (
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full border ${
                          step.badgeColor || 'bg-primary-500/10 text-primary-400 border-primary-500/20'
                        }`}
                      >
                        {step.badge}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-dark-300 text-sm leading-relaxed ml-0 md:ml-13">
                  {step.description}
                </p>
              </div>
            </motion.div>

            {/* Progress segment (between steps) */}
            {index < steps.length - 1 && (
              <div className="flex items-start gap-6">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    ref={(el) => {
                      segmentRefs.current[index] = el;
                    }}
                    className="relative w-0.5 h-20 bg-dark-700/50 overflow-hidden ml-[9px]"
                  >
                    <div
                      className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary-500 to-accent-500 transition-none"
                      style={{ height: `${progress[index] * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex-1" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
