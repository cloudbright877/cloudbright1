import { useState, useEffect, useRef, useCallback } from "react";

const features = [
  {
    icon: "⚡",
    title: "Instant Copy Trading",
    description: "Mirror top traders' positions in real-time with zero delay execution across all major exchanges.",
    stat: "< 50ms",
    statLabel: "Execution Speed",
  },
  {
    icon: "🛡️",
    title: "Risk Management",
    description: "Advanced stop-loss, take-profit, and position sizing algorithms protect your portfolio 24/7.",
    stat: "99.8%",
    statLabel: "Uptime",
  },
  {
    icon: "📊",
    title: "Analytics Dashboard",
    description: "Deep performance metrics, PnL tracking, and trader scoring system powered by machine learning.",
    stat: "150+",
    statLabel: "Metrics Tracked",
  },
  {
    icon: "🔗",
    title: "Multi-Exchange",
    description: "Connect Binance, Bybit, OKX and more — manage everything from a single unified interface.",
    stat: "12+",
    statLabel: "Exchanges",
  },
  {
    icon: "🤖",
    title: "AI Strategy Builder",
    description: "Create custom trading strategies with our no-code AI builder. Backtest against historical data.",
    stat: "500K+",
    statLabel: "Backtests/day",
  },
  {
    icon: "💎",
    title: "Smart Allocation",
    description: "Automatically distribute capital across top performers based on risk-adjusted returns.",
    stat: "3.2x",
    statLabel: "Avg. ROI",
  },
  {
    icon: "🌐",
    title: "Social Trading",
    description: "Follow elite traders, share strategies, and earn rewards through our referral ecosystem.",
    stat: "50K+",
    statLabel: "Active Traders",
  },
];

const TOTAL = features.length;
const CARD_WIDTH = 320;
const VISIBLE_ANGLE = 55;

