import { Eyebrow } from "./ui";
import SpiderLines from "./SpiderLines";

const PRINCIPLES = [
  "Ship to production, not demos.",
  "Tell clients the truth, even if it costs the deal.",
  "Write code the next team won't hate inheriting.",
];

export default function AboutHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "transparent", paddingTop: "110px", paddingBottom: "96px" }}
    >

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
            <Eyebrow>About us</Eyebrow>

            <h1 className="mt-4.5 text-[36px] lg:text-[48px] font-extrabold tracking-tight leading-[1.08] text-white max-w-145">
              We&apos;re the team<br />you wished was in-house.
            </h1>

            <div className="flex flex-col gap-3.5 mt-6 mb-6">
              <span className="text-[20px] font-semibold tracking-[-0.005em]" style={{ color: "#e1ff51" }}>
                Production systems. Senior engineers. One accountable team.
              </span>
              <div className="w-22.5 h-px bg-white/10" aria-hidden="true" />
            </div>

            <p className="text-[14.5px] leading-[1.7] text-white/60 mb-4 max-w-130">
              InfinytTech is a software engineering firm built by senior
              engineers and product designers who have shipped production
              systems across teams of every size. We embed with product teams as
              the senior engineers and designers needed to ship the hardest
              parts of the roadmap.
            </p>
            <p className="text-[14.5px] leading-[1.7] text-white/60 mb-8 max-w-130">
              We don&apos;t outsource, and we don&apos;t subcontract. The senior
              engineer who scopes your project is the one writing code on day
              one. From discovery to launch, one accountable team owns the work
              and works in your timezone.
            </p>

            {/* Principles — open hairline panels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-t border-white/[0.07] mb-8">
              {PRINCIPLES.map((principle, index) => (
                <div
                  key={principle}
                  className={[
                    "group relative flex flex-col py-5 pr-5 border-b border-white/[0.07] transition-colors duration-300",
                    index < 2 ? "sm:border-r sm:border-white/[0.07]" : "",
                  ].join(" ")}
                >
                  {/* Chartreuse left accent bar */}
                  <span
                    className="absolute left-0 inset-y-0 w-0.5 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out rounded-full"
                    style={{ background: "#e1ff51" }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] tracking-[0.14em] text-white/20 group-hover:text-[#e1ff51] transition-colors duration-300 mb-3 select-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[12.5px] font-medium leading-[1.6] text-white/55 pl-3">
                    {principle}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-[14.5px] leading-[1.7] text-white/60 max-w-130">
              These aren&apos;t slogans &mdash; they&apos;re what we hire for
              and how we work.
            </p>
          </div>

          {/* Right: agency profile panel */}
          <div className="relative mt-8 lg:mt-0">

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
              className="card-reveal relative overflow-hidden"
              style={{
                animationDelay: "0.30s",
                border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(0,20,26,0.45)",
              }}
            >
              {/* Header row */}
              <div
                className="flex items-center justify-between px-6 py-3.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono tracking-[0.18em] uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
                    infinyttech
                  </span>
                  <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
                  <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
                    engineering team
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="live-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#D4FF3A" }} />
                  <span className="text-[10.5px] font-bold tracking-widest" style={{ color: "#D4FF3A" }}>AVAILABLE</span>
                </div>
              </div>

              {/* Process track */}
              <div
                className="px-6 pt-5 pb-5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-baseline justify-between mb-5">
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-[17px] font-bold tracking-tight text-white">how we work</span>
                  </div>
                  <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.20)" }}>est. 2022</span>
                </div>

                {/* Pipeline-style process nodes */}
                <div className="relative flex items-start justify-between">
                  <div
                    className="absolute"
                    style={{
                      top: 5, left: 5, right: 5, height: 1,
                      background: "linear-gradient(90deg, rgba(212,255,58,0.4), rgba(212,255,58,0.7) 60%, rgba(212,255,58,0.95) 100%)",
                    }}
                  />
                  {["discover", "design", "build", "ship", "scale"].map((step, i) => (
                    <div key={step} className="relative flex flex-col items-center gap-1.5 z-10">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: i === 4 ? "#D4FF3A" : "rgba(212,255,58,0.55)",
                          boxShadow: i === 4 ? "0 0 10px rgba(212,255,58,0.65), 0 0 4px rgba(212,255,58,0.4)" : "none",
                        }}
                      />
                      <span
                        className="text-[9px] font-mono"
                        style={{ color: i === 4 ? "rgba(212,255,58,0.85)" : "rgba(255,255,255,0.30)" }}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Log + metrics */}
              <div className="grid grid-cols-[1fr_auto]">

                {/* Activity log */}
                <div className="p-6" style={{ borderRight: "1px solid rgba(255,255,255,0.07)" }}>
                  <pre
                    className="font-mono text-[10.5px] leading-[1.75] overflow-hidden"
                    style={{ color: "rgba(255,255,255,0.55)" }}
                  >
                    {[
                      "[team]  4 senior engineers",
                      "[mode]  embedded, not outsourced",
                      "[stack] full-product capability",
                      "[zone]  EAT / CET / EST",
                      "[ok]    no bait-and-switch",
                      "[ok]    same team, start to ship",
                      "[ok]    honest scoping, always",
                      "[open]  taking new clients →",
                    ].map((line, i) => (
                      <span key={i} className="log-line" style={{ animationDelay: `${0.50 + i * 0.10}s` }}>
                        {line}{"\n"}
                      </span>
                    ))}
                    <span className="deploy-cursor" style={{ color: "#D4FF3A" }}>|</span>
                  </pre>
                </div>

                {/* Metrics */}
                <div className="flex flex-col divide-y divide-white/[0.07]" style={{ minWidth: 108 }}>
                  {[
                    { val: "40+",   sub: "projects shipped" },
                    { val: "100%",  sub: "no subcontracts"  },
                    { val: "3",     sub: "time zones"       },
                  ].map(({ val, sub }) => (
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
              Senior engineers embedded directly in your team.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
