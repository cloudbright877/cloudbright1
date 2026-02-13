'use client';

import { useEffect, useRef } from 'react';

/**
 * Neon lines that travel along hex-grid edges.
 * Colors: violet (270) + indigo (230). No head circle.
 */
export function NeonGridLines({
  hexR = 50,
  maxLines = 4,
  speed = 2.2,
  opacity = 0.7,
}: {
  hexR?: number;
  maxLines?: number;
  speed?: number;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const R = hexR;
    const W = R * Math.sqrt(3);
    const PAT_H = R * 3;
    const TRAIL_LEN = 120;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Build hex grid nodes & edges
    type Pt = { x: number; y: number };
    type Edge = [number, number];

    const nodes: Pt[] = [];
    const edges: Edge[] = [];
    const nodeMap = new Map<string, number>();

    const addNode = (x: number, y: number) => {
      const key = `${Math.round(x)},${Math.round(y)}`;
      if (nodeMap.has(key)) return nodeMap.get(key)!;
      const idx = nodes.length;
      nodes.push({ x, y });
      nodeMap.set(key, idx);
      return idx;
    };

    const hexVertices = (cx: number, cy: number): Pt[] =>
      [0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return { x: cx + R * Math.cos(rad), y: cy + R * Math.sin(rad) };
      });

    const cols = Math.ceil(canvas.width / W) + 2;
    const rows = Math.ceil(canvas.height / PAT_H) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const cx1 = col * W + W / 2;
        const cy1 = row * PAT_H + R;
        const cx2 = col * W;
        const cy2 = row * PAT_H + R * 2.5;

        for (const c of [{ x: cx1, y: cy1 }, { x: cx2, y: cy2 }]) {
          const verts = hexVertices(c.x, c.y);
          const ids = verts.map((v) => addNode(v.x, v.y));
          for (let i = 0; i < 6; i++) {
            edges.push([ids[i], ids[(i + 1) % 6]]);
          }
        }
      }
    }

    // Adjacency
    const adj = new Map<number, number[]>();
    edges.forEach(([a, b]) => {
      if (!adj.has(a)) adj.set(a, []);
      if (!adj.has(b)) adj.set(b, []);
      adj.get(a)!.push(b);
      adj.get(b)!.push(a);
    });

    type Line = {
      nodeIdx: number;
      progress: number;
      targetIdx: number;
      trail: Pt[];
      hue: number;
    };

    const spawnLine = (): Line => {
      const e = edges[Math.floor(Math.random() * edges.length)];
      return {
        nodeIdx: e[0],
        progress: 0,
        targetIdx: e[1],
        trail: [],
        hue: Math.random() > 0.5 ? 270 : 230,
      };
    };

    const lines: Line[] = [];
    for (let i = 0; i < maxLines; i++) lines.push(spawnLine());

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      lines.forEach((line) => {
        const from = nodes[line.nodeIdx];
        const to = nodes[line.targetIdx];
        const edgeLen = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2) || 1;
        line.progress += speed / edgeLen;

        const cx = from.x + (to.x - from.x) * Math.min(line.progress, 1);
        const cy = from.y + (to.y - from.y) * Math.min(line.progress, 1);
        line.trail.push({ x: cx, y: cy });
        if (line.trail.length > TRAIL_LEN) line.trail.shift();

        if (line.progress >= 1) {
          const neighbors = adj.get(line.targetIdx) || [];
          const filtered = neighbors.filter((n) => n !== line.nodeIdx);
          const next = filtered.length > 0
            ? filtered[Math.floor(Math.random() * filtered.length)]
            : neighbors[Math.floor(Math.random() * neighbors.length)];
          line.nodeIdx = line.targetIdx;
          line.targetIdx = next;
          line.progress = 0;
        }

        // Trail
        for (let i = 0; i < line.trail.length; i++) {
          const t = i / line.trail.length;
          const alpha = t * 0.6;
          const size = 1 + t * 1.5;
          ctx.beginPath();
          ctx.arc(line.trail[i].x, line.trail[i].y, size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${line.hue}, 90%, 65%, ${alpha})`;
          ctx.fill();
        }

        // Respawn if off-screen
        const head = line.trail[line.trail.length - 1];
        if (head && (head.x < -100 || head.x > canvas.width + 100 || head.y < -100 || head.y > canvas.height + 100)) {
          Object.assign(line, spawnLine());
        }
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [hexR, maxLines, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity }}
    />
  );
}

/**
 * SVG hex-grid CSS background pattern — use as inline style.
 * Drop-in replacement for the old square-grid linear-gradient.
 */
const HEX_R = 50;
const HEX_W = +(HEX_R * Math.sqrt(3)).toFixed(2);
const HEX_PAT_H = HEX_R * 3;

function hexPoints(cx: number, cy: number) {
  return [0, 60, 120, 180, 240, 300]
    .map((deg) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return `${(cx + HEX_R * Math.cos(rad)).toFixed(2)},${(cy + HEX_R * Math.sin(rad)).toFixed(2)}`;
    })
    .join(' ');
}

const hexSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='${HEX_W}' height='${HEX_PAT_H}'><polygon points='${hexPoints(HEX_W / 2, HEX_R)}' fill='none' stroke='rgba(139,92,246,0.06)' stroke-width='0.8'/><polygon points='${hexPoints(0, HEX_R * 2.5)}' fill='none' stroke='rgba(139,92,246,0.06)' stroke-width='0.8'/><polygon points='${hexPoints(HEX_W, HEX_R * 2.5)}' fill='none' stroke='rgba(139,92,246,0.06)' stroke-width='0.8'/></svg>`;

export const hexGridBg = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(hexSvg)}")`,
  backgroundSize: `${HEX_W}px ${HEX_PAT_H}px`,
} as const;