/* Wraps difference so it always takes the shortest path around the ring */
function getWrappedDiff(index, active, total) {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

export default function CoverflowCarousel() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const autoplayRef = useRef(null);

  const getCardStyle = useCallback(
    (index) => {
      const diff = getWrappedDiff(index, activeIndex, TOTAL);
      const absDiff = Math.abs(diff);
      const direction = Math.sign(diff);

      const translateX = diff * (CARD_WIDTH * 0.42 + 8);
      const translateZ = -absDiff * 180;
      const rotateY = -direction * Math.min(absDiff * VISIBLE_ANGLE * 0.55, VISIBLE_ANGLE);
      const scale = Math.max(1 - absDiff * 0.12, 0.55);
      const opacity = Math.max(1 - absDiff * 0.22, 0.1);
      const zIndex = TOTAL * 2 - absDiff;
      const blur = absDiff > 1 ? (absDiff - 1) * 2 : 0;

      return {
        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
        opacity,
        zIndex,
        filter: blur > 0 ? `blur(${blur}px)` : "none",
        transition: isDragging ? "none" : "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      };
    },
    [activeIndex, isDragging]
  );

  const navigate = useCallback((dir) => {
    setActiveIndex((prev) => mod(prev + dir, TOTAL));
  }, []);

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      if (!isDragging) navigate(1);
    }, 4000);
    return () => clearInterval(autoplayRef.current);
  }, [isDragging, navigate]);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    setStartX(e.clientX || e.touches?.[0]?.clientX || 0);
    setDragOffset(0);
    clearInterval(autoplayRef.current);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const x = e.clientX || e.touches?.[0]?.clientX || 0;
    setDragOffset(x - startX);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragOffset) > 60) {
      navigate(dragOffset > 0 ? -1 : 1);
    }
    setDragOffset(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  };

  const bg = darkMode ? "bg-[#0a0a0f]" : "bg-[#f0f0f5]";

  const cardBg = darkMode
    ? "bg-gradient-to-br from-white/[0.07] to-white/[0.02] border-white/[0.08]"
    : "bg-gradient-to-br from-white/80 to-white/50 border-white/60";

  const cardShadow = darkMode
    ? "shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)]"
    : "shadow-[8px_8px_24px_rgba(0,0,0,0.08),-8px_-8px_24px_rgba(255,255,255,0.9),inset_0_1px_0_rgba(255,255,255,0.8)]";

  const activeGlow = darkMode
    ? "shadow-[0_0_60px_rgba(99,102,241,0.2),0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
    : "shadow-[0_0_50px_rgba(99,102,241,0.12),8px_8px_24px_rgba(0,0,0,0.1),-8px_-8px_24px_rgba(255,255,255,0.95),inset_0_1px_0_rgba(255,255,255,0.9)]";

  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-white/50" : "text-gray-500";
  const textBody = darkMode ? "text-white/60" : "text-gray-600";

  return (
    <div
      className={`relative min-h-screen ${bg} overflow-hidden flex flex-col items-center justify-center transition-colors duration-700 select-none`}
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-700 ${
            darkMode ? "bg-indigo-600/10" : "bg-indigo-400/10"
          }`}
        />
        <div
          className={`absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[130px] transition-colors duration-700 ${
            darkMode ? "bg-violet-600/8" : "bg-violet-400/8"
          }`}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[180px] transition-colors duration-700 ${
            darkMode ? "bg-cyan-600/5" : "bg-cyan-400/5"
          }`}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: darkMode
              ? "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)"
              : "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-6 right-6 z-50 w-14 h-7 rounded-full p-0.5 transition-all duration-500 cursor-pointer ${
          darkMode
            ? "bg-white/10 border border-white/10"
            : "bg-gray-200 border border-gray-300"
        }`}
      >
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-500 ${
            darkMode
              ? "translate-x-0 bg-indigo-500 shadow-lg shadow-indigo-500/30"
              : "translate-x-7 bg-yellow-400 shadow-lg shadow-yellow-400/30"
          }`}
        >
          {darkMode ? "🌙" : "☀️"}
        </div>
      </button>

      {/* Header */}
      <div className="relative z-10 text-center mb-16 px-4">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-medium tracking-widest uppercase ${
            darkMode
              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
              : "bg-indigo-50 text-indigo-600 border border-indigo-200"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Platform Features
        </div>
        <h2
          className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${textPrimary} transition-colors duration-700`}
        >
          Everything you need to{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            trade smarter
          </span>
        </h2>
        <p
          className={`text-lg max-w-lg mx-auto ${textSecondary} transition-colors duration-700`}
        >
          Powerful tools, real-time execution, zero complexity.
        </p>
      </div>

      {/* Carousel + side arrows */}
      <div
        className="relative z-10 w-full flex items-center justify-center gap-2 md:gap-6 px-4"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Feature carousel"
      >
        {/* Left arrow */}
        <button
          onClick={() => navigate(-1)}
          className={`
            shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300
            cursor-pointer active:scale-90 z-20
            ${
              darkMode
                ? "bg-white/[0.06] border border-white/[0.08] text-white/70 hover:bg-white/10 hover:text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 shadow-[3px_3px_8px_rgba(0,0,0,0.06),-3px_-3px_8px_rgba(255,255,255,0.8)]"
            }
          `}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Cards area */}
        <div
          className="relative flex-1 max-w-5xl flex items-center justify-center overflow-hidden"
          style={{ perspective: "1200px", height: "420px" }}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
        >
        <div className="relative" style={{ transformStyle: "preserve-3d" }}>
          {features.map((feature, index) => {
            const isActive = index === activeIndex;
            const style = getCardStyle(index);

            return (
              <div
                key={index}
                className="absolute top-0 left-0"
                style={{
                  ...style,
                  width: `${CARD_WIDTH}px`,
                  marginLeft: `-${CARD_WIDTH / 2}px`,
                  transformStyle: "preserve-3d",
                  cursor: isActive ? "default" : "pointer",
                }}
                onClick={() => {
                  if (!isDragging) setActiveIndex(index);
                }}
              >
                <div
                  className={`
                    relative rounded-2xl border p-7 h-[370px] flex flex-col
                    backdrop-blur-xl transition-all duration-700
                    ${cardBg}
                    ${isActive ? activeGlow : cardShadow}
                  `}
                >
                  {isActive && (
                    <div className="absolute top-0 left-6 right-6 h-[2px] rounded-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />
                  )}

                  <div
                    className={`
                      w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5
                      transition-all duration-700
                      ${
                        darkMode
                          ? "bg-white/[0.05] border border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                          : "bg-white border border-gray-200 shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)]"
                      }
                    `}
                  >
                    {feature.icon}
                  </div>

                  <h3
                    className={`text-lg font-semibold mb-2.5 tracking-tight ${textPrimary} transition-colors duration-700`}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed mb-auto ${textBody} transition-colors duration-700`}
                  >
                    {feature.description}
                  </p>

                  <div
                    className={`
                      mt-5 pt-5 border-t flex items-end justify-between
                      transition-colors duration-700
                      ${darkMode ? "border-white/[0.06]" : "border-gray-200"}
                    `}
                  >
                    <div>
                      <div
                        className={`text-2xl font-bold tracking-tight transition-colors duration-700 ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
                            : textPrimary
                        }`}
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {feature.stat}
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${textSecondary} transition-colors duration-700`}
                      >
                        {feature.statLabel}
                      </div>
                    </div>
                    {isActive && (
                      <div
                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-700 ${
                          darkMode
                            ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                            : "bg-indigo-50 text-indigo-600 border border-indigo-200"
                        }`}
                      >
                        Learn more →
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                    <div
                      className={`absolute -top-1/2 -left-1/2 w-full h-full rotate-12 transition-opacity duration-700 ${
                        darkMode ? "opacity-[0.03]" : "opacity-[0.15]"
                      }`}
                      style={{
                        background: "linear-gradient(135deg, white 0%, transparent 50%)",
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        </div>

        {/* Right arrow */}
        <button
          onClick={() => navigate(1)}
          className={`
            shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300
            cursor-pointer active:scale-90 z-20
            ${
              darkMode
                ? "bg-white/[0.06] border border-white/[0.08] text-white/70 hover:bg-white/10 hover:text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:text-gray-900 shadow-[3px_3px_8px_rgba(0,0,0,0.06),-3px_-3px_8px_rgba(255,255,255,0.8)]"
            }
          `}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="relative z-10 flex items-center gap-6 mt-8">
        <div className="flex gap-2">
          {features.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`
                h-2 rounded-full transition-all duration-500 cursor-pointer
                ${
                  i === activeIndex
                    ? `w-8 ${darkMode ? "bg-indigo-400" : "bg-indigo-500"}`
                    : `w-2 ${darkMode ? "bg-white/15 hover:bg-white/25" : "bg-gray-300 hover:bg-gray-400"}`
                }
              `}
            />
          ))}
        </div>
      </div>

      {/* Keyboard hint */}
      <div className={`relative z-10 mt-6 flex items-center gap-3 text-xs ${textSecondary}`}>
        <span
          className={`px-2 py-0.5 rounded border ${
            darkMode ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-white"
          }`}
        >
          ←
        </span>
        <span
          className={`px-2 py-0.5 rounded border ${
            darkMode ? "border-white/10 bg-white/[0.03]" : "border-gray-200 bg-white"
          }`}
        >
          →
        </span>
        <span>or drag to navigate</span>
      </div>
    </div>
  );
}
