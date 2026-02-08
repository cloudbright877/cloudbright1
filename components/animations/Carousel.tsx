'use client';

import { ReactNode, useEffect, useState, useCallback, Children } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

interface CarouselProps {
  children: ReactNode;
  autoplay?: boolean;
  delay?: number;
  className?: string;
  showDots?: boolean;
  showArrows?: boolean;
}

export function Carousel({
  children,
  autoplay = false,
  delay = 4000,
  className = '',
  showDots = true,
  showArrows = true,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Autoplay
  useEffect(() => {
    if (!autoplay || !emblaApi || prefersReducedMotion) return;

    let intervalId: ReturnType<typeof setInterval>;
    let isUserInteracting = false;

    const startAutoplay = () => {
      intervalId = setInterval(() => {
        if (!isUserInteracting) {
          emblaApi.scrollNext();
        }
      }, delay);
    };

    const handlePointerDown = () => {
      isUserInteracting = true;
      clearInterval(intervalId);
    };

    const handlePointerUp = () => {
      isUserInteracting = false;
      startAutoplay();
    };

    emblaApi.on('pointerDown', handlePointerDown);
    emblaApi.on('pointerUp', handlePointerUp);
    startAutoplay();

    return () => {
      clearInterval(intervalId);
      emblaApi.off('pointerDown', handlePointerDown);
      emblaApi.off('pointerUp', handlePointerUp);
    };
  }, [autoplay, delay, emblaApi, prefersReducedMotion]);

  const childArray = Children.toArray(children);

  return (
    <div className={`relative ${className}`}>
      {/* Viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {childArray.map((child, index) => (
            <div
              key={index}
              className="min-w-0 shrink-0 grow-0 basis-full pl-4 first:pl-0 md:basis-1/2 lg:basis-1/3"
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {showArrows && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full
              bg-white/10 backdrop-blur-sm border border-white/20
              flex items-center justify-center
              text-white hover:bg-white/20
              transition-colors duration-200"
            aria-label="Previous slide"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10
              w-10 h-10 rounded-full
              bg-white/10 backdrop-blur-sm border border-white/20
              flex items-center justify-center
              text-white hover:bg-white/20
              transition-colors duration-200"
            aria-label="Next slide"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {showDots && scrollSnaps.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollTo(index)}
              className={`
                w-2.5 h-2.5 rounded-full transition-all duration-300
                ${index === selectedIndex
                  ? 'bg-primary-500 w-8'
                  : 'bg-white/20 hover:bg-white/40'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
