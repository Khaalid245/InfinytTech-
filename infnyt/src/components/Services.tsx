import { Code2, Box, Brain, Layout, ArrowRight } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import Image from "next/image";
import { Eyebrow, Wave } from "./ui";
import SpiderLines from "./SpiderLines";

const SERVICES: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: Code2,
    title: "Software Development",
    body: "Custom backends and platforms for product teams shipping at scale. Built to be the system your engineers wish they inherited.",
  },
  {
    Icon: Layout,
    title: "Product Design",
    body: "Research, workflows, and interface systems for products with real operational complexity.",
  },
  {
    Icon: Brain,
    title: "AI & Automation",
    body: "Production-ready AI workflows and data systems designed around real operational use.",
  },
  {
    Icon: Box,
    title: "Infrastructure & DevOps",
    body: "Deployment infrastructure, observability, and cloud systems built for reliable production software.",
  },
];

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden py-24" style={{ background: "transparent" }}>

      {/* Dark teal overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "rgba(0, 20, 26, 0.88)" }}
        aria-hidden="true"
      />

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
        <div className="bubble-a absolute w-1   h-1   rounded-full" style={{ bottom:"8%",  left:"48%", background:"rgba(212,255,58,0.30)", animationDuration:"13s", animationDelay:"-5s" }} />
        <div className="bubble-b absolute w-10 h-10 rounded-full" style={{ bottom:"14%", left:"6%",  border:"1px solid rgba(212,255,58,0.13)", animationDuration:"20s", animationDelay:"-6s" }} />
        <div className="bubble-c absolute w-6  h-6  rounded-full" style={{ bottom:"34%", left:"24%", border:"1px solid rgba(212,255,58,0.17)", animationDuration:"17s", animationDelay:"-11s" }} />
        <div className="bubble-a absolute w-16 h-16 rounded-full" style={{ bottom:"4%",  left:"1%",  border:"1px solid rgba(212,255,58,0.07)", animationDuration:"26s", animationDelay:"-8s" }} />
        <div className="bubble-b absolute w-4  h-4  rounded-full" style={{ bottom:"46%", left:"10%", border:"1px solid rgba(14,158,181,0.18)", animationDuration:"15s", animationDelay:"-13s" }} />
        <div className="bubble-c absolute w-8  h-8  rounded-full" style={{ bottom:"22%", left:"40%", border:"1px solid rgba(14,158,181,0.12)", animationDuration:"22s", animationDelay:"-1s" }} />
      </div>

      {/* Cinematic vignette */}
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
      {/* Top fade */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 100%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 max-w-300 mx-auto px-8">
        <div className="flex flex-col gap-3.5 max-w-[720px] mb-12">
          <Eyebrow>Our services</Eyebrow>
          <h2 className="text-[36px] lg:text-[40px] font-extrabold tracking-[-0.015em] leading-[1.1] text-white">
            Four core practices.
            <br />
            One accountable team.
          </h2>
          <p className="text-[18px] leading-[1.6] text-gray-500 max-w-[560px]">
            We pick up the part of your roadmap that&apos;s hardest to staff.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-white/[0.07]">
          {SERVICES.map(({ Icon, title, body }, index) => (
            <ServicePanel
              key={title}
              Icon={Icon}
              title={title}
              body={body}
              index={index}
            />
          ))}
        </div>

        <ServicesCTA />
      </div>
      <Wave className="left-6 right-auto" />
    </section>
  );
}

function ServicesCTA() {
  return (
    <div className="group relative border-t border-white/[0.07] p-10 lg:p-14 transition-colors duration-500 ease-out hover:bg-white/1.5">

      {/* Subtle chartreuse bloom on hover */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(225,255,81,0.055) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-[auto_1px_1fr_auto]">

        <div className="flex justify-start">
          <Image
            src="/Logo-symbol.png"
            alt="InfinytTech"
            width={52}
            height={52}
            className="h-13 w-auto"
          />
        </div>

        <div className="hidden h-14 w-px bg-white/[0.07] lg:block" />

        <div>
          <h3 className="text-[24px] font-bold leading-tight tracking-[-0.02em] text-white lg:text-[28px]">
            Ready to Grow Your Business{" "}
            <span style={{ color: "#e1ff51" }}>Digitally?</span>
          </h3>
          <p className="mt-2 text-[14px] text-white/60">
            Let&apos;s build smart solutions that drive real results.
          </p>
        </div>

        <div className="flex items-center justify-start lg:justify-end">
          <a
            href="/contact"
            className="group/cta inline-flex items-center justify-center gap-3 rounded-full px-8 py-3 text-[15px] font-semibold transition-all duration-200 ease-out hover:brightness-110"
            style={{ background: "#e1ff51" }}
          >
            <span style={{ color: "#000000" }}>Let&apos;s Talk</span>
            <ArrowRight
              className="transition-transform duration-200 ease-out group-hover/cta:translate-x-1"
              style={{ color: "#000000" }}
              size={18}
              strokeWidth={2.2}
              aria-hidden="true"
            />
          </a>
        </div>

      </div>
    </div>
  );
}

function ServicePanel({
  Icon,
  title,
  body,
  index,
}: {
  Icon: LucideIcon;
  title: string;
  body: string;
  index: number;
}) {
  const isLeftCol = index % 2 === 0;

  return (
    <a
      href="/contact"
      className={[
        "group relative flex flex-col p-10 lg:p-14 border-b border-white/[0.07] outline-none",
        "transition-colors duration-500 ease-out hover:bg-white/1.5",
        isLeftCol ? "lg:border-r lg:border-white/[0.07]" : "",
      ].join(" ")}
    >
      {/* Subtle chartreuse bloom on hover */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(225,255,81,0.055) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Number + arrow — top row */}
      <div className="relative z-10 flex items-center justify-between mb-12">
        <span className="font-mono text-[11px] tracking-[0.14em] text-white/20 group-hover:text-[#e1ff51] transition-colors duration-300 ease-out select-none">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 ease-out group-hover:-rotate-45"
          style={{
            background: "#00272c",
            color: "rgba(212,255,58,0.70)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5)",
          }}
          aria-hidden="true"
        >
          <ArrowRight size={14} strokeWidth={2} />
        </div>
      </div>

      {/* Icon */}
      <div
        className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-xl mb-8 transition-all duration-300 ease-out group-hover:scale-105"
        style={{
          background: "#00272c",
          color: "#e1ff51",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5)",
        }}
      >
        <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
      </div>

      {/* Title */}
      <h3 className="relative z-10 text-[24px] font-bold tracking-[-0.02em] leading-tight text-white mb-4">
        {title}
      </h3>

      {/* Body */}
      <p className="relative z-10 text-[14px] leading-[1.75] text-white/60">
        {body}
      </p>
    </a>
  );
}
