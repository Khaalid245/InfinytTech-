import type { Metadata } from "next";
import {
  Heart, Brain, Truck, BarChart3, Building2,
  ShoppingBag, CreditCard, LineChart, ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow } from "@/components/ui";
import SpiderLines from "@/components/SpiderLines";

export const metadata: Metadata = {
  title: "Case Studies — InfinytTech",
  description:
    "Eight production systems across healthcare, education, logistics, SaaS, fintech, and more. Built by senior engineers, shipped to spec.",
};

const PROJECTS: { tag: string; Icon: LucideIcon; title: string; body: string; metric: string }[] = [
  {
    tag: "Healthcare",
    Icon: Heart,
    title: "MediCare Plus",
    body: "Hospital management system deployed across 8 facilities. Unified patient records, scheduling, and billing into a single platform — cutting intake time by 40% and eliminating cross-department data gaps.",
    metric: "40% faster intake",
  },
  {
    tag: "Education",
    Icon: Brain,
    title: "EduSmart Platform",
    body: "LMS for 200+ instructors and 15,000 students. Live classes, adaptive assignments, and per-student analytics in one production-stable platform.",
    metric: "15,000+ active users",
  },
  {
    tag: "Logistics",
    Icon: Truck,
    title: "Translogix",
    body: "Fleet and route optimization for a national delivery operator running 1,200 vehicles. Replaced spreadsheet dispatch with real-time routing — cutting average dispatch time by 35%.",
    metric: "35% faster dispatch",
  },
  {
    tag: "SaaS",
    Icon: BarChart3,
    title: "ScaleDesk",
    body: "Customer support platform for a fast-growing B2B SaaS team. AI-powered ticket routing and smart assignment rules cut average resolution time by 55% in the first 60 days.",
    metric: "55% faster resolution",
  },
  {
    tag: "Real Estate",
    Icon: Building2,
    title: "PropertyHub",
    body: "End-to-end property management platform across 400 properties. Listings, tenant portal, maintenance requests, and owner reporting — all unified.",
    metric: "400 properties managed",
  },
  {
    tag: "Retail",
    Icon: ShoppingBag,
    title: "ShopSphere",
    body: "E-commerce rebuild for a multi-brand retailer. New checkout architecture and frontend performance work doubled conversion rate post-launch.",
    metric: "2× conversion rate",
  },
  {
    tag: "Fintech",
    Icon: CreditCard,
    title: "PayFlow",
    body: "Payment and reconciliation infrastructure processing 50,000+ monthly transactions. Intelligent retry logic and multi-provider fallback reduced failed payment rate by 62%.",
    metric: "62% fewer failures",
  },
  {
    tag: "Analytics",
    Icon: LineChart,
    title: "Vantage",
    body: "Real-time BI platform for a multi-channel retail group. Unified six fragmented data sources into one operational dashboard used daily by 300+ team members.",
    metric: "6 sources → 1 view",
  },
];

const ICON_BOX = "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5)";

function Bloom() {
  return (
    <span
      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
      style={{ background: "radial-gradient(ellipse 70% 45% at 50% 0%, rgba(225,255,81,0.055) 0%, transparent 70%)" }}
      aria-hidden="true"
    />
  );
}

function ArrowBtn() {
  return (
    <div
      className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-transform duration-300 ease-out group-hover:-rotate-45"
      style={{ background: "#00272c", color: "rgba(212,255,58,0.70)", boxShadow: ICON_BOX }}
      aria-hidden="true"
    >
      <ArrowRight size={14} strokeWidth={2} />
    </div>
  );
}

