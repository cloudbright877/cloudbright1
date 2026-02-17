'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

/* ─────────────── Types ─────────────── */

interface OfficeSliderProps {
  images: { src: string; alt: string }[];
  autoPlayInterval?: number;
}

/* ─────────────── Helpers ─────────────── */

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function getWrappedDiff(index: number, active: number, total: number) {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

const MAX_VISIBLE = 3;

/* ─────────────── Component ─────────────── */

export function OfficeSlider({ images, autoPlayInterval = 4000 }: OfficeSliderProps) {
  const total = images.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dragRef = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,
  });

  const SWIPE_THRESHOLD = 90;

  const navigate = useCallback(
    (dir: number) => setActiveIndex((prev) => mod(prev + dir, total)),
    [total],
  );

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) { clearInterval(autoplayRef.current); autoplayRef.current = null; }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    autoplayRef.current = setInterval(() => {
      if (!dragRef.current.active) navigate(1);
    }, autoPlayInterval);
  }, [navigate, autoPlayInterval, stopAutoplay]);

  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  /* Drag handlers */
  const onDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    dragRef.current = { active: true, startX: x, lastX: x, lastTime: Date.now(), velocity: 0 };
    stopAutoplay();
  }, [stopAutoplay]);

  const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const d = dragRef.current;
    if (!d.active) return;
    const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const now = Date.now();
    const dt = now - d.lastTime;
    if (dt > 0) d.velocity = (x - d.lastX) / dt;
    d.lastX = x;
    d.lastTime = now;

    const offset = x - d.startX;
    if (Math.abs(offset) >= SWIPE_THRESHOLD) {
      navigate(offset > 0 ? -1 : 1);
      d.startX = x;
    }
  }, [navigate]);

  const onUp = useCallback(() => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;

    const v = d.velocity;
    const speed = Math.abs(v);
    if (speed > 0.5) {
      const extra = Math.min(Math.floor(speed / 0.4), 4);
      const dir = v > 0 ? -1 : 1;
      for (let i = 0; i < extra; i++) {
        setTimeout(() => navigate(dir), (i + 1) * 120);
      }
    }
    d.velocity = 0;
    startAutoplay();
  }, [navigate, startAutoplay]);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  }, [navigate]);

  const visibleIndices = useMemo(() => {
    const indices: number[] = [];
    for (let offset = -MAX_VISIBLE; offset <= MAX_VISIBLE; offset++) {
      indices.push(mod(activeIndex + offset, total));
    }
    return indices;
  }, [activeIndex, total]);

  return (
    <div className="select-none [&_img]{pointer-events:none}" onKeyDown={onKey} tabIndex={0} role="region" aria-label="Office gallery" onDragStart={(e) => e.preventDefault()}>
      <div className="relative flex items-center justify-center gap-1 sm:gap-3">
        {/* Left arrow */}
        <button
          onClick={() => navigate(-1)}
          className="hidden sm:flex shrink-0 w-10 h-10 rounded-full items-center justify-center z-20
            bg-white/80 dark:bg-dark-800/80 border border-gray-200 dark:border-dark-700
            text-gray-500 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white
            hover:border-primary-500/40 transition-colors cursor-pointer active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Cards container */}
        <div
          className="relative flex-1 max-w-6xl flex items-center justify-center overflow-hidden
            h-[220px] sm:h-[290px] md:h-[360px] lg:h-[420px]"
          style={{ perspective: '1200px' }}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onTouchStart={onDown}
          onTouchMove={onMove}
          onTouchEnd={onUp}
        >
          <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
            {visibleIndices.map((idx) => {
              const img = images[idx];
              const diff = getWrappedDiff(idx, activeIndex, total);
              const absDiff = Math.abs(diff);
              const dir = Math.sign(diff);
              const isActive = diff === 0;

              const tx = diff * 300;
              const tz = -absDiff * 160;
              const ry = -dir * Math.min(absDiff * 30, 45);
              const sc = Math.max(1 - absDiff * 0.12, 0.55);
              const op = Math.max(1 - absDiff * 0.35, 0);
              const z = total * 2 - absDiff;
              const bl = absDiff > 1 ? (absDiff - 1) * 2 : 0;

              return (
                <div
                  key={img.src}
                  className="absolute w-[320px] sm:w-[420px] md:w-[520px] lg:w-[600px]"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`,
                    opacity: op,
                    zIndex: z,
                    filter: bl > 0 ? `blur(${bl}px)` : 'none',
                    transition: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
                    cursor: isActive ? 'default' : 'pointer',
                  }}
                  onClick={() => { if (!isActive) setActiveIndex(idx); }}
                >
                  <div
                    className={`
                      relative rounded-2xl overflow-hidden
                      ${isActive
                        ? 'shadow-[0_4px_16px_rgba(0,0,0,0.2)]'
                        : 'shadow-[0_2px_10px_rgba(0,0,0,0.12)]'
                      }
                    `}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={1376}
                      height={768}
                      quality={90}
                      draggable={false}
                      className="w-full aspect-[16/9] object-cover pointer-events-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={() => navigate(1)}
          className="hidden sm:flex shrink-0 w-10 h-10 rounded-full items-center justify-center z-20
            bg-white/80 dark:bg-dark-800/80 border border-gray-200 dark:border-dark-700
            text-gray-500 dark:text-dark-300 hover:text-gray-900 dark:hover:text-white
            hover:border-primary-500/40 transition-colors cursor-pointer active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === activeIndex
                ? 'bg-primary-500 w-6'
                : 'bg-gray-300 dark:bg-dark-600 hover:bg-gray-400 dark:hover:bg-dark-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
