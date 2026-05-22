"use client";

import { useEffect, useRef } from "react";

/* ─── Types ──────────────────────────────────────────────────── */
type Layer = 0 | 1 | 2;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  radius: number;
  baseOpacity: number;
  phase: number;
  phaseSpeed: number;
  r: number; g: number; b: number;
  layer: Layer;
}

/* ─── Config ─────────────────────────────────────────────────── */
const PI2 = Math.PI * 2;

// 75% chartreuse brand · 25% teal accent
const PALETTE: [number, number, number][] = [
  [180, 204, 65],
  [180, 204, 65],
  [180, 204, 65],
  [14,  158, 181],
];

// far · mid · near
const LAYERS = [
  { count: 22, rMin: 0.30, rMax: 0.85, sMin: 0.030, sMax: 0.090, opMin: 0.08, opMax: 0.22, linkDist:  95 },
  { count: 30, rMin: 0.75, rMax: 1.45, sMin: 0.080, sMax: 0.185, opMin: 0.18, opMax: 0.44, linkDist: 128 },
  { count: 18, rMin: 1.25, rMax: 2.25, sMin: 0.140, sMax: 0.265, opMin: 0.30, opMax: 0.62, linkDist: 158 },
] as const;

const MOUSE_DIST = 215;
const ATTRACT    = 0.017;

/* ─── Helpers ────────────────────────────────────────────────── */
const rng = (a: number, b: number) => Math.random() * (b - a) + a;

function makeParticle(W: number, H: number, layer: Layer): Particle {
  const cfg   = LAYERS[layer];
  const speed = rng(cfg.sMin, cfg.sMax);
  const angle = Math.random() * PI2;
  const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  return {
    x: Math.random() * W, y: Math.random() * H,
    vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
    radius:      rng(cfg.rMin, cfg.rMax),
    baseOpacity: rng(cfg.opMin, cfg.opMax),
    phase:       Math.random() * PI2,
    phaseSpeed:  rng(0.005, 0.014),
    r, g, b, layer,
  };
}

/* ─── Component ──────────────────────────────────────────────── */
export default function SpiderLines() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let particles: Particle[] = [];
    const raw   = { x: -9999, y: -9999 };
    const mouse = { x: -9999, y: -9999, on: false };

    /* Init / resize */
    const init = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = [];
      ([0, 1, 2] as Layer[]).forEach(l => {
        for (let i = 0; i < LAYERS[l].count; i++)
          particles.push(makeParticle(canvas.width, canvas.height, l));
      });
    };
    init();

    /* Events */
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      raw.x = e.clientX - r.left;
      raw.y = e.clientY - r.top;
      mouse.on = true;
    };
    const onLeave = () => { mouse.on = false; };
    window.addEventListener("mousemove",  onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize",     init);

    /* Draw a single glowing particle (halo + bright core, no shadowBlur) */
    const drawDot = (p: Particle, op: number) => {
      const { r, g, b, x, y, radius } = p;
      const hR = radius * 7;

      const halo = ctx.createRadialGradient(x, y, 0, x, y, hR);
      halo.addColorStop(0,    `rgba(${r},${g},${b},${(op * 0.72).toFixed(3)})`);
      halo.addColorStop(0.38, `rgba(${r},${g},${b},${(op * 0.26).toFixed(3)})`);
      halo.addColorStop(1,    `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(x, y, hR, 0, PI2);
      ctx.fillStyle = halo;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius * 0.52, 0, PI2);
      ctx.fillStyle = `rgba(${r},${g},${b},${Math.min(1, op * 2.1).toFixed(3)})`;
      ctx.fill();
    };

    /* Main loop */
    const loop = () => {
      const { width: W, height: H } = canvas;
      ctx.clearRect(0, 0, W, H);

      /* Smooth cursor lerp */
      if (mouse.on) {
        mouse.x += (raw.x - mouse.x) * 0.09;
        mouse.y += (raw.y - mouse.y) * 0.09;
      }

      /* Move */
      for (const p of particles) {
        if (mouse.on) {
          const dx = mouse.x - p.x, dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          const th = MOUSE_DIST * 1.85;
          if (d2 < th * th) {
            const d = Math.sqrt(d2);
            const f = (1 - d / th) * ATTRACT;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }
        p.vx *= 0.993; p.vy *= 0.993;
        p.x  += p.vx;  p.y  += p.vy;
        p.phase += p.phaseSpeed;

        if (p.x < -30) p.x = W + 30;
        if (p.x > W + 30) p.x = -30;
        if (p.y < -30) p.y = H + 30;
        if (p.y > H + 30) p.y = -30;
      }

      /* Particle ↔ Particle lines (same layer) */
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const maxD = LAYERS[a.layer].linkDist;
        const maxD2 = maxD * maxD;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          if (a.layer !== b.layer) continue;
          const dx = a.x - b.x, dy = a.y - b.y;
          if (dx * dx + dy * dy > maxD2) continue;
          const dist  = Math.sqrt(dx * dx + dy * dy);
          const t     = 1 - dist / maxD;
          const alpha = t * t * (a.layer === 2 ? 0.20 : 0.14);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${a.r},${a.g},${a.b},${alpha.toFixed(3)})`;
          ctx.lineWidth   = a.layer === 2 ? 0.65 : 0.40;
          ctx.stroke();
        }
      }

      /* Cursor ↔ Particle lines (gradient: brand → white) */
      if (mouse.on) {
        const MD2 = MOUSE_DIST * MOUSE_DIST;
        for (const p of particles) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > MD2) continue;
          const dist  = Math.sqrt(d2);
          const t     = 1 - dist / MOUSE_DIST;
          const alpha = t * t * 0.72;

          const grad = ctx.createLinearGradient(p.x, p.y, mouse.x, mouse.y);
          grad.addColorStop(0, `rgba(${p.r},${p.g},${p.b},${alpha.toFixed(3)})`);
          grad.addColorStop(1, `rgba(255,255,255,${(alpha * 0.45).toFixed(3)})`);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = grad;
          ctx.lineWidth   = 0.88;
          ctx.stroke();
        }
      }

      /* Particles (drawn last so they sit above lines) */
      for (const p of particles) {
        const breathe = 0.78 + Math.sin(p.phase) * 0.22;
        drawDot(p, p.baseOpacity * breathe);
      }

      rafId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize",     init);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  );
}
