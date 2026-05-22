import { Fragment } from "react";
import { SecondaryBtn } from "./ui";
import { LiveLatency } from "./LiveLatency";
import { ScrambleText } from "./ScrambleText";
import SpiderLines from "./SpiderLines";
import { WebGLShader } from "@/components/ui/web-gl-shader";
import { LiquidButton } from "@/components/ui/liquid-glass-button";


const PIPELINE_NODES = [
  { name: "lint",    active: false },
  { name: "build",   active: false },
  { name: "migrate", active: false },
  { name: "canary",  active: false },
  { name: "live",    active: true  },
];

const LOG_LINES = [
  "[run]  push → main",
  "[ok]   lint       0 errors",
  "[ok]   tests      112 passed",
  "[ok]   build      23.4s",
  "[ok]   migrate    v18 → v19",
  "[ok]   canary 10% healthy",
  "[ok]   canary 100% healthy",
  "[live] payments-api v2.4.1",
];

const METRICS = [
  { val: <LiveLatency />, sub: "p95 latency" },
  { val: "99.98%",        sub: "30d uptime"  },
  { val: "0",             sub: "incidents"   },
] as const;

export default function Hero() {
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{
        background: "transparent",
        minHeight: "100vh",
        paddingTop: "64px",
        paddingBottom: "80px",
      }}
    >
      {/* ── WebGL shader — full-page base layer ───────────────── */}
      <WebGLShader />

      {/* ── Dark teal overlay — preserves brand aesthetic over shader */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "rgba(0, 20, 26, 0.88)" }}
        aria-hidden="true"
      />

      {/* ── Particle network ──────────────────────────────────── */}
      <SpiderLines />

      {/* ── Cinematic atmosphere ──────────────────────────────── */}

      {/* Key light — teal, directional from top-left, slow breathe */}
      <div
        className="cinema-key pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 72% 62% at 14% -5%, rgba(14,158,181,0.24) 0%, rgba(14,158,181,0.06) 45%, transparent 72%)",
          filter: "blur(8px)",
        }}
        aria-hidden="true"
      />

      {/* Fill light — chartreuse bloom from bottom-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 96% 110%, rgba(180,204,65,0.15) 0%, rgba(180,204,65,0.04) 48%, transparent 72%)",
          filter: "blur(14px)",
        }}
        aria-hidden="true"
      />

      {/* God rays — diagonal blurred shafts, screen blend */}
      <div
        className="cinema-rays pointer-events-none absolute inset-0 overflow-hidden"
        style={{ mixBlendMode: "screen" }}
        aria-hidden="true"
      >
        <div style={{ position:"absolute", top:"-40%", left:"5%",  width:280, height:"170%", background:"linear-gradient(180deg,rgba(180,204,65,0.9) 0%,rgba(180,204,65,0.20) 52%,transparent 100%)", transform:"rotate(-28deg)", transformOrigin:"top center", filter:"blur(34px)", opacity:0.038 }} />
        <div style={{ position:"absolute", top:"-40%", left:"19%", width:95,  height:"170%", background:"linear-gradient(180deg,rgba(180,204,65,0.8) 0%,rgba(180,204,65,0.14) 58%,transparent 100%)", transform:"rotate(-28deg)", transformOrigin:"top center", filter:"blur(22px)", opacity:0.026 }} />
        <div style={{ position:"absolute", top:"-40%", left:"33%", width:160, height:"170%", background:"linear-gradient(180deg,rgba(14,158,181,0.8)  0%,rgba(14,158,181,0.10)  62%,transparent 100%)", transform:"rotate(-22deg)", transformOrigin:"top center", filter:"blur(30px)", opacity:0.028 }} />
      </div>

      {/* Drifting ambient */}
      <div className="hero-gradient-drift pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Ambient — upper-left chartreuse */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-160 h-160"
        style={{ background: "radial-gradient(circle, rgba(180,204,65,0.09) 0%, transparent 62%)" }}
        aria-hidden="true"
      />
      {/* Ambient — lower-right */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-120 w-[65%]"
        style={{ background: "radial-gradient(ellipse 80% 90% at 90% 100%, rgba(180,204,65,0.07) 0%, rgba(14,158,181,0.04) 45%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Mid-depth atmospheric haze */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 88% 28% at 50% 46%, rgba(14,158,181,0.032) 0%, transparent 100%)" }}
        aria-hidden="true"
      />

      {/* Bubble cluster — bottom-left */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-[38%] h-[65%]" aria-hidden="true">
        <div className="bubble-a absolute w-1.5 h-1.5 rounded-full" style={{ bottom:"18%", left:"9%",  background:"rgba(212,255,58,0.38)", animationDuration:"9s" }} />
        <div className="bubble-b absolute w-1   h-1   rounded-full" style={{ bottom:"32%", left:"5%",  background:"rgba(212,255,58,0.45)", animationDuration:"11s", animationDelay:"-4s" }} />
        <div className="bubble-c absolute w-2   h-2   rounded-full" style={{ bottom:"24%", left:"20%", background:"rgba(212,255,58,0.28)", animationDuration:"14s", animationDelay:"-2s" }} />
        <div className="bubble-a absolute w-1   h-1   rounded-full" style={{ bottom:"42%", left:"14%", background:"rgba(212,255,58,0.35)", animationDuration:"10s", animationDelay:"-7s" }} />
        <div className="bubble-b absolute w-2.5 h-2.5 rounded-full" style={{ bottom:"10%", left:"32%", background:"rgba(14,158,181,0.30)", animationDuration:"16s", animationDelay:"-3s" }} />
        <div className="bubble-c absolute w-1.5 h-1.5 rounded-full" style={{ bottom:"52%", left:"28%", background:"rgba(14,158,181,0.25)", animationDuration:"12s", animationDelay:"-9s" }} />
        <div className="bubble-a absolute w-1   h-1   rounded-full" style={{ bottom:"8%",  left:"48%", background:"rgba(212,255,58,0.30)", animationDuration:"13s", animationDelay:"-5s" }} />
        <div className="bubble-b absolute w-10 h-10 rounded-full" style={{ bottom:"14%", left:"6%",  border:"1px solid rgba(212,255,58,0.13)", animationDuration:"20s", animationDelay:"-6s" }} />
        <div className="bubble-c absolute w-6  h-6  rounded-full" style={{ bottom:"34%", left:"24%", border:"1px solid rgba(212,255,58,0.17)", animationDuration:"17s", animationDelay:"-11s" }} />
        <div className="bubble-a absolute w-16 h-16 rounded-full" style={{ bottom:"4%",  left:"1%",  border:"1px solid rgba(212,255,58,0.07)", animationDuration:"26s", animationDelay:"-8s" }} />
        <div className="bubble-b absolute w-4  h-4  rounded-full" style={{ bottom:"46%", left:"10%", border:"1px solid rgba(14,158,181,0.18)", animationDuration:"15s", animationDelay:"-13s" }} />
        <div className="bubble-c absolute w-8  h-8  rounded-full" style={{ bottom:"22%", left:"40%", border:"1px solid rgba(14,158,181,0.12)", animationDuration:"22s", animationDelay:"-1s" }} />
      </div>

      {/* Cinematic vignette — heavy dark frame */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 88% 74% at 50% 42%, transparent 30%, rgba(0,0,0,0.68) 100%)" }}
        aria-hidden="true"
      />
      {/* Lateral edge bars */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.34) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.34) 100%)" }}
        aria-hidden="true"
      />
      {/* Top fade — grounds the nav */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 100%)" }}
        aria-hidden="true"
      />


