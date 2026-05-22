import { type ReactNode } from "react";
import Image from "next/image";
import { Eyebrow } from "./ui";
import SpiderLines from "./SpiderLines";

const TESTIMONIALS = [
  {
    name: "Khalid Sh. Xareed",
    role: "VP Engineering, Northwind",
    quote: (
      <>
        The team moved faster than any vendor we have worked with — and the
        platform they built has scaled through{" "}
        <span className="font-semibold" style={{ color: "#e1ff51" }}>
          three product launches
        </span>
        .
      </>
    ),
  },
  {
    name: "Mohamed Abdifatah",
    role: "Head of Product, Atlas & Co.",
    quote: (
      <>
        The discovery work alone paid for the engagement. They told us the truth
        about what we were trying to build and helped us{" "}
        <span className="font-semibold" style={{ color: "#e1ff51" }}>
          cut the scope by half
        </span>
        .
      </>
    ),
  },
  {
    name: "Khalid Mohamud",
    role: "CTO, Flint.io",
    quote: (
      <>
        Senior engineers, clear communication, no theater. We treat them as{" "}
        <span className="font-semibold" style={{ color: "#e1ff51" }}>
          part of our core team
        </span>{" "}
        and they have earned every bit of that trust.
      </>
    ),
  },
];

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden py-24" style={{ background: "transparent" }}>

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

      {/* Bubble cluster — bottom-left */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-[38%] h-[65%]" aria-hidden="true">
        <div className="bubble-a absolute w-1.5 h-1.5 rounded-full" style={{ bottom:"18%", left:"9%",  background:"rgba(212,255,58,0.38)", animationDuration:"9s" }} />
        <div className="bubble-b absolute w-1   h-1   rounded-full" style={{ bottom:"32%", left:"5%",  background:"rgba(212,255,58,0.45)", animationDuration:"11s", animationDelay:"-4s" }} />
        <div className="bubble-c absolute w-2   h-2   rounded-full" style={{ bottom:"24%", left:"20%", background:"rgba(212,255,58,0.28)", animationDuration:"14s", animationDelay:"-2s" }} />
        <div className="bubble-a absolute w-1   h-1   rounded-full" style={{ bottom:"42%", left:"14%", background:"rgba(212,255,58,0.35)", animationDuration:"10s", animationDelay:"-7s" }} />
        <div className="bubble-b absolute w-2.5 h-2.5 rounded-full" style={{ bottom:"10%", left:"32%", background:"rgba(14,158,181,0.30)", animationDuration:"16s", animationDelay:"-3s" }} />
        <div className="bubble-c absolute w-1.5 h-1.5 rounded-full" style={{ bottom:"52%", left:"28%", background:"rgba(14,158,181,0.25)", animationDuration:"12s", animationDelay:"-9s" }} />
        <div className="bubble-b absolute w-10 h-10 rounded-full" style={{ bottom:"14%", left:"6%",  border:"1px solid rgba(212,255,58,0.13)", animationDuration:"20s", animationDelay:"-6s" }} />
        <div className="bubble-c absolute w-6  h-6  rounded-full" style={{ bottom:"34%", left:"24%", border:"1px solid rgba(212,255,58,0.17)", animationDuration:"17s", animationDelay:"-11s" }} />
        <div className="bubble-a absolute w-16 h-16 rounded-full" style={{ bottom:"4%",  left:"1%",  border:"1px solid rgba(212,255,58,0.07)", animationDuration:"26s", animationDelay:"-8s" }} />
      </div>

      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 88% 74% at 50% 42%, transparent 30%, rgba(0,0,0,0.68) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.34) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.34) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 100%)" }} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-300 mx-auto px-8">

        <div className="flex flex-col gap-3.5 max-w-180 mb-16">
          <Eyebrow>What clients say</Eyebrow>
          <h2 className="text-[36px] lg:text-[40px] font-extrabold tracking-[-0.015em] leading-[1.1] text-white">
            Real teams,{" "}
            <span style={{ color: "#e1ff51" }}>measurable outcomes</span>.
          </h2>
        </div>

        {/* Open hairline grid — 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-white/[0.07]">
          {TESTIMONIALS.map((t, index) => (
            <TestimonialPanel key={t.name} {...t} index={index} />
          ))}
        </div>

        {/* Footer row */}
        <div className="border-t border-white/[0.07] py-7">
          <p className="text-[12px] italic text-white/30">
            Some client names anonymized for confidentiality. Full references available on request.
          </p>
        </div>

      </div>
    </section>
  );
}

function TestimonialPanel({
  name,
  role,
  quote,
  index,
}: {
  name: string;
  role: string;
  quote: ReactNode;
  index: number;
}) {
  const isLastCol = index === 2;

  return (
    <div
      className={[
        "group relative flex flex-col p-10 lg:p-12 border-b border-white/[0.07]",
        "transition-colors duration-500 ease-out hover:bg-white/1.5",
        !isLastCol ? "lg:border-r lg:border-white/[0.07]" : "",
      ].join(" ")}
    >
      {/* Chartreuse bloom on hover */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
        style={{
          background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(225,255,81,0.055) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Step number */}
      <span className="relative z-10 font-mono text-[11px] tracking-[0.14em] text-white/20 group-hover:text-[#e1ff51] transition-colors duration-300 ease-out select-none mb-8">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Large chartreuse quote mark */}
      <span
        className="relative z-10 font-extrabold leading-none select-none pointer-events-none mb-4 -mt-1"
        style={{ fontSize: 72, color: "#e1ff51", opacity: 0.18, fontFamily: "Georgia, serif" }}
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Quote */}
      <blockquote className="relative z-10 text-[15px] leading-[1.8] text-white/75 flex-1 mb-10">
        {quote}
      </blockquote>

      {/* Author — hairline separated */}
      <div className="relative z-10 border-t border-white/[0.07] pt-6 flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full overflow-hidden shrink-0"
          style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.10)" }}
        >
          <Image
            src="/khalid.jpg"
            alt={name}
            width={40}
            height={40}
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-white leading-tight">{name}</div>
          <div className="text-[12px] mt-0.5 text-white/40">{role}</div>
        </div>
      </div>
    </div>
  );
}
