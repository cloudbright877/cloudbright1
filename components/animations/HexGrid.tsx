'use client';

import { useRef, useEffect } from 'react';

/**
 * Interactive 3D hexagonal grid.
 * Optimized: offscreen base grid, no sqrt, minimal draw calls.
 * Waves sweep from random directions every 8-14s.
 */
export function HexGrid({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const prevMouse = useRef({ x: -9999, y: -9999 });
  const isOver = useRef(false);
  const rafId = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    /* ── constants ── */
    const GRID_R = 62;
    const DRAW_R = GRID_R * 0.92;
    const COL_W = Math.sqrt(3) * GRID_R;
    const ROW_H = GRID_R * 1.5;
    const GLOW_R_SQ = 220 * 220; // squared — no sqrt needed
    const GLOW_R = 220;
    const MAX_ELEV = 16;

    let w = 0;
    let h = 0;
    let dpr = 1;

    // vertex offsets
    const vx: number[] = [];
    const vy: number[] = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      vx.push(DRAW_R * Math.cos(a));
      vy.push(DRAW_R * Math.sin(a));
    }

    /* ── pre-computed hex data (flat arrays) ── */
    let N = 0;
    let hx: Float32Array; // x positions
    let hy: Float32Array; // y positions
    // per-hex pre-computed colors (depends only on cx)
    let colR: Uint8Array;
    let colG: Uint8Array;
    let colB: Uint8Array;
    let hiR: Uint8Array;
    let hiG: Uint8Array;
    let hiB: Uint8Array;

    /* ── offscreen canvas for static base grid ── */
    const baseCanvas = document.createElement('canvas');
    const baseCtx = baseCanvas.getContext('2d')!;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const buildGrid = () => {
      const cols = Math.ceil(w / COL_W) + 2;
      const rows = Math.ceil(h / ROW_H) + 2;
      N = (cols + 1) * (rows + 1);

      hx = new Float32Array(N);
      hy = new Float32Array(N);
      colR = new Uint8Array(N);
      colG = new Uint8Array(N);
      colB = new Uint8Array(N);
      hiR = new Uint8Array(N);
      hiG = new Uint8Array(N);
      hiB = new Uint8Array(N);

      let idx = 0;
      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const cx = col * COL_W + (row % 2 ? COL_W / 2 : 0);
          const cy = row * ROW_H;
          hx[idx] = cx;
          hy[idx] = cy;
          const t = w > 0 ? Math.max(0, Math.min(1, cx / w)) : 0;
          colR[idx] = lerp(79, 37, t) | 0;
          colG[idx] = lerp(70, 99, t) | 0;
          colB[idx] = lerp(229, 235, t) | 0;
          hiR[idx] = lerp(129, 96, t) | 0;
          hiG[idx] = lerp(140, 165, t) | 0;
          hiB[idx] = lerp(248, 250, t) | 0;
          idx++;
        }
      }
      N = idx;

      // render base grid to offscreen canvas
      baseCanvas.width = w * dpr;
      baseCanvas.height = h * dpr;
      baseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      baseCtx.clearRect(0, 0, w, h);

      // single batched path for all base hexes
      baseCtx.beginPath();
      for (let i = 0; i < N; i++) {
        const cx = hx[i];
        const cy = hy[i];
        baseCtx.moveTo(cx + vx[0], cy + vy[0]);
        for (let j = 1; j < 6; j++) baseCtx.lineTo(cx + vx[j], cy + vy[j]);
        baseCtx.closePath();
      }
      // use mid-screen color for base
      const midT = 0.5;
      const br = lerp(79, 37, midT) | 0;
      const bg = lerp(70, 99, midT) | 0;
      const bb = lerp(229, 235, midT) | 0;
      baseCtx.fillStyle = `rgba(${br},${bg},${bb},0.02)`;
      baseCtx.fill();
      baseCtx.strokeStyle = `rgba(${br},${bg},${bb},0.08)`;
      baseCtx.lineWidth = 1;
      baseCtx.stroke();
    };

    /* ── resize ── */
    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildGrid();
      prevMouse.current = { x: -9999, y: -9999 }; // force redraw
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── mouse tracking ── */
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouse.current = { x, y };
        isOver.current = true;
      } else if (isOver.current) {
        mouse.current = { x: -1000, y: -1000 };
        isOver.current = false;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      mouse.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };
    const onTouchEnd = () => {
      mouse.current = { x: -1000, y: -1000 };
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);

    /* ── wave system ── */
    type WaveDir = 'left' | 'right' | 'top' | 'bottom' | 'radial' | 'diag-tl' | 'diag-tr' | 'diag-bl' | 'diag-br';
    const WAVE_DIRS: WaveDir[] = ['left', 'right', 'top', 'bottom', 'radial', 'diag-tl', 'diag-tr', 'diag-bl', 'diag-br'];
    let waveDir: WaveDir = 'radial';
    let waveStart = performance.now() + 2000; // first wave after 2s
    const WAVE_DUR = 2400;
    let waveInterval = 3500; // short gap before second radial
    let waveCount = 0; // track how many waves have fired

    const nextWave = (now: number) => {
      waveCount++;
      if (waveCount === 1) {
        // second wave is also radial
        waveDir = 'radial';
        waveInterval = 3500;
      } else {
        // after first two radials, random direction + normal interval
        waveDir = WAVE_DIRS[(Math.random() * WAVE_DIRS.length) | 0];
        waveInterval = 8000 + Math.random() * 6000;
      }
      waveStart = now;
    };

    // returns glow contribution from wave for hex at (cx, cy)
    const WAVE_W = 260;
    const waveGlow = (cx: number, cy: number, progress: number): number => {
      let front: number;
      let dist: number;
      switch (waveDir) {
        case 'left':
          front = progress * (w + WAVE_W) - WAVE_W / 2;
          dist = Math.abs(cx - front);
          break;
        case 'right':
          front = (1 - progress) * (w + WAVE_W) - WAVE_W / 2;
          dist = Math.abs(cx - front);
          break;
        case 'top':
          front = progress * (h + WAVE_W) - WAVE_W / 2;
          dist = Math.abs(cy - front);
          break;
        case 'bottom':
          front = (1 - progress) * (h + WAVE_W) - WAVE_W / 2;
          dist = Math.abs(cy - front);
          break;
        case 'radial': {
          const maxR = Math.sqrt(w * w + h * h) * 0.5;
          const ring = progress * (maxR + WAVE_W);
          const dx2 = cx - w * 0.5;
          const dy2 = cy - h * 0.5;
          const d = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          dist = Math.abs(d - ring);
          break;
        }
        case 'diag-tl': {
          // top-left → bottom-right: project onto diagonal axis
          const diag = w + h;
          const pos = progress * (diag + WAVE_W) - WAVE_W / 2;
          dist = Math.abs((cx + cy) - pos);
          break;
        }
        case 'diag-tr': {
          // top-right → bottom-left
          const diag2 = w + h;
          const pos2 = progress * (diag2 + WAVE_W) - WAVE_W / 2;
          dist = Math.abs(((w - cx) + cy) - pos2);
          break;
        }
        case 'diag-bl': {
          // bottom-left → top-right
          const diag3 = w + h;
          const pos3 = (1 - progress) * (diag3 + WAVE_W) - WAVE_W / 2;
          dist = Math.abs((cx + cy) - pos3);
          break;
        }
        case 'diag-br': {
          // bottom-right → top-left
          const diag4 = w + h;
          const pos4 = (1 - progress) * (diag4 + WAVE_W) - WAVE_W / 2;
          dist = Math.abs(((w - cx) + cy) - pos4);
          break;
        }
      }
      const prox = Math.max(0, 1 - dist / WAVE_W);
      return prox * prox * 0.65;
    };

    /* ── hex drawing (minimal layers) ── */
    const hexPath = (cx: number, cy: number) => {
      ctx.beginPath();
      ctx.moveTo(cx + vx[0], cy + vy[0]);
      for (let j = 1; j < 6; j++) ctx.lineTo(cx + vx[j], cy + vy[j]);
      ctx.closePath();
    };

    const drawGlowHex = (i: number, glow: number) => {
      const cx = hx[i];
      const cy = hy[i];
      const r = colR[i];
      const g = colG[i];
      const b = colB[i];
      const elev = glow * MAX_ELEV;

      // shadow
      if (elev > 0.5) {
        hexPath(cx + elev * 0.15, cy + elev * 0.8);
        ctx.fillStyle = `rgba(0,0,0,${(glow * 0.5).toFixed(2)})`;
        ctx.fill();
      }

      const fy = cy - elev;

      // fill + border (combined path)
      hexPath(cx, fy);
      ctx.fillStyle = `rgba(${r},${g},${b},${(0.06 + glow * 0.4).toFixed(2)})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(${r},${g},${b},${(0.18 + glow * 0.82).toFixed(2)})`;
      ctx.lineWidth = glow > 0.3 ? 2.5 : 1;
      ctx.stroke();

      // neon glow: one soft outer stroke + inner highlight fill
      if (glow > 0.35) {
        const a = glow - 0.35;
        hexPath(cx, fy);
        ctx.strokeStyle = `rgba(${r},${g},${b},${(a * 0.2).toFixed(2)})`;
        ctx.lineWidth = 10;
        ctx.stroke();

        const hr = hiR[i];
        const hg = hiG[i];
        const hb = hiB[i];
        hexPath(cx, fy);
        ctx.fillStyle = `rgba(${hr},${hg},${hb},${(a * 0.3).toFixed(2)})`;
        ctx.fill();
      }

      // hot bloom for closest hexes
      if (glow > 0.75) {
        const hr = hiR[i];
        const hg = hiG[i];
        const hb = hiB[i];
        const a = glow - 0.75;
        hexPath(cx, fy);
        ctx.strokeStyle = `rgba(${hr},${hg},${hb},${(a * 0.35).toFixed(2)})`;
        ctx.lineWidth = 18;
        ctx.stroke();
      }
    };

    /* ── animation loop ── */
    const animate = (now: number) => {
      // wave state
      const waveElapsed = now - waveStart;
      let waveProgress = -1;
      let waveActive = false;
      if (waveElapsed >= 0 && waveElapsed < WAVE_DUR) {
        const t = waveElapsed / WAVE_DUR;
        waveProgress = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        waveActive = true;
      } else if (waveElapsed >= waveInterval) {
        nextWave(now);
      }

      // skip if nothing changed
      const mx = mouse.current.x;
      const my = mouse.current.y;
      const pmx = prevMouse.current.x;
      const pmy = prevMouse.current.y;
      const mouseMoved = Math.abs(mx - pmx) > 0.5 || Math.abs(my - pmy) > 0.5;

      if (!mouseMoved && !waveActive) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }
      prevMouse.current = { x: mx, y: my };

      // draw base grid from offscreen (one drawImage call)
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(baseCanvas, 0, 0, w, h);

      // draw only glowing hexes on top
      for (let i = 0; i < N; i++) {
        const dx = hx[i] - mx;
        const dy = hy[i] - my;
        const distSq = dx * dx + dy * dy;

        let glow = 0;

        // mouse glow (no sqrt!)
        if (distSq < GLOW_R_SQ) {
          const proximity = 1 - Math.sqrt(distSq) / GLOW_R;
          glow = proximity * proximity;
        }

        // wave glow
        if (waveActive) {
          glow = Math.min(1, glow + waveGlow(hx[i], hy[i], waveProgress));
        }

        if (glow > 0.01) {
          drawGlowHex(i, glow);
        }
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
    />
  );
}