<div className="relative z-10 max-w-300 mx-auto px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[52%_48%] gap-12 lg:gap-16 items-start">

          {/* ── Left: copy ── */}
          <div className="flex flex-col">
            <h1
              className="font-bold tracking-[-0.04em] leading-[1.08]"
              style={{ fontSize: "clamp(40px, 4.6vw, 58px)", color: "#ffffff" }}
            >
              {/* Line 1 — word-by-word clip-path reveal */}
              {["We", "build", "the", "systems"].map((word, i) => (
                <Fragment key={word}>
                  <span className="word-reveal-wrap">
                    <span className="word-reveal" style={{ animationDelay: `${i * 0.09}s` }}>
                      {word}
                    </span>
                  </span>
                  {i < 3 && " "}
                </Fragment>
              ))}
              <br />
              {/* Line 2 — scramble decode in chartreuse */}
              <ScrambleText
                text="your customers depend on."
                delay={420}
                lockInterval={55}
                style={{ color: "#D4FF3A" }}
              />
            </h1>

            <p
              className="mt-7 text-[16px] leading-[1.7]"
              style={{ color: "rgba(255,255,255,0.85)", maxWidth: "44ch" }}
            >
              Embedded senior engineers, not contractors. We design, build, and ship the software your business runs on.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-10">
              <LiquidButton
                href="/contact"
                size="xl"
                className="bg-[#e1ff51] text-black! rounded-full font-semibold text-[14px] tracking-wide"
              >
                Book a free consultation
              </LiquidButton>
              <SecondaryBtn href="/case-studies">See our work</SecondaryBtn>
            </div>

          </div>

          {/* ── Right: deployment dashboard ── */}
          <div className="relative mt-8 lg:mt-19">

            {/* Bloom behind dashboard */}
            <div
              className="pointer-events-none absolute -inset-10 -z-10 blur-3xl"
              style={{ background: "radial-gradient(ellipse 75% 60% at 50% 45%, rgba(180,204,65,0.07) 0%, transparent 70%)" }}
              aria-hidden="true"
            />

            {/* Chartreuse top-edge glow */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px z-10"
              style={{ background: "linear-gradient(90deg, transparent, rgba(225,255,81,0.45) 50%, transparent)" }}
              aria-hidden="true"
            />

            <div
              className="card-reveal relative overflow-hidden"
              style={{
                animationDelay: "0.30s",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(0,20,26,0.45)",
              }}
            >

              {/* ── Header row ── */}
              <div
                className="flex items-center justify-between px-6 py-3.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
                    deploy
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
                  <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
                    eu-central-1
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="live-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#D4FF3A" }} />
                  <span className="text-[10.5px] font-bold tracking-widest" style={{ color: "#D4FF3A" }}>LIVE</span>
                  <span className="font-mono text-[9.5px] ml-1.5" style={{ color: "rgba(255,255,255,0.20)" }}>14:38 UTC</span>
                </div>
              </div>

              {/* ── Project + pipeline ── */}
              <div
                className="px-6 pt-5 pb-5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-baseline justify-between mb-5">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-[17px] font-bold tracking-tight text-white">payments-api</span>
                    <span className="text-[12px] font-mono" style={{ color: "rgba(255,255,255,0.28)" }}>v2.4.1</span>
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.20)" }}>main@3fa2c1d</span>
                </div>

                {/* Pipeline node track */}
                <div className="relative flex items-start justify-between">
                  <div
                    className="absolute"
                    style={{
                      top: 5, left: 5, right: 5, height: 1,
                      background: "linear-gradient(90deg, rgba(212,255,58,0.22), rgba(212,255,58,0.55) 75%, rgba(212,255,58,0.9) 100%)",
                    }}
                  />
                  {PIPELINE_NODES.map(({ name, active }) => (
                    <div key={name} className="relative flex flex-col items-center gap-1.5 z-10">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: active ? "#D4FF3A" : "rgba(212,255,58,0.38)",
                          boxShadow: active ? "0 0 10px rgba(212,255,58,0.65), 0 0 4px rgba(212,255,58,0.4)" : "none",
                        }}
                      />
                      <span
                        className="text-[9px] font-mono"
                        style={{ color: active ? "rgba(212,255,58,0.85)" : "rgba(255,255,255,0.22)" }}
                      >
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Log + metrics ── */}
              <div className="grid grid-cols-[1fr_auto]">

                {/* Deploy log */}
                <div className="p-6" style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}>
                  <pre
                    className="font-mono text-[10.5px] leading-[1.75] overflow-hidden"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {LOG_LINES.map((line, i) => (
                      <span key={i} className="log-line" style={{ animationDelay: `${0.50 + i * 0.10}s` }}>
                        {line}{"\n"}
                      </span>
                    ))}
                    <span className="deploy-cursor" style={{ color: "#D4FF3A" }}>|</span>
                  </pre>
                </div>

                {/* Metrics — each in its own hairline row */}
                <div className="flex flex-col divide-y divide-white/[0.07]" style={{ minWidth: 104 }}>
                  {METRICS.map(({ val, sub }) => (
                    <div key={sub} className="flex flex-col justify-center flex-1 px-4 py-3">
                      <p className="text-[14px] font-bold text-white leading-none tabular-nums">{val}</p>
                      <p className="mt-1 text-[9px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.30)" }}>{sub}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            <p
              className="anim-fade-up mt-3 text-[11px] italic"
              style={{ color: "rgba(255,255,255,0.28)", animationDelay: "0.80s" }}
            >
              Sample of client work — anonymized for confidentiality.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
