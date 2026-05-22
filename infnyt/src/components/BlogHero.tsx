import { Eyebrow } from "./ui";
import SpiderLines from "./SpiderLines";

export default function BlogHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16" style={{ background: "transparent" }}>

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
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.1fr] gap-14 items-center">

          {/* Left: copy */}
          <div>
            <Eyebrow>Writing</Eyebrow>
            <h1 className="mt-4.5 text-[36px] lg:text-[48px] font-extrabold tracking-tight leading-[1.08] text-white">
              Thinking out loud<br />on systems and product.
            </h1>
            <p className="mt-5 text-[14.5px] leading-[1.7] text-white/60 max-w-130">
              Notes from the engineering and design side — on shipping software,
              building teams, and the decisions most write-ups skip.
            </p>
            <a
              href="#articles"
              className="mt-8 inline-flex items-center gap-2 text-[14px] font-semibold transition-colors duration-200 hover:opacity-80"
              style={{ color: "#e1ff51" }}
            >
              Browse all articles
              <span aria-hidden="true">↓</span>
            </a>
          </div>

          {/* Right: featured article — open panel */}
          <div className="relative">

            {/* Bloom behind panel */}
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
              className="relative overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(0,20,26,0.45)",
                minHeight: 300,
              }}
            >
              {/* Subtle grid overlay */}
              <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
                aria-hidden="true"
              />

              {/* Featured badge */}
              <div className="absolute top-5 left-5 z-10">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1"
                  style={{
                    border: "1px solid rgba(225,255,81,0.25)",
                    background: "rgba(225,255,81,0.08)",
                    color: "#e1ff51",
                  }}
                >
                  Featured
                </span>
              </div>

              <div className="relative z-10 p-8 pt-16 max-w-[75%]">
                <div className="flex items-center gap-3 text-white/40 text-[11px] font-medium mb-4">
                  <span>Jun 12, 2025</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
                  <span>8 min read</span>
                </div>
                <h2 className="text-[20px] font-bold text-white leading-tight mb-3 tracking-tight">
                  The Future of AI in Production Engineering
                </h2>
                <p className="text-[13px] text-white/55 leading-[1.65] mb-7">
                  How LLMs are changing the way engineers debug, deploy, and design
                  systems — and where they still fall short.
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-[13px] font-semibold transition-opacity duration-200 hover:opacity-80"
                  style={{ color: "#e1ff51" }}
                >
                  Read article
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
