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

export default function OurCommitmentSection() {
  const t1 = useTilt(4);
  const t2 = useTilt(5);
  const r0 = useReveal(0);
  const r1 = useReveal(80);
  const r2 = useReveal(160);
  const r3 = useReveal(240);
  const r4 = useReveal(300);
  const r5 = useReveal(200);

  return (
    <section style={{
      fontFamily: "'Outfit', sans-serif",
      background: "#fafafa",
      minHeight: "100vh",
      overflow: "hidden",
      position: "relative",
      padding: "clamp(50px, 6vw, 100px) 0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />

      {/* Dot grid */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Decorative circle top-left */}
      <div style={{ position: "absolute", top: 30, left: 30, width: 50, height: 50, borderRadius: "50%", border: "2px solid rgba(0,0,0,0.06)" }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1320, margin: "0 auto", padding: "0 clamp(20px, 4vw, 64px)" }}>

        {/* Main grid: left image strip + center text + right large image */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr 55%",
          gap: "0 40px",
          alignItems: "stretch",
        }}>

          {/* === Col 1: Narrow vertical image strip === */}
          <div
            ref={t1.ref}
            onMouseMove={t1.onMove}
            onMouseLeave={t1.onLeave}
            style={{
              gridColumn: "1", alignSelf: "stretch",
              width: 80, borderRadius: 16, overflow: "hidden",
              cursor: "pointer", transformStyle: "preserve-3d",
              background: "linear-gradient(180deg, #1a1a2e, #16213e, #0f3460, #334155, #1e293b)",
              position: "relative",
            }}
          >
            {/* Video in left strip */}
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
              }}
            >
              <source src="/mnt/user-data/uploads/task_01kh1c3wxqejv8wmstkmv2n7an_task_01kh1c3wxqejv8wmstkmv2n7an_genid_3830765e-3864-47ab-9640-ecb463192f44_26_02_09_14_15_146674_videos_00000_640284601_md.mp4" type="video/mp4" />
              <source src="sidebar-video.mp4" type="video/mp4" />
            </video>
            {/* Fallback overlay if video doesn't load */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 12, padding: "20px 8px", pointerEvents: "none" }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ width: "100%", height: 3, borderRadius: 2, background: `rgba(255,255,255,${0.04 + i * 0.02})` }} />
              ))}
              <svg viewBox="0 0 60 100" style={{ width: "90%", marginTop: 8 }}>
                <polyline points="5,90 15,70 25,75 35,40 45,55 55,20" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              </svg>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ width: "100%", height: 3, borderRadius: 2, background: `rgba(255,255,255,${0.03 + i * 0.015})` }} />
              ))}
            </div>
          </div>

          {/* === Col 2: Text content === */}
          <div style={{ gridColumn: "2", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            {/* Label */}
            <div ref={r0.ref} style={{ ...r0.style, display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 1, background: "#f97316" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#f97316" }}>Our Commitment</span>
            </div>

            {/* Heading */}
            <div ref={r1.ref} style={{ ...r1.style, marginBottom: 28 }}>
              <h2 style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 900, color: "#111", lineHeight: 1.1, letterSpacing: "-0.02em", textTransform: "uppercase", margin: 0 }}>
                We Build Powerful Trading Solutions
              </h2>
            </div>

            {/* Description */}
            <div ref={r2.ref} style={{ ...r2.style, marginBottom: 28 }}>
              <p style={{ color: "#888", fontSize: 14, lineHeight: 1.75, margin: "0 0 16px 0", maxWidth: 440 }}>
                Our platform is designed to empower traders of all levels. We combine cutting-edge technology with intuitive design to deliver automated copy trading that actually works — consistently and transparently.
              </p>
              <p style={{ color: "#888", fontSize: 14, lineHeight: 1.75, margin: 0, maxWidth: 440 }}>
                Every strategy is backtested, every trade is auditable, and every portfolio is protected by institutional-grade risk management systems.
              </p>
            </div>

            {/* Checklist */}
            <div ref={r3.ref} style={{ ...r3.style, display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
              {[
                "Beginner's Guide to Copy Trading",
                "Expert's Guide to Advanced Strategies",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span style={{ color: "#444", fontSize: 14, fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div ref={r4.ref} style={r4.style}>
              <button style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "linear-gradient(135deg, #f97316, #ea580c)", color: "white",
                borderRadius: 999, paddingLeft: 28, paddingRight: 8, paddingTop: 8, paddingBottom: 8,
                border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase",
                fontFamily: "'Outfit', sans-serif",
              }}>
                Read More
                <span style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "rgba(0,0,0,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* === Col 3: Large image area with overlay card === */}
          <div style={{ gridColumn: "3", position: "relative" }}>
            {/* Main large image */}
            <div
              ref={t2.ref}
              onMouseMove={t2.onMove}
              onMouseLeave={t2.onLeave}
              style={{
                width: "100%", height: 520, borderRadius: 20, overflow: "hidden",
                cursor: "pointer", transformStyle: "preserve-3d",
                position: "relative",
                background: "linear-gradient(135deg, #0f172a, #1e293b, #334155, #1e293b)",
              }}
            >
              {/* Dashboard mockup inside */}
              <div style={{ position: "absolute", inset: 20, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                {/* Top bar */}
                <div style={{ height: 36, background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", padding: "0 14px", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
                  <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }}>dashboard.app</span>
                </div>

                {/* Chart area */}
                <div style={{ padding: "20px 16px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 600 }}>Portfolio Value</span>
                    <span style={{ color: "#22c55e", fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>$247,830</span>
                  </div>
                  <svg viewBox="0 0 500 160" style={{ width: "100%" }}>
                    <defs>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[0, 40, 80, 120, 160].map(y => (
                      <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    ))}
                    {/* Chart fill */}
                    <path d="M0,140 Q40,120 80,125 T160,80 T240,90 T320,50 T400,60 T480,25 L500,20 L500,160 L0,160 Z" fill="url(#chartFill)" />
                    {/* Chart line */}
                    <path d="M0,140 Q40,120 80,125 T160,80 T240,90 T320,50 T400,60 T480,25 L500,20" fill="none" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Dot at end */}
                    <circle cx="500" cy="20" r="4" fill="#f97316" />
                    <circle cx="500" cy="20" r="8" fill="#f97316" opacity="0.2" />
                  </svg>
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: 12, padding: "16px 16px 0" }}>
                  {[
                    { label: "Today", val: "+$3,420", color: "#22c55e" },
                    { label: "This Week", val: "+$12,850", color: "#22c55e" },
                    { label: "Win Rate", val: "87.3%", color: "#f97316" },
                    { label: "Trades", val: "1,247", color: "rgba(255,255,255,0.7)" },
                  ].map((s, i) => (
                    <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.02)", borderRadius: 10, padding: "10px 12px" }}>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, marginBottom: 4 }}>{s.label}</div>
                      <div style={{ color: s.color, fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* Active traders */}
                <div style={{ padding: "16px 16px 0" }}>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600, marginBottom: 10, letterSpacing: "0.1em", textTransform: "uppercase" }}>Active Positions</div>
                  {[
                    { pair: "BTC/USDT", type: "LONG", pnl: "+$1,240", c: "#22c55e" },
                    { pair: "ETH/USDT", type: "LONG", pnl: "+$680", c: "#22c55e" },
                    { pair: "SOL/USDT", type: "SHORT", pnl: "-$120", c: "#ef4444" },
                  ].map((pos, i) => (
                    <div key={i} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "8px 10px", marginBottom: 6,
                      background: "rgba(255,255,255,0.02)", borderRadius: 8,
                    }}>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 500 }}>{pos.pair}</span>
                      <span style={{
                        fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 4,
                        background: pos.type === "LONG" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                        color: pos.type === "LONG" ? "#22c55e" : "#ef4444",
                      }}>{pos.type}</span>
                      <span style={{ color: pos.c, fontSize: 12, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{pos.pnl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vertical dots (slider indicator) on bottom-right */}
              <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 6 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: i === 0 ? "#f97316" : "rgba(255,255,255,0.15)",
                  }} />
                ))}
              </div>
            </div>

            {/* Orange overlay CTA card — positioned over bottom of image */}
            {(() => {
              const CtaCard = () => {
                const r = useReveal(400);
                return (
                  <div ref={r.ref} style={{
                    ...r.style,
                    position: "absolute", bottom: 20, left: 20, zIndex: 5,
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                    borderRadius: 18, padding: "24px 30px",
                    display: "flex", alignItems: "center", gap: 24,
                    maxWidth: 420,
                    boxShadow: "0 12px 40px rgba(249,115,22,0.3)",
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: "white", fontSize: 20, fontWeight: 800, lineHeight: 1.2, margin: "0 0 14px 0" }}>
                        Experience Our Platform — One Click Away
                      </h3>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: "rgba(0,0,0,0.15)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                            <polygon points="5,3 19,12 5,21" />
                          </svg>
                        </div>
                        <span style={{ color: "white", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Watch Demo</span>
                      </div>
                    </div>
                    {/* Icon */}
                    <div style={{
                      width: 60, height: 60, borderRadius: 16,
                      background: "rgba(255,255,255,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                      </svg>
                    </div>
                  </div>
                );
              };
              return <CtaCard />;
            })()}
          </div>

        </div>
      </div>
    </section>
  );
}