export default function CaseStudiesPage() {
  return (
    <main className="relative overflow-hidden" style={{ background: "transparent" }}>

      {/* Dark teal overlay */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "rgba(0, 20, 26, 0.88)" }} aria-hidden="true" />

      {/* Particle network */}
      <SpiderLines />

      {/* Key light */}
      <div className="cinema-key pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 72% 62% at 14% -5%, rgba(14,158,181,0.24) 0%, rgba(14,158,181,0.06) 45%, transparent 72%)", filter: "blur(8px)" }} aria-hidden="true" />

      {/* Fill light */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 55% at 96% 110%, rgba(180,204,65,0.15) 0%, rgba(180,204,65,0.04) 48%, transparent 72%)", filter: "blur(14px)" }} aria-hidden="true" />

      {/* God rays */}
      <div className="cinema-rays pointer-events-none absolute inset-0 overflow-hidden" style={{ mixBlendMode: "screen" }} aria-hidden="true">
        <div style={{ position:"absolute", top:"-40%", left:"5%",  width:280, height:"170%", background:"linear-gradient(180deg,rgba(180,204,65,0.9) 0%,rgba(180,204,65,0.20) 52%,transparent 100%)", transform:"rotate(-28deg)", transformOrigin:"top center", filter:"blur(34px)", opacity:0.038 }} />
        <div style={{ position:"absolute", top:"-40%", left:"19%", width:95,  height:"170%", background:"linear-gradient(180deg,rgba(180,204,65,0.8) 0%,rgba(180,204,65,0.14) 58%,transparent 100%)", transform:"rotate(-28deg)", transformOrigin:"top center", filter:"blur(22px)", opacity:0.026 }} />
        <div style={{ position:"absolute", top:"-40%", left:"33%", width:160, height:"170%", background:"linear-gradient(180deg,rgba(14,158,181,0.8)  0%,rgba(14,158,181,0.10)  62%,transparent 100%)", transform:"rotate(-22deg)", transformOrigin:"top center", filter:"blur(30px)", opacity:0.028 }} />
      </div>

      {/* Drifting ambient */}
      <div className="hero-gradient-drift pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Ambient — upper-left chartreuse */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-160 h-160" style={{ background: "radial-gradient(circle, rgba(180,204,65,0.09) 0%, transparent 62%)" }} aria-hidden="true" />

      {/* Ambient — lower-right */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-120 w-[65%]" style={{ background: "radial-gradient(ellipse 80% 90% at 90% 100%, rgba(180,204,65,0.07) 0%, rgba(14,158,181,0.04) 45%, transparent 70%)" }} aria-hidden="true" />

      {/* Mid-depth haze */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 88% 28% at 50% 46%, rgba(14,158,181,0.032) 0%, transparent 100%)" }} aria-hidden="true" />

      {/* Bubble cluster */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-[38%] h-[65%]" aria-hidden="true">
        <div className="bubble-a absolute w-1.5 h-1.5 rounded-full" style={{ bottom:"18%", left:"9%",  background:"rgba(212,255,58,0.38)", animationDuration:"9s" }} />
        <div className="bubble-b absolute w-1   h-1   rounded-full" style={{ bottom:"32%", left:"5%",  background:"rgba(212,255,58,0.45)", animationDuration:"11s", animationDelay:"-4s" }} />
        <div className="bubble-c absolute w-2   h-2   rounded-full" style={{ bottom:"24%", left:"20%", background:"rgba(212,255,58,0.28)", animationDuration:"14s", animationDelay:"-2s" }} />
        <div className="bubble-b absolute w-10 h-10 rounded-full" style={{ bottom:"14%", left:"6%",  border:"1px solid rgba(212,255,58,0.13)", animationDuration:"20s", animationDelay:"-6s" }} />
        <div className="bubble-c absolute w-6  h-6  rounded-full" style={{ bottom:"34%", left:"24%", border:"1px solid rgba(212,255,58,0.17)", animationDuration:"17s", animationDelay:"-11s" }} />
        <div className="bubble-a absolute w-16 h-16 rounded-full" style={{ bottom:"4%",  left:"1%",  border:"1px solid rgba(212,255,58,0.07)", animationDuration:"26s", animationDelay:"-8s" }} />
      </div>

      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 88% 74% at 50% 42%, transparent 30%, rgba(0,0,0,0.68) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.34) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.34) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 100%)" }} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-300 mx-auto px-8 pt-20 pb-24">

        {/* Page header */}
        <div className="flex flex-col gap-3.5 mb-16">
          <Eyebrow>Our work</Eyebrow>
          <h1 className="text-[36px] lg:text-[48px] font-extrabold tracking-tight leading-[1.08] text-white">
            Production systems.<br />
            <span style={{ color: "#e1ff51" }}>Real outcomes.</span>
          </h1>
          <p className="text-[18px] leading-[1.6] text-white/60 max-w-160">
            Eight engagements across healthcare, education, logistics, SaaS,
            fintech, and more. Scoped by senior engineers, built to production
            standards, handed off clean.
          </p>
        </div>

        {/*
          Bento hairline grid — 8 panels
          ┌──────────────┬────────────────────────────┐
          │  [0] Feature │  [1] Wide                  │
          │  (row-span-2)├────────────────────────────┤
          │              │  [2] Wide                  │
          ├──────┬───────┴──────────┬─────────────────┤
          │ [3]  │      [4]         │       [5]        │
          ├──────┴───────┬──────────┴─────────────────┤
          │  [6] Wide (col-span-2) │       [7]         │
          └────────────────────────┴──────────────────┘
        */}
        <div className="grid grid-cols-1 lg:grid-cols-3 border-t border-white/[0.07]">

          <FeaturedPanel   {...PROJECTS[0]} />
          <WidePanel       {...PROJECTS[1]} index={1} />
          <WidePanel       {...PROJECTS[2]} index={2} />
          <StandardPanel   {...PROJECTS[3]} index={3} />
          <StandardPanel   {...PROJECTS[4]} index={4} />
          <StandardPanel   {...PROJECTS[5]} index={5} isLast />
          <WidePanel       {...PROJECTS[6]} index={6} rightBorder />
          <StandardPanel   {...PROJECTS[7]} index={7} isLast />

        </div>

        {/* Footer row */}
        <div className="border-t border-white/[0.07] py-8">
          <p className="text-[12px] italic text-white/30">
            All work shown with client permission. Some project names anonymised for confidentiality.
          </p>
        </div>

      </div>
    </main>
  );
}

