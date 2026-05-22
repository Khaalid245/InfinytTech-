"use client";

import { useEffect, useRef, useState } from "react";
import {
  Building2, GraduationCap, Heart,
  ShoppingBag, Car, BarChart3, ArrowRight,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { Eyebrow } from "./ui";
import SpiderLines from "./SpiderLines";

interface Industry {
  Icon:  LucideIcon;
  title: string;
  sub:   string;
  desc:  string;
}

const INDUSTRIES: Industry[] = [
  {
    Icon: GraduationCap,
    title: "Education", sub: "EdTech & learning platforms",
    desc: "Adaptive learning engines, LMS integrations, and live-video infrastructure built to serve millions of concurrent learners without compromise.",
  },
  {
    Icon: Heart,
    title: "Healthcare", sub: "HIPAA · EHR · Telehealth",
    desc: "Compliance-first patient platforms, EHR system integrations, and telehealth infrastructure with zero tolerance for downtime or data exposure.",
  },
  {
    Icon: ShoppingBag,
    title: "Retail", sub: "DTC · Commerce · POS",
    desc: "Headless commerce stacks, real-time inventory synchronisation, and omnichannel checkout flows engineered to convert at any traffic spike.",
  },
  {
    Icon: Car,
    title: "Logistics", sub: "Fleet & supply chain",
    desc: "Real-time tracking systems, route-optimisation engines, and warehouse management platforms built for high-throughput, time-critical operations.",
  },
  {
    Icon: BarChart3,
    title: "SaaS", sub: "B2B platforms & APIs",
    desc: "Multi-tenant architectures, developer toolchains, and API-first platforms engineered to scale cleanly from first customer to Fortune 500.",
  },
  {
    Icon: Building2,
    title: "Real Estate", sub: "PropTech & property mgmt",
    desc: "MLS integrations, property-management dashboards, and transaction platforms built for the modern, data-driven real estate operation.",
  },
];

const ICON_SHADOW = "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5)";

export default function Industries() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [revealed,    setRevealed]    = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setRevealed(true); io.disconnect(); } },
      { threshold: 0.10 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (!row) return;
    const panels = Array.from(row.children) as HTMLElement[];
    let closest = 0, minDist = Infinity;
    panels.forEach((panel, i) => {
      const rect = panel.getBoundingClientRect();
      const dist = Math.abs(e.clientX - (rect.left + rect.width / 2));
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    setActiveIndex(closest);
  };

  return (
    <section
      id="industries"
      className="relative py-28 overflow-hidden"
      style={{ background: "transparent" }}
    >
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "rgba(0, 20, 26, 0.88)" }} aria-hidden="true" />
      <SpiderLines />
      <div className="cinema-key pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 72% 62% at 14% -5%, rgba(14,158,181,0.24) 0%, rgba(14,158,181,0.06) 45%, transparent 72%)", filter: "blur(8px)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 55% at 96% 110%, rgba(180,204,65,0.15) 0%, rgba(180,204,65,0.04) 48%, transparent 72%)", filter: "blur(14px)" }} aria-hidden="true" />
      <div className="cinema-rays pointer-events-none absolute inset-0 overflow-hidden" style={{ mixBlendMode: "screen" }} aria-hidden="true">
        <div style={{ position:"absolute", top:"-40%", left:"5%",  width:280, height:"170%", background:"linear-gradient(180deg,rgba(180,204,65,0.9) 0%,rgba(180,204,65,0.20) 52%,transparent 100%)", transform:"rotate(-28deg)", transformOrigin:"top center", filter:"blur(34px)", opacity:0.038 }} />
        <div style={{ position:"absolute", top:"-40%", left:"19%", width:95,  height:"170%", background:"linear-gradient(180deg,rgba(180,204,65,0.8) 0%,rgba(180,204,65,0.14) 58%,transparent 100%)", transform:"rotate(-28deg)", transformOrigin:"top center", filter:"blur(22px)", opacity:0.026 }} />
        <div style={{ position:"absolute", top:"-40%", left:"33%", width:160, height:"170%", background:"linear-gradient(180deg,rgba(14,158,181,0.8)  0%,rgba(14,158,181,0.10)  62%,transparent 100%)", transform:"rotate(-22deg)", transformOrigin:"top center", filter:"blur(30px)", opacity:0.028 }} />
      </div>
      <div className="hero-gradient-drift pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute -top-40 -left-40 w-160 h-160" style={{ background: "radial-gradient(circle, rgba(180,204,65,0.09) 0%, transparent 62%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-120 w-[65%]" style={{ background: "radial-gradient(ellipse 80% 90% at 90% 100%, rgba(180,204,65,0.07) 0%, rgba(14,158,181,0.04) 45%, transparent 70%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 88% 28% at 50% 46%, rgba(14,158,181,0.032) 0%, transparent 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[38%] h-[65%]" aria-hidden="true">
        <div className="bubble-a absolute w-1.5 h-1.5 rounded-full" style={{ bottom:"18%", left:"9%",  background:"rgba(212,255,58,0.38)", animationDuration:"9s" }} />
        <div className="bubble-b absolute w-1   h-1   rounded-full" style={{ bottom:"32%", left:"5%",  background:"rgba(212,255,58,0.45)", animationDuration:"11s", animationDelay:"-4s" }} />
        <div className="bubble-c absolute w-2   h-2   rounded-full" style={{ bottom:"24%", left:"20%", background:"rgba(212,255,58,0.28)", animationDuration:"14s", animationDelay:"-2s" }} />
        <div className="bubble-b absolute w-10 h-10 rounded-full" style={{ bottom:"14%", left:"6%",  border:"1px solid rgba(212,255,58,0.13)", animationDuration:"20s", animationDelay:"-6s" }} />
        <div className="bubble-c absolute w-6  h-6  rounded-full" style={{ bottom:"34%", left:"24%", border:"1px solid rgba(212,255,58,0.17)", animationDuration:"17s", animationDelay:"-11s" }} />
      </div>
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 88% 74% at 50% 42%, transparent 30%, rgba(0,0,0,0.68) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.34) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.34) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 100%)" }} aria-hidden="true" />

      <div className="relative z-10 max-w-300 mx-auto px-8">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-16">
          <Eyebrow>Industries we serve</Eyebrow>
          <h2
            className="font-extrabold tracking-[-0.02em] leading-[1.08] text-white"
            style={{ fontSize: "clamp(32px, 3.6vw, 46px)" }}
          >
            Where downtime
            <br />
            isn&apos;t an option.
          </h2>
        </div>

        {/* ── Desktop: horizontal expand fan ── */}
        <div className="hidden lg:block border-t border-b border-white/[0.07]">
          <div
            ref={rowRef}
            className="flex items-stretch"
            style={{ height: 360 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {INDUSTRIES.map((ind, i) => {
              const isActive  = activeIndex === i;
              const hasActive = activeIndex !== null;
              const flexGrow  = isActive ? 3.2 : hasActive ? 0.55 : 1;
              const isLast    = i === INDUSTRIES.length - 1;

              return (
                <div
                  key={ind.title}
                  className="relative overflow-hidden"
                  style={{
                    flex:       `${flexGrow} 1 0`,
                    minWidth:   0,
                    borderRight: isLast ? "none" : "1px solid rgba(255,255,255,0.07)",
                    background:  isActive ? "rgba(225,255,81,0.028)" : "transparent",
                    opacity:    revealed ? 1 : 0,
                    transform:  revealed ? "none" : "translateY(20px)",
                    transition: [
                      `opacity 0.55s ease ${i * 60}ms`,
                      `transform 0.55s ease ${i * 60}ms`,
                      "flex 0.50s cubic-bezier(0.33,1,0.68,1)",
                      "background 0.40s ease",
                    ].join(", "),
                  }}
                >
                  {/* Chartreuse top-edge glow — active only */}
                  <div
                    className="absolute inset-x-0 top-0 h-px pointer-events-none"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(225,255,81,0.55) 50%, transparent)",
                      opacity: isActive ? 1 : 0,
                      transition: "opacity 0.30s ease",
                    }}
                    aria-hidden="true"
                  />

                  {/* Chartreuse bloom — active */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(225,255,81,0.06) 0%, transparent 70%)",
                      opacity: isActive ? 1 : 0,
                      transition: "opacity 0.35s ease",
                    }}
                    aria-hidden="true"
                  />

                  {/* ── Collapsed state ── */}
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-between py-8 pointer-events-none select-none"
                    style={{ opacity: isActive ? 0 : 1, transition: "opacity 0.18s ease" }}
                  >
                    {/* Step number */}
                    <span
                      className="font-mono text-[10px] tracking-[0.14em]"
                      style={{ color: "rgba(255,255,255,0.18)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Icon box */}
                    <div
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                        background: "#00272c", boxShadow: ICON_SHADOW, color: "#e1ff51",
                      }}
                    >
                      <ind.Icon size={18} strokeWidth={1.5} />
                    </div>

                    {/* Vertical title */}
                    <span
                      style={{
                        writingMode: "vertical-rl",
                        transform: "rotate(180deg)",
                        color: "rgba(255,255,255,0.22)",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      {ind.title}
                    </span>
                  </div>

                  {/* ── Expanded state ── */}
                  <div
                    className="absolute inset-0 flex flex-col p-8"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transition: "opacity 0.24s ease",
                      transitionDelay: isActive ? "0.14s" : "0s",
                    }}
                  >
                    {/* Number + arrow */}
                    <div className="flex items-center justify-between mb-8 shrink-0">
                      <span
                        className="font-mono text-[11px] tracking-[0.14em] select-none"
                        style={{ color: "#e1ff51" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center -rotate-45"
                        style={{ background: "#00272c", color: "rgba(212,255,58,0.70)", boxShadow: ICON_SHADOW }}
                      >
                        <ArrowRight size={13} strokeWidth={2} />
                      </div>
                    </div>

                    {/* Icon box */}
                    <div
                      className="mb-7 shrink-0"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: 48, height: 48, borderRadius: 12,
                        background: "#00272c", boxShadow: ICON_SHADOW, color: "#e1ff51",
                      }}
                    >
                      <ind.Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                    </div>

                    {/* Title */}
                    <h3 className="text-[20px] font-bold text-white tracking-tight leading-snug shrink-0 mb-1">
                      {ind.title}
                    </h3>

                    {/* Sub */}
                    <p
                      className="text-[10px] font-semibold uppercase tracking-widest shrink-0 mb-5"
                      style={{ color: "rgba(225,255,81,0.60)" }}
                    >
                      {ind.sub}
                    </p>

                    {/* Hairline */}
                    <div className="shrink-0 border-t border-white/[0.07] mb-5" />

                    {/* Description */}
                    <div className="relative flex-1 overflow-hidden">
                      <p className="text-[13px] leading-[1.75] text-white/55">
                        {ind.desc}
                      </p>
                      <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
                        style={{ background: "linear-gradient(to bottom, transparent, rgba(4,14,20,0.95))" }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile: open hairline rows ── */}
        <div className="lg:hidden border-t border-white/[0.07] divide-y divide-white/[0.07]">
          {INDUSTRIES.map((ind, i) => (
            <div key={ind.title} className="flex items-start gap-6 py-8">

              {/* Step number */}
              <span
                className="font-mono text-[11px] tracking-[0.14em] pt-0.5 shrink-0 w-6"
                style={{ color: "rgba(255,255,255,0.20)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Icon box */}
              <div
                className="shrink-0"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 44, height: 44, borderRadius: 11,
                  background: "#00272c", boxShadow: ICON_SHADOW, color: "#e1ff51",
                }}
              >
                <ind.Icon size={20} strokeWidth={1.6} aria-hidden="true" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest mb-1"
                  style={{ color: "rgba(225,255,81,0.60)" }}
                >
                  {ind.sub}
                </p>
                <h3 className="text-[17px] font-bold text-white tracking-tight mb-3">
                  {ind.title}
                </h3>
                <p className="text-[13px] leading-[1.75] text-white/55">
                  {ind.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
