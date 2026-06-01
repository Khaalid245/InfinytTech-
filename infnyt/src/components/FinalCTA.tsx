import { ArrowRight } from "lucide-react";
import SpiderLines from "./SpiderLines";

export default function FinalCTA() {
  return (
    <section id="contact" className="relative overflow-hidden py-32" style={{ background: "transparent" }}>

      {/* Dark teal overlay */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "rgba(0, 20, 26, 0.88)" }} aria-hidden="true" />

      {/* Particle network */}
      <SpiderLines />

      {/* Key light — teal from top-left */}
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

      {/* God rays */}
      <div className="cinema-rays pointer-events-none absolute inset-0 overflow-hidden" style={{ mixBlendMode: "screen" }} aria-hidden="true">
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

      {/* Mid-depth haze */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 88% 28% at 50% 46%, rgba(14,158,181,0.032) 0%, transparent 100%)" }}
        aria-hidden="true"
      />

      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 88% 74% at 50% 42%, transparent 30%, rgba(0,0,0,0.68) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.34) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.34) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 100%)" }} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-300 mx-auto px-8">

        <div className="border-t border-white/[0.07] grid grid-cols-1 lg:grid-cols-[1fr_auto] pt-16 pb-4 gap-14 lg:gap-0">

          {/* Left: copy */}
          <div className="lg:pr-20 lg:border-r lg:border-white/[0.07]">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span
                className="font-mono text-[11px] tracking-[0.14em] uppercase font-semibold"
                style={{ color: "#e1ff51" }}
              >
                Let&rsquo;s talk
              </span>
              <div className="h-px w-8 opacity-40" style={{ background: "#e1ff51" }} />
            </div>

            <h2
              className="font-extrabold leading-[1.08] tracking-tight text-white mb-7"
              style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
            >
              Bring us the part of your
              <br />roadmap that&rsquo;s stuck.
            </h2>

            <p className="text-[16px] text-white/60 leading-[1.8] max-w-130">
              A 30-minute call. We&rsquo;ll tell you whether we&rsquo;re the
              right team &mdash; or who else to call if we&rsquo;re not.
            </p>
          </div>

          {/* Right: CTA */}
          <div className="lg:pl-20 flex flex-col items-start lg:items-center justify-center gap-4">
            <a
              href="/contact"
              className="group/cta inline-flex items-center justify-center gap-3 rounded-full px-8 py-3.5 text-[15px] font-semibold transition-all duration-200 ease-out hover:brightness-110 cta-glow"
              style={{ background: "#e1ff51", color: "#000000" }}
            >
              Book a scoping call
              <ArrowRight
                className="transition-transform duration-200 ease-out group-hover/cta:translate-x-1"
                size={18}
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </a>
            <p className="text-[12px] text-white/30">
              We respond within one business day.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
