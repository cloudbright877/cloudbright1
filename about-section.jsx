import { useState, useRef, useEffect, useCallback } from "react";

function useTilt(strength = 7) {
  const ref = useRef(null);
  const frame = useRef(null);
  const onMove = useCallback((e) => {
    if (!ref.current) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = ref.current;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(800px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) scale(1.01)`;
    });
  }, [strength]);
  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
  }, []);
  return { ref, onMove, onLeave };
}

function useReveal(delay = 0) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.unobserve(el); } }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, style: { opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(20px)", transition: `all 0.7s cubic-bezier(.23,1,.32,1) ${delay}ms` } };
}

function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const s = performance.now();
        const tick = (now) => {
          const p = Math.min((now - s) / duration, 1);
          setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function AboutSection() {
  const t1 = useTilt(5);
  const t2 = useTilt(6);
  const t3 = useTilt(8);
  const t4 = useTilt(8);
  const r1 = useReveal(0);
  const r2 = useReveal(80);
  const r3 = useReveal(160);
  const r4 = useReveal(240);
  const r5 = useReveal(120);
  const r6 = useReveal(320);
  const r7 = useReveal(400);

  return (
    <section
      style={{
        fontFamily: "'Outfit', sans-serif",
        background: "#fafafa",
        minHeight: "100vh",
        overflow: "hidden",
        padding: "clamp(40px, 5vw, 80px) clamp(20px, 4vw, 64px)",
        position: "relative",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />

      {/* Dot grid */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.035) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto" }}>

        {/* Label */}
        <div ref={r1.ref} style={{ ...r1.style, display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
          <div style={{ width: 32, height: 1, background: "#f97316" }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#f97316" }}>Who We Are</span>
        </div>

        {/* Main grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "27% 38% 1fr",
          gridTemplateRows: "auto 1fr auto",
          gap: "20px 28px",
          alignItems: "stretch",
        }}>

          {/* ── Col 1, Row 1-2: Image card (tall) ── */}
          <div
            ref={(el) => { r2.ref.current = el; t1.ref.current = el; }}
            onMouseMove={t1.onMove}
            onMouseLeave={t1.onLeave}
            style={{
              ...r2.style,
              gridColumn: "1",
              gridRow: "1 / 3",
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              minHeight: 380,
              cursor: "pointer",
              transformStyle: "preserve-3d",
              /* Placeholder gradient instead of external image */
              background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)",
            }}
          >
            {/* Decorative elements on the placeholder */}
            <div style={{ position: "absolute", top: 24, left: 24, width: 50, height: 50, borderRadius: 12, background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 24 }}>📈</span>
            </div>
            <div style={{ position: "absolute", top: 90, right: 20, width: 80, height: 40, borderRadius: 20, background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
              <span style={{ color: "#10b981", fontSize: 11, fontWeight: 600 }}>Live</span>
            </div>

            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase" }}>Since 2020</div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 18, marginTop: 6, lineHeight: 1.3 }}>Trusted by 50K+ traders worldwide</div>
            </div>
          </div>

          {/* ── Col 2-3, Row 1: Big heading ── */}
          <div ref={r3.ref} style={{ ...r3.style, gridColumn: "2 / 4", gridRow: "1" }}>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 54px)", fontWeight: 900, color: "#111", lineHeight: 1.08, letterSpacing: "-0.02em", margin: 0 }}>
              The Largest Automated Copy Trading Platform In The World
            </h2>
          </div>

          {/* ── Col 2, Row 2-3: Large image (stretches to bottom) ── */}
          <div
            ref={t2.ref}
            onMouseMove={t2.onMove}
            onMouseLeave={t2.onLeave}
            style={{
              gridColumn: "2",
              gridRow: "2 / 4",
              borderRadius: 24,
              overflow: "hidden",
              position: "relative",
              cursor: "pointer",
              transition: "transform 0.5s ease-out",
              transformStyle: "preserve-3d",
              /* Placeholder gradient */
              background: "linear-gradient(160deg, #0f172a 0%, #1e293b 30%, #334155 60%, #475569 100%)",
            }}
          >
            {/* Dashboard mockup elements */}
            <div style={{ position: "absolute", top: 20, left: 20, right: 20, bottom: 20, borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
              {/* Top bar */}
              <div style={{ height: 36, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
              </div>
              {/* Chart lines */}
              <svg viewBox="0 0 400 200" style={{ width: "100%", padding: "20px 14px 0 14px" }}>
                <polyline points="0,160 40,140 80,150 120,100 160,110 200,60 240,80 280,40 320,50 360,20 400,30" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
                <polyline points="0,160 40,140 80,150 120,100 160,110 200,60 240,80 280,40 320,50 360,20 400,30" fill="url(#chartGrad)" stroke="none" opacity="0.15" />
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Stat rows */}
              <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
                {[["BTC/USDT", "+12.4%", "#22c55e"], ["ETH/USDT", "+8.2%", "#22c55e"], ["SOL/USDT", "-2.1%", "#ef4444"]].map(([name, pct, color], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "rgba(255,255,255,0.03)", borderRadius: 8, alignItems: "center" }}>
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 500 }}>{name}</span>
                    <span style={{ color, fontSize: 12, fontWeight: 700 }}>{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 3, Row 2: Vision & Mission ── */}
          <div ref={r5.ref} style={{ ...r5.style, gridColumn: "3", gridRow: "2" }}>
            <h3 style={{ color: "#111", fontWeight: 800, fontSize: 19, marginBottom: 10, marginTop: 0 }}>Our vision</h3>
            <p style={{ color: "#777", fontSize: 14, lineHeight: 1.7, margin: "0 0 28px 0" }}>
              To democratize professional-grade trading strategies, giving everyone access to the same tools used by institutional investors and hedge funds.
            </p>
            <h3 style={{ color: "#111", fontWeight: 800, fontSize: 19, marginBottom: 10 }}>Our mission</h3>
            <p style={{ color: "#777", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              Build the most reliable, transparent, and user-friendly copy trading ecosystem — where every trader can grow their portfolio with confidence.
            </p>
          </div>

          {/* ── Col 3, Row 3: Stat cards ── */}
          <div style={{ gridColumn: "3", gridRow: "3", display: "flex", gap: 14 }}>
            <div
              ref={(el) => { r7.ref.current = el; t3.ref.current = el; }}
              onMouseMove={t3.onMove}
              onMouseLeave={t3.onLeave}
              style={{ ...r7.style, flex: 1, background: "#111", borderRadius: 18, padding: "22px 20px", cursor: "pointer", transition: "transform 0.5s ease-out, opacity 0.7s", transformStyle: "preserve-3d" }}
            >
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>Global Reach</div>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 14 }}>
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span style={{ color: "white", fontSize: 36, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}><Counter end={85} /></span>
                <span style={{ color: "#f97316", fontSize: 20, fontWeight: 700 }}>+</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 4 }}>Countries Served</div>
            </div>

            <div
              ref={t4.ref}
              onMouseMove={t4.onMove}
              onMouseLeave={t4.onLeave}
              style={{ flex: 1, background: "#111", borderRadius: 18, padding: "22px 20px", cursor: "pointer", transition: "transform 0.5s ease-out", transformStyle: "preserve-3d" }}
            >
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>Active Users</div>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 14 }}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
                <span style={{ color: "white", fontSize: 36, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}><Counter end={50} suffix="K" /></span>
                <span style={{ color: "#f97316", fontSize: 20, fontWeight: 700 }}>+</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 4 }}>Traders Worldwide</div>
            </div>
          </div>

          {/* ── Col 1, Row 3: Orange badge + CTA ── */}
          <div style={{ gridColumn: "1", gridRow: "3", display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              ref={r4.ref}
              style={{ ...r4.style, background: "linear-gradient(135deg, #f97316, #ea580c)", borderRadius: 18, padding: "20px 22px", cursor: "pointer" }}
            >
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Platform Status</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#86efac", display: "inline-block", animation: "pulse 2s ease-in-out infinite" }} />
                <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>All Systems Operational</span>
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>99.99% uptime · last 365 days</div>
            </div>

            <div ref={r6.ref} style={r6.style}>
              <button style={{
                display: "flex", alignItems: "center", gap: 12, background: "#111", color: "white",
                borderRadius: 999, paddingLeft: 28, paddingRight: 8, paddingTop: 8, paddingBottom: 8,
                border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                fontFamily: "'Outfit', sans-serif",
              }}>
                Learn More
                <span style={{ width: 40, height: 40, borderRadius: "50%", background: "#f97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
