'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Shield,
  TrendingUp,
  BarChart3,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { BotData } from '@/data/bots';

/* ─────────────── Types ─────────────── */

interface BotCarouselProps {
  bots: BotData[];
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

const RISK_CFG = {
  low: { label: 'Low Risk', cls: 'text-green-400 border-green-400/30 bg-green-400/10' },
  medium: { label: 'Med Risk', cls: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10' },
  high: { label: 'High Risk', cls: 'text-red-400 border-red-400/30 bg-red-400/10' },
} as const;

/* Lightweight SVG sparkline — replaces heavy recharts MiniChart */
function Sparkline({ data, color, height = 36 }: { data: number[]; color: string; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 100;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * (height - 2) - 1}`);
  const line = pts.join(' ');
  const area = `${pts.join(' ')} ${w},${height} 0,${height}`;
  const gradId = `sp-${color.replace('#', '')}`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={line} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* Max cards rendered around active — skip far-off invisible ones */
const MAX_VISIBLE = 3;

/* ─────────────── Component ─────────────── */

export function BotCarousel({ bots, autoPlayInterval = 5000 }: BotCarouselProps) {
  const total = bots.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Drag state via refs — no re-renders during drag */
  const dragRef = useRef({
    active: false,
    startX: 0,
    lastX: 0,
    lastTime: 0,
    velocity: 0,         /* px/ms */
  });

  const SWIPE_THRESHOLD = 90; /* px to trigger a card switch while dragging */

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

  /* Autoplay */
  useEffect(() => {
    startAutoplay();
    return stopAutoplay;
  }, [startAutoplay, stopAutoplay]);

  /* Drag handlers — continuous swipe: navigate while holding */
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
    if (dt > 0) d.velocity = (x - d.lastX) / dt; /* px/ms, positive = right */
    d.lastX = x;
    d.lastTime = now;

    /* Continuous swipe: if dragged far enough, navigate and reset anchor */
    const offset = x - d.startX;
    if (Math.abs(offset) >= SWIPE_THRESHOLD) {
      navigate(offset > 0 ? -1 : 1);
      d.startX = x; /* reset anchor so next swipe starts fresh */
    }
  }, [navigate]);

  const onUp = useCallback(() => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;

    /* Momentum: if release velocity is high, fire extra navigations */
    const v = d.velocity; /* px/ms */
    const speed = Math.abs(v);
    if (speed > 0.5) {
      const extra = Math.min(Math.floor(speed / 0.4), 4); /* up to 4 extra cards */
      const dir = v > 0 ? -1 : 1;
      for (let i = 0; i < extra; i++) {
        setTimeout(() => navigate(dir), (i + 1) * 120);
      }
    }
    d.velocity = 0;
    startAutoplay();
  }, [navigate, startAutoplay]);

  /* Keyboard */
  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  }, [navigate]);

  /* Visible card indices (only render ±MAX_VISIBLE around active) */
  const visibleIndices = useMemo(() => {
    const indices: number[] = [];
    for (let offset = -MAX_VISIBLE; offset <= MAX_VISIBLE; offset++) {
      indices.push(mod(activeIndex + offset, total));
    }
    return indices;
  }, [activeIndex, total]);

  return (
    <div className="select-none" onKeyDown={onKey} tabIndex={0} role="region" aria-label="Bot carousel">
      <div className="relative flex items-center justify-center gap-1 sm:gap-3">
        {/* Left arrow — hidden on mobile, swipe instead */}
        <button
          onClick={() => navigate(-1)}
          className="hidden sm:flex shrink-0 w-10 h-10 rounded-full items-center justify-center z-20
            bg-dark-800/80 border border-dark-700 text-dark-300 hover:text-white hover:border-primary-500/40
            transition-colors cursor-pointer active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Cards container */}
        <div
          className="relative flex-1 max-w-6xl flex items-center justify-center overflow-hidden
            h-[420px] sm:h-[440px] md:h-[460px]"
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
              const bot = bots[idx];
              const diff = getWrappedDiff(idx, activeIndex, total);
              const absDiff = Math.abs(diff);
              const dir = Math.sign(diff);
              const isActive = diff === 0;

              const txDesktop = diff * 238;
              const tz = -absDiff * 200;
              const ry = -dir * Math.min(absDiff * 38, 50);
              const sc = Math.max(1 - absDiff * 0.12, 0.55);
              const op = Math.max(1 - absDiff * 0.35, 0);
              const z = total * 2 - absDiff;
              const bl = absDiff > 1 ? (absDiff - 1) * 2 : 0;

              const risk = RISK_CFG[bot.risk];
              const chartColor = bot.return30d >= 0 ? '#10b981' : '#ef4444';

              return (
                <div
                  key={bot.slug}
                  className="absolute left-0 w-[280px] sm:w-[320px] md:w-[340px]"
                  style={{
                    top: '50%',
                    marginTop: '-215px',
                    marginLeft: '-140px',        /* half of mobile 280px */
                    transform: `translateX(${txDesktop}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${sc})`,
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
                      relative rounded-2xl border flex flex-col
                      bg-gradient-to-br from-dark-800 to-dark-900
                      ${isActive
                        ? 'border-primary-500/40 shadow-[0_0_40px_rgba(99,102,241,0.1),0_8px_24px_rgba(0,0,0,0.4)]'
                        : 'border-dark-700 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                      }
                    `}
                  >
                    {isActive && (
                      <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
                    )}

                    <div className="p-4 sm:p-5 flex flex-col">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={bot.icon}
                          alt=""
                          className="w-10 h-10 sm:w-11 sm:h-11 object-contain"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-semibold text-white truncate">{bot.name}</h3>
                            {bot.verified && <Shield className="w-3.5 h-3.5 text-accent-400 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-dark-400 mt-0.5 truncate">{bot.strategy}</p>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex gap-2 mb-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${risk.cls}`}>
                          {risk.label}
                        </span>
                        {bot.trending && (
                          <span className="px-2 py-0.5 bg-dark-900/50 border border-dark-700 rounded text-[10px] font-semibold text-dark-300 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />HOT
                          </span>
                        )}
                      </div>

                      {/* Chart */}
                      <div className="mb-3 bg-dark-900/40 rounded-xl p-3 border border-dark-700/50">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <BarChart3 className="w-3 h-3 text-dark-400" />
                            <span className="text-[10px] font-semibold text-dark-400">30d Performance</span>
                          </div>
                          <span className={`text-sm font-bold ${bot.return30d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            +{bot.return30d.toFixed(1)}%
                          </span>
                        </div>
                        <Sparkline data={bot.performanceData} color={chartColor} height={32} />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3">
                        <div className="text-center p-1.5 sm:p-2 bg-dark-900/50 rounded-lg border border-dark-700/50">
                          <div className="text-[9px] text-dark-400 mb-0.5">1Y Return</div>
                          <div className={`text-xs sm:text-sm font-bold ${bot.return1y >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            +{bot.return1y}%
                          </div>
                        </div>
                        <div className="text-center p-1.5 sm:p-2 bg-dark-900/50 rounded-lg border border-dark-700/50">
                          <div className="text-[9px] text-dark-400 mb-0.5">Win Rate</div>
                          <div className="text-xs sm:text-sm font-bold text-white">{bot.winRate.toFixed(0)}%</div>
                        </div>
                        <div className="text-center p-1.5 sm:p-2 bg-dark-900/50 rounded-lg border border-dark-700/50">
                          <div className="text-[9px] text-dark-400 mb-0.5">Copiers</div>
                          <div className="text-xs sm:text-sm font-bold text-white">
                            {bot.copiers > 999 ? `${(bot.copiers / 1000).toFixed(1)}k` : bot.copiers}
                          </div>
                        </div>
                      </div>

                      {/* Min Investment */}
                      <div className="p-2 sm:p-2.5 bg-dark-900/50 rounded-lg border border-dark-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[10px] text-dark-400">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Min. Investment</span>
                        </div>
                        <span className="text-sm font-semibold text-white">${bot.minInvestment}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right arrow — hidden on mobile */}
        <button
          onClick={() => navigate(1)}
          className="hidden sm:flex shrink-0 w-10 h-10 rounded-full items-center justify-center z-20
            bg-dark-800/80 border border-dark-700 text-dark-300 hover:text-white hover:border-primary-500/40
            transition-colors cursor-pointer active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}