/* ─── Featured panel ────────────────────────────────────────────────────── */
function FeaturedPanel({ tag, Icon, title, body, metric }: { tag: string; Icon: LucideIcon; title: string; body: string; metric: string }) {
  return (
    <article className="group relative flex flex-col p-10 lg:p-14 border-b border-white/[0.07] lg:row-span-2 lg:border-r lg:border-white/[0.07] transition-colors duration-500 ease-out hover:bg-white/1.5 cursor-pointer">
      <Bloom />
      <div className="relative z-10 flex items-center justify-between mb-14">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.14em] text-white/20 group-hover:text-[#e1ff51] transition-colors duration-300 select-none">01</span>
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: "#e1ff51" }}>{tag}</span>
        </div>
        <ArrowBtn />
      </div>
      <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl mb-10 transition-all duration-300 ease-out group-hover:scale-105" style={{ background: "#00272c", color: "#e1ff51", boxShadow: ICON_BOX }}>
        <Icon size={30} strokeWidth={1.7} aria-hidden="true" />
      </div>
      <h2 className="relative z-10 text-[26px] font-bold tracking-tight leading-tight text-white mb-4">{title}</h2>
      <p className="relative z-10 text-[14px] leading-[1.8] text-white/60 flex-1">{body}</p>
      <div className="relative z-10 mt-10 pt-7 border-t border-white/[0.07]">
        <p className="font-extrabold tracking-tight leading-none" style={{ fontSize: "clamp(28px, 3vw, 40px)", color: "#e1ff51" }}>{metric}</p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/30">Key outcome</p>
      </div>
    </article>
  );
}

/* ─── Wide panel ────────────────────────────────────────────────────────── */
function WidePanel({ tag, Icon, title, body, metric, index, rightBorder }: { tag: string; Icon: LucideIcon; title: string; body: string; metric: string; index: number; rightBorder?: boolean }) {
  return (
    <article className={["group relative flex flex-col p-10 lg:p-14 border-b border-white/[0.07] lg:col-span-2 transition-colors duration-500 ease-out hover:bg-white/1.5 cursor-pointer", rightBorder ? "lg:border-r lg:border-white/[0.07]" : ""].join(" ")}>
      <Bloom />
      <div className="relative z-10 flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.14em] text-white/20 group-hover:text-[#e1ff51] transition-colors duration-300 select-none">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: "#e1ff51" }}>{tag}</span>
        </div>
        <ArrowBtn />
      </div>
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-12">
        <div className="flex items-start gap-6 flex-1">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-out group-hover:scale-105" style={{ background: "#00272c", color: "#e1ff51", boxShadow: ICON_BOX }}>
            <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-[22px] font-bold tracking-tight leading-tight text-white mb-3">{title}</h2>
            <p className="text-[14px] leading-[1.75] text-white/60">{body}</p>
          </div>
        </div>
        <div className="shrink-0 lg:border-l lg:border-white/[0.07] lg:pl-12 pt-6 lg:pt-0 border-t border-white/[0.07] lg:border-t-0">
          <p className="font-extrabold tracking-tight leading-none whitespace-nowrap" style={{ fontSize: "clamp(22px, 2vw, 32px)", color: "#e1ff51" }}>{metric}</p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/30">Key outcome</p>
        </div>
      </div>
    </article>
  );
}

/* ─── Standard panel ────────────────────────────────────────────────────── */
function StandardPanel({ tag, Icon, title, body, metric, index, isLast }: { tag: string; Icon: LucideIcon; title: string; body: string; metric: string; index: number; isLast?: boolean }) {
  return (
    <article className={["group relative flex flex-col p-10 lg:p-12 border-b border-white/[0.07] transition-colors duration-500 ease-out hover:bg-white/1.5 cursor-pointer", !isLast ? "lg:border-r lg:border-white/[0.07]" : ""].join(" ")}>
      <Bloom />
      <div className="relative z-10 flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.14em] text-white/20 group-hover:text-[#e1ff51] transition-colors duration-300 select-none">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-[11px] font-semibold tracking-[0.08em] uppercase" style={{ color: "#e1ff51" }}>{tag}</span>
        </div>
        <ArrowBtn />
      </div>
      <div className="relative z-10 mb-8">
        <p className="font-extrabold tracking-tight leading-none" style={{ fontSize: "clamp(26px, 2.2vw, 36px)", color: "#e1ff51" }}>{metric}</p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/30">Key outcome</p>
      </div>
      <div className="relative z-10 border-t border-white/[0.07] mb-8" />
      <div className="relative z-10 flex items-start gap-5 flex-1">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-out group-hover:scale-105" style={{ background: "#00272c", color: "#e1ff51", boxShadow: ICON_BOX }}>
          <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-[18px] font-bold tracking-tight leading-tight text-white mb-2">{title}</h2>
          <p className="text-[13px] leading-[1.75] text-white/60">{body}</p>
        </div>
      </div>
    </article>
  );
}
