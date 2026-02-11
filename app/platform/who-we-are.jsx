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
      el.style.transform = `perspective(800px) rotateX(${-y * strength}deg) rotateY(${x * strength}deg) scale(1.02)`;
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

/* Hexagon image component
   All hexagons share the same 30° slope angle.
   For pointy-top: top/bottom tips, sides angled inward
   For flat-top: left/right tips, top/bottom angled inward
   The slope is always tan(30°) ≈ 0.577, so offset = 0.577 * (dimension/2)
*/
function HexImage({ gradient, children, width = 260, height, flat = false, tiltStrength = 6, delay = 0 }) {
  const t = useTilt(tiltStrength);
  const r = useReveal(delay);
  const h = height || width * 1.1;

  let clipPath;
  if (flat) {
    // flat-top: points on left/right, flat edges top/bottom
    // offset on X axis based on height and 30° angle
    const offsetPx = (h / 2) * 0.577;
    const offsetPct = (offsetPx / width) * 100;
    clipPath = `polygon(${offsetPct}% 0%, ${100 - offsetPct}% 0%, 100% 50%, ${100 - offsetPct}% 100%, ${offsetPct}% 100%, 0% 50%)`;
  } else {
    // pointy-top: points on top/bottom, flat edges left/right
    // offset on Y axis based on width and 30° angle
    const offsetPx = (width / 2) * 0.577;
    const offsetPct = (offsetPx / h) * 100;
    clipPath = `polygon(50% 0%, 100% ${offsetPct}%, 100% ${100 - offsetPct}%, 50% 100%, 0% ${100 - offsetPct}%, 0% ${offsetPct}%)`;
  }

  return (
    <div
      ref={(el) => { r.ref.current = el; t.ref.current = el; }}
      onMouseMove={t.onMove}
      onMouseLeave={t.onLeave}
      style={{
        ...r.style,
        width,
        height: h,
        position: "relative",
        cursor: "pointer",
        transition: `transform 0.5s ease-out, opacity 0.7s cubic-bezier(.23,1,.32,1) ${delay}ms, translate 0.7s cubic-bezier(.23,1,.32,1) ${delay}ms`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Orange border hex */}
      <div style={{
        position: "absolute",
        inset: -3,
        clipPath,
        background: "linear-gradient(135deg, #f97316, #ea580c)",
        opacity: 0.5,
      }} />
      {/* Main hex */}
      <div style={{
        position: "absolute",
        inset: 0,
        clipPath,
        background: gradient,
        overflow: "hidden",
      }}>
        {children}
      </div>
    </div>
  );
}

export default function WhoWeAreSection() {
  const r0 = useReveal(0);
  const r1 = useReveal(80);
  const r2 = useReveal(160);
  const r3 = useReveal(220);
  const r4 = useReveal(300);
  const r5 = useReveal(380);
  const r6 = useReveal(440);

  const checklist = [
    "Automated copy trading with real-time execution",
    "Advanced risk management and portfolio protection",
    "Transparent performance metrics across all strategies",
  ];

  return (
    <section style={{
      fontFamily: "'Outfit', sans-serif",
      background: "#fafafa",
      minHeight: "100vh",
      overflow: "hidden",
      position: "relative",
      padding: "clamp(50px, 6vw, 100px) clamp(20px, 4vw, 64px)",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet" />

      {/* Dot grid bg */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Decorative dots */}
      <div style={{ position: "absolute", top: 80, left: 40, width: 8, height: 8, borderRadius: "50%", background: "#f97316" }} />
      <div style={{ position: "absolute", top: 160, right: 100, width: 6, height: 6, borderRadius: "50%", background: "#f97316", opacity: 0.3 }} />

      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto" }}>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "50% 1fr", gap: "0 50px", alignItems: "start" }}>

          {/* ── Left column ── */}
          <div>
            {/* Label */}
            <div ref={r0.ref} style={{ ...r0.style, display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 32, height: 1, background: "#f97316" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "#f97316" }}>Who We Are</span>
            </div>

            {/* Heading */}
            <div ref={r1.ref} style={{ ...r1.style, marginBottom: 20 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f97316", marginBottom: 12 }} />
              <h2 style={{ fontSize: "clamp(36px, 4.5vw, 58px)", fontWeight: 900, color: "#111", lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0 }}>
                Leading Global Copy Trading Platform
              </h2>
            </div>

            {/* Description */}
            <div ref={r2.ref} style={{ ...r2.style, marginBottom: 32 }}>
              <p style={{ color: "#777", fontSize: 15, lineHeight: 1.7, margin: 0, maxWidth: 520 }}>
                After years of building institutional trading tools, our team launched this platform to give retail traders access to the same automated strategies used by hedge funds and professional investors.
              </p>
            </div>

            {/* Checklist */}
            <div ref={r3.ref} style={{ ...r3.style, display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
              {checklist.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span style={{ color: "#222", fontSize: 15, fontWeight: 700 }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Quote card */}
            <div ref={r4.ref} style={{
              ...r4.style,
              background: "#f5f5f5",
              borderRadius: 20,
              padding: "24px 28px",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 20,
              alignItems: "center",
              marginBottom: 36,
              maxWidth: 520,
              border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <p style={{ color: "#444", fontSize: 14, lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
                "We believe every trader deserves access to professional-grade tools. Our platform levels the playing field."
              </p>
              <div style={{ textAlign: "center" }}>
                <div style={{ color: "#f97316", fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>Alex Chen</div>
                <div style={{ color: "#999", fontSize: 12, marginTop: 2 }}>CEO & Founder</div>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", margin: "10px auto 0",
                  background: "linear-gradient(135deg, #f97316, #6366f1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, color: "white", fontWeight: 700,
                }}>
                  A
                </div>
              </div>
            </div>

            {/* Bottom: CTA + Contact */}
            <div ref={r5.ref} style={{ ...r5.style, display: "flex", alignItems: "center", gap: 20 }}>
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

              {/* Contact */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%", background: "#f97316",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                </div>
                <div>
                  <div style={{ color: "#999", fontSize: 12 }}>Support 24/7</div>
                  <div style={{ color: "#111", fontSize: 16, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>support@platform.com</div>
                </div>
              </div>
            </div>
          </div>


          {/* Right column: overlapping shapes with cutout effect */}
          <div style={{ position: "relative", minHeight: 720 }}>

            {/* === OVAL (large, center) — lowest layer === */}
            {(() => {
              const OvalCard = () => {
                const t = useTilt(5);
                const r = useReveal(200);
                return (
                  <div
                    ref={(el) => { r.ref.current = el; t.ref.current = el; }}
                    onMouseMove={t.onMove}
                    onMouseLeave={t.onLeave}
                    style={{
                      ...r.style,
                      position: "absolute", top: 20, left: "8%", zIndex: 1,
                      width: 340, height: 560, borderRadius: 180, overflow: "hidden",
                      cursor: "pointer", transformStyle: "preserve-3d",
                      background: "linear-gradient(145deg, #1a1a2e, #16213e, #0f3460, #1a1a3e)",
                    }}
                  >
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 30 }}>
                      <svg viewBox="0 0 200 120" style={{ width: "80%" }}>
                        <polyline points="0,100 25,85 50,90 75,50 100,60 130,25 160,40 190,15" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                        <polyline points="0,100 25,85 50,90 75,50 100,60 130,25 160,40 190,15 200,10 200,120 0,120" fill="url(#hg1)" opacity="0.2" />
                        <defs><linearGradient id="hg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
                      </svg>
                      <div style={{ color: "white", fontSize: 32, fontWeight: 800, marginTop: 16, fontFamily: "'JetBrains Mono', monospace" }}>+34.2%</div>
                      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 4 }}>Portfolio Growth</div>
                    </div>
                  </div>
                );
              };
              return <OvalCard />;
            })()}

            {/* === HEX 2 (small, top-right) — cutout + shape === */}
            {(() => {
              const Hex2Card = () => {
                const t = useTilt(7);
                const r = useReveal(350);
                const s = 180;
                const h = Math.round(s * 0.866);
                const clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
                return (
                  <>
                    {/* Cutout layer — same color as page bg, slightly larger, "erases" the oval behind */}
                    <div style={{
                      position: "absolute", top: -2, right: -2, zIndex: 2,
                      width: s + 16, height: h + 16,
                      clipPath,
                      background: "#fafafa",
                      pointerEvents: "none",
                    }} />
                    {/* Main hex */}
                    <div
                      ref={(el) => { r.ref.current = el; t.ref.current = el; }}
                      onMouseMove={t.onMove}
                      onMouseLeave={t.onLeave}
                      style={{
                        ...r.style,
                        position: "absolute", top: 6, right: 6, zIndex: 3,
                        width: s, height: h,
                        clipPath,
                        cursor: "pointer", transformStyle: "preserve-3d",
                        background: "linear-gradient(160deg, #0f172a, #1e293b, #334155, #1e293b)",
                      }}
                    >
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8 }}>
                          <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <div style={{ color: "white", fontSize: 22, fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>85+</div>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, marginTop: 2 }}>Countries</div>
                      </div>
                    </div>
                  </>
                );
              };
              return <Hex2Card />;
            })()}

            {/* === HEX 3 (bottom-right) — cutout + shape === */}
            {(() => {
              const Hex3Card = () => {
                const t = useTilt(6);
                const r = useReveal(500);
                const hexW = 320;
                const hexH = Math.round(hexW * 0.866);
                const clipPath = "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
                return (
                  <>
                    {/* Cutout layer */}
                    <div style={{
                      position: "absolute", bottom: 38, right: -12, zIndex: 2,
                      width: hexW + 16, height: hexH + 16,
                      clipPath,
                      background: "#fafafa",
                      pointerEvents: "none",
                    }} />
                    {/* Main hex */}
                    <div
                      ref={(el) => { r.ref.current = el; t.ref.current = el; }}
                      onMouseMove={t.onMove}
                      onMouseLeave={t.onLeave}
                      style={{
                        ...r.style,
                        position: "absolute", bottom: 46, right: -4, zIndex: 3,
                        width: hexW, height: hexH,
                        clipPath,
                        cursor: "pointer", transformStyle: "preserve-3d",
                        background: "linear-gradient(160deg, #111827, #1f2937, #374151, #1f2937)",
                      }}
                    >
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "30px 65px" }}>
                        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>Top Traders</div>
                        {[
                          { name: "AlphaTrader", roi: "+127%", c: "#22c55e" },
                          { name: "CryptoWhale", roi: "+84%", c: "#22c55e" },
                          { name: "SwingKing", roi: "+63%", c: "#22c55e" },
                        ].map((tr, i) => (
                          <div key={i} style={{
                            display: "flex", justifyContent: "space-between", alignItems: "center",
                            padding: "8px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
                          }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{
                                width: 28, height: 28, borderRadius: "50%",
                                background: `linear-gradient(135deg, ${i === 0 ? "#f97316" : i === 1 ? "#6366f1" : "#06b6d4"}, #222)`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 10, color: "white", fontWeight: 700,
                              }}>{tr.name[0]}</div>
                              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500 }}>{tr.name}</span>
                            </div>
                            <span style={{ color: tr.c, fontSize: 13, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{tr.roi}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              };
              return <Hex3Card />;
            })()}

          </div>

        </div>
      </div>
    </section>
  );
}
