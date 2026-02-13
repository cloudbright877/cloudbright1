'use client';

import { useEffect, useState, useRef, ReactNode, memo, useCallback } from 'react';

interface CardItem {
  title: string;
  description: string;
  icon: ReactNode;
  gradient: string;
  preview?: ReactNode;
  previewGlow?: string;
  activeBorder?: string;
}

interface ExpandingCardsProps {
  items: CardItem[];
  autoPlayInterval?: number;
  className?: string;
}

const EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

export const ExpandingCards = memo(function ExpandingCards({
  items,
  autoPlayInterval = 3000,
  className = '',
}: ExpandingCardsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, autoPlayInterval);
    return () => clearInterval(id);
  }, [isHovered, items.length, autoPlayInterval]);

  const onEnter = useCallback(() => setIsHovered(true), []);
  const onLeave = useCallback(() => { setIsHovered(false); setHoveredIndex(null); }, []);

  const currentActive = hoveredIndex !== null ? hoveredIndex : activeIndex;

  return (
    <>
      {/* Desktop */}
      <div
        ref={containerRef}
        className={`hidden md:flex items-stretch gap-3 h-[310px] w-full ${className}`}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
      >
        {items.map((item, index) => {
          const isActive = index === currentActive;
          const borderGradient = isActive && item.activeBorder
            ? `linear-gradient(180deg, ${item.activeBorder} 0%, ${item.activeBorder.replace('0.4)', '0.1)')} 100%)`
            : 'linear-gradient(180deg, rgba(128,128,128,0.15) 0%, rgba(128,128,128,0.05) 100%)';

          return (
            <div
              key={item.title}
              onMouseEnter={() => setHoveredIndex(index)}
              className="relative rounded-[17px] cursor-pointer h-full"
              style={{
                flex: isActive ? 3 : 1,
                padding: '1px',
                background: borderGradient,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(40px)',
                transition: `flex 800ms ${EASE}, opacity 600ms ${EASE} ${index * 120}ms, transform 600ms ${EASE} ${index * 120}ms, background 500ms ${EASE}`,
                contain: 'layout style paint',
              }}
            >
              {/* Inner card */}
              <div className="relative rounded-2xl overflow-hidden h-full">
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
                  style={{
                    opacity: isActive ? 0.1 : 0.04,
                    transition: `opacity 800ms ${EASE}`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full p-8 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-dark-800/95 dark:to-dark-900/95">
                  {/* Top shine — iOS-style highlight */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background: isActive && item.activeBorder
                        ? `linear-gradient(90deg, transparent 0%, ${item.activeBorder} 50%, transparent 100%)`
                        : 'linear-gradient(90deg, transparent 0%, rgba(128,128,128,0.12) 50%, transparent 100%)',
                      transition: `background 500ms ${EASE}`,
                    }}
                  />

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg shrink-0`}
                  >
                    {item.icon}
                  </div>

                  {/* Expanded content */}
                  <div
                    className="mt-auto overflow-hidden"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                      transition: isActive
                        ? `opacity 600ms ${EASE} 300ms, transform 600ms ${EASE} 300ms`
                        : `opacity 400ms ${EASE}, transform 400ms ${EASE}`,
                    }}
                  >
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-dark-300 text-sm leading-relaxed max-w-[55%]">
                      {item.description}
                    </p>
                  </div>

                  {/* Preview UI card — top-right, clipped at bottom */}
                  {item.preview && (
                    <div
                      className="absolute right-0 pointer-events-none select-none"
                      style={{
                        top: '48px',
                        opacity: isActive ? 1 : 0,
                        transform: isActive
                          ? 'translateX(8%)'
                          : 'translate(16%, 20px) scale(0.95)',
                        transition: isActive
                          ? `opacity 700ms ${EASE} 400ms, transform 700ms ${EASE} 400ms`
                          : `opacity 300ms ${EASE}, transform 300ms ${EASE}`,
                        transformOrigin: 'top right',
                        willChange: isActive ? 'transform, opacity' : 'auto',
                      }}
                    >
                      {item.previewGlow && (
                        <div
                          className={`absolute -inset-8 rounded-3xl blur-2xl ${item.previewGlow}`}
                          style={{
                            opacity: isActive ? 0.5 : 0,
                            transition: `opacity 700ms ${EASE} 500ms`,
                          }}
                        />
                      )}
                      <div className="relative">{item.preview}</div>
                    </div>
                  )}

                  {/* Collapsed title */}
                  <div
                    className="absolute bottom-6 left-8 right-8"
                    style={{
                      opacity: isActive ? 0 : 1,
                      transition: isActive
                        ? `opacity 300ms ${EASE}`
                        : `opacity 500ms ${EASE} 400ms`,
                    }}
                  >
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-white/70 truncate">
                      {item.title}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className={`md:hidden grid gap-4 ${className}`}>
        {items.map((item, index) => (
          <MobileCard key={item.title} item={item} index={index} />
        ))}
      </div>
    </>
  );
});

const MobileCard = memo(function MobileCard({ item, index }: { item: CardItem; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative rounded-[17px]"
      style={{
        padding: '1px',
        background: 'linear-gradient(180deg, rgba(128,128,128,0.15) 0%, rgba(128,128,128,0.05) 100%)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 500ms ${EASE} ${index * 100}ms, transform 500ms ${EASE} ${index * 100}ms`,
      }}
    >
      <div className="relative rounded-2xl overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-[0.05]`}
        />
        <div className="relative z-10 p-6 bg-gradient-to-br from-white/95 to-gray-50/95 dark:from-dark-800/95 dark:to-dark-900/95">
          {/* Top shine */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(128,128,128,0.12) 50%, transparent 100%)' }}
          />
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg mb-4`}
          >
            {item.icon}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
          <p className="text-gray-600 dark:text-dark-300 text-sm leading-relaxed">
            {item.description}
          </p>
          {item.preview && (
            <div className="mt-4 flex justify-center pointer-events-none select-none">
              <div className="scale-[0.9] origin-center">{item.preview}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
