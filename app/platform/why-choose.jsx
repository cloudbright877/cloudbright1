import { useState, useRef, useEffect, useCallback } from "react";

function useTilt(strength = 6) {
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
      el.style.transform = `perspective(800px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) scale(1.015)`;
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

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: "Secure & Reliable",
    description: "Enterprise-grade security with multi-sig wallets, 2FA, and real-time threat monitoring across all connected exchanges.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    title: "Global Reach",
    description: "Connect to 12+ major exchanges worldwide through a single unified platform with sub-50ms execution speed.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    title: "Smart Automation",
    description: "AI-powered strategy builder with no-code interface. Backtest against years of historical data before going live.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Transparent Performance",
    description: "Full PnL tracking, verified trader statistics, and real-time portfolio analytics with 150+ performance metrics.",
  },
];

export default function WhyChooseSection() {
  const t1 = useTilt(5);
  const t2 = useTilt(6);
  const r0 = useReveal(0);
  const r1 = useReveal(100);
  const r2 = useReveal(150);
  const r3 = useReveal(200);
  const rFeatures = [useReveal(250), useReveal(350), useReveal(450), useReveal(550)];

  return (
    <section style={{
      fontFamily: "'Outfit', sans-serif",
      background: "#0e0e12",
      minHeight: "100vh",
      overflow: "hidden",
      position: "relative",
      padding: "clamp(50px, 6vw, 100px) clamp(20px, 4vw, 64px)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />

      {/* Background texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
      }} />
      {/* Subtle hex grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='86.6' height='150'%3E%3Cpolygon points='43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25' fill='none' stroke='rgba(139,92,246,0.06)' stroke-width='0.8'/%3E%3Cpolygon points='0,100 43.3,125 86.6,100' fill='none' stroke='rgba(139,92,246,0.06)' stroke-width='0.8'/%3E%3Cpolygon points='0,100 0,150 43.3,125' fill='none' stroke='rgba(139,92,246,0.06)' stroke-width='0.8'/%3E%3Cpolygon points='86.6,100 86.6,150 43.3,125' fill='none' stroke='rgba(139,92,246,0.06)' stroke-width='0.8'/%3E%3C/svg%3E\")",
        backgroundSize: "86.6px 150px",
      }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto" }}>

        {/* Top row: heading left, button + description right */}
        <div style={{ display: "grid", gridTemplateColumns: "48% 1fr", gap: "0 40px", marginBottom: 50 }}>

          {/* Left: label + heading */}
          <div>
            <div ref={r0.ref} style={{ ...r0.style, display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 32, height: 1, background: "#f97316" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#f97316" }}>Why Choose</span>
            </div>
            <div ref={r1.ref} style={r1.style}>
              <h2 style={{ fontSize: "clamp(36px, 4.5vw, 60px)", fontWeight: 900, color: "white", lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0 }}>
                Why You Choose Our Platform
              </h2>
            </div>
          </div>

          {/* Right: CTA button + paragraph */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 20 }}>
            <div ref={r2.ref} style={{ ...r2.style, alignSelf: "flex-end" }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 12, background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white",
                borderRadius: 999, paddingLeft: 28, paddingRight: 8, paddingTop: 8, paddingBottom: 8,
                border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
              }}>
                Learn More
                <span style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </span>
              </button>
            </div>
            <div ref={r3.ref} style={r3.style}>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                We provide institutional-grade copy trading tools with complete transparency. Our commitment to security and performance helps traders grow with confidence.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom row: images left, features right */}
        <div style={{ display: "grid", gridTemplateColumns: "48% 1fr", gap: "0 40px", alignItems: "start" }}>

          {/* Left: overlapping images */}
          <div style={{ position: "relative", height: 520 }}>
            {/* Image 1 — top right */}
            <div
              ref={t1.ref}
              onMouseMove={t1.onMove}
              onMouseLeave={t1.onLeave}
              style={{
                position: "absolute", top: 0, left: "22%", width: "78%", height: 340,
                borderRadius: 20, overflow: "hidden", cursor: "pointer",
                transition: "transform 0.5s ease-out", transformStyle: "preserve-3d",
                background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #1a1a3e 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {/* Dashboard mockup */}
              <div style={{ position: "absolute", inset: 16, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ height: 32, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", padding: "0 12px", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308" }} />
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.3)", fontSize: 10 }}>dashboard.app</span>
                </div>
                <svg viewBox="0 0 400 180" style={{ width: "100%", padding: "20px 16px 0" }}>
                  <polyline points="0,140 30,120 70,130 110,70 150,90 200,40 250,55 300,25 350,35 400,15" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                  <polyline points="0,140 30,120 70,130 110,70 150,90 200,40 250,55 300,25 350,35 400,15 400,180 0,180" fill="url(#grad1)" opacity="0.12" />
                  <defs><linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
                </svg>
                <div style={{ padding: "12px 16px", display: "flex", gap: 10 }}>
                  {[["$2.4M", "Volume"], ["847", "Trades"], ["+34%", "PnL"]].map(([val, label], i) => (
                    <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ color: "white", fontSize: 16, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{val}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: 2 }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Image 2 — bottom left, overlapping */}
            <div
              ref={t2.ref}
              onMouseMove={t2.onMove}
              onMouseLeave={t2.onLeave}
              style={{
                position: "absolute", bottom: 0, left: 0, width: "62%", height: 280,
                borderRadius: 20, overflow: "hidden", cursor: "pointer",
                transition: "transform 0.5s ease-out", transformStyle: "preserve-3d",
                background: "linear-gradient(160deg, #0f172a 0%, #1e293b 35%, #334155 70%, #1e293b 100%)",
                border: "1px solid rgba(255,255,255,0.06)",
                zIndex: 2,
              }}
            >
              {/* Mobile app mockup */}
              <div style={{ position: "absolute", inset: 16, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "white", fontSize: 14, fontWeight: 700 }}>Copy Trading</span>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.5)" }} />
                </div>
                {/* Trader cards */}
                {[
                  { name: "AlphaTrader", roi: "+127%", win: "89%", color: "#22c55e" },
                  { name: "CryptoWhale", roi: "+84%", win: "76%", color: "#22c55e" },
                  { name: "SwingKing", roi: "+63%", win: "81%", color: "#22c55e" },
                ].map((t, i) => (
                  <div key={i} style={{
                    margin: "0 16px 8px", padding: "10px 14px", background: "rgba(255,255,255,0.03)",
                    borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${i === 0 ? "#f97316" : i === 1 ? "#6366f1" : "#06b6d4"}, #111)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "white", fontSize: 11, fontWeight: 700 }}>{t.name[0]}</span>
                      </div>
                      <div>
                        <div style={{ color: "white", fontSize: 12, fontWeight: 600 }}>{t.name}</div>
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>Win rate: {t.win}</div>
                      </div>
                    </div>
                    <span style={{ color: t.color, fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{t.roi}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative element behind images */}
            <div style={{
              position: "absolute", top: -10, left: -10, width: 60, height: 60,
              border: "2px solid rgba(249,115,22,0.15)", borderRadius: 12, zIndex: 0,
            }} />
            <div style={{
              position: "absolute", bottom: 40, right: 20, width: 40, height: 40,
              border: "2px solid rgba(249,115,22,0.1)", borderRadius: "50%", zIndex: 0,
            }} />
          </div>

          {/* Right: feature list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32, paddingTop: 10 }}>
            {features.map((f, i) => {
              const r = rFeatures[i];
              return (
                <div
                  key={i}
                  ref={r.ref}
                  style={{
                    ...r.style,
                    display: "grid",
                    gridTemplateColumns: "52px 1fr 60px",
                    gap: "0 16px",
                    alignItems: "start",
                    cursor: "default",
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    border: "1px solid rgba(249,115,22,0.2)", background: "rgba(249,115,22,0.06)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {f.icon}
                  </div>

                  {/* Text */}
                  <div>
                    <h3 style={{ color: "white", fontSize: 18, fontWeight: 800, margin: "0 0 8px 0", letterSpacing: "-0.01em" }}>{f.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, lineHeight: 1.65, margin: 0 }}>{f.description}</p>
                  </div>

                  {/* Number */}
                  <div style={{
                    fontSize: 64, fontWeight: 900, lineHeight: 1,
                    color: "transparent",
                    WebkitTextStroke: "1px rgba(255,255,255,0.06)",
                    textAlign: "right",
                    fontFamily: "'Outfit', sans-serif",
                    userSelect: "none",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
