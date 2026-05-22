import {
  CheckCircle,
  Clock,
  Shield,
  TrendingUp,
  Users,
  MessageSquare,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { Eyebrow } from "./ui";
import SpiderLines from "./SpiderLines";

const REASONS: { Icon: LucideIcon; title: string; body: string }[] = [
  {
    Icon: CheckCircle,
    title: "Experienced Team",
    body: "Specialists across product, engineering and design who have shipped at scale.",
  },
  {
    Icon: Clock,
    title: "On-Time Delivery",
    body: "Honest timelines and steady velocity, with no surprises in the last sprint.",
  },
  {
    Icon: Shield,
    title: "Built-in Security",
    body: "SOC2-ready foundations, code review, and pen-tested releases as default.",
  },
  {
    Icon: TrendingUp,
    title: "Clear Outcomes",
    body: "Every engagement is anchored to outcomes you can show your CFO.",
  },
  {
    Icon: Users,
    title: "Senior by Default",
    body: "No bait-and-switch — the engineers who pitch you are the ones who ship.",
  },
  {
    Icon: MessageSquare,
    title: "Always Reachable",
    body: "A shared channel, named owner, weekly demo. You always know where things stand.",
  },
];

export default function WhyChoose() {
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
        <div className="bubble-a absolute w-1   h-1   rounded-full" style={{ bottom:"8%",  left:"48%", background:"rgba(212,255,58,0.30)", animationDuration:"13s", animationDelay:"-5s" }} />
        <div className="bubble-b absolute w-10 h-10 rounded-full" style={{ bottom:"14%", left:"6%",  border:"1px solid rgba(212,255,58,0.13)", animationDuration:"20s", animationDelay:"-6s" }} />
        <div className="bubble-c absolute w-6  h-6  rounded-full" style={{ bottom:"34%", left:"24%", border:"1px solid rgba(212,255,58,0.17)", animationDuration:"17s", animationDelay:"-11s" }} />
        <div className="bubble-a absolute w-16 h-16 rounded-full" style={{ bottom:"4%",  left:"1%",  border:"1px solid rgba(212,255,58,0.07)", animationDuration:"26s", animationDelay:"-8s" }} />
        <div className="bubble-b absolute w-4  h-4  rounded-full" style={{ bottom:"46%", left:"10%", border:"1px solid rgba(14,158,181,0.18)", animationDuration:"15s", animationDelay:"-13s" }} />
        <div className="bubble-c absolute w-8  h-8  rounded-full" style={{ bottom:"22%", left:"40%", border:"1px solid rgba(14,158,181,0.12)", animationDuration:"22s", animationDelay:"-1s" }} />
      </div>

      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 88% 74% at 50% 42%, transparent 30%, rgba(0,0,0,0.68) 100%)" }} aria-hidden="true" />
      {/* Lateral edge bars */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.34) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.34) 100%)" }} aria-hidden="true" />
      {/* Top fade */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 100%)" }} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-300 mx-auto px-8">

        <div className="flex flex-col items-center text-center gap-3.5 max-w-180 mx-auto mb-16">
          <Eyebrow center>Why choose us</Eyebrow>
          <h2 className="text-[36px] lg:text-[40px] font-extrabold tracking-[-0.015em] leading-[1.1] text-white">
            Reasons clients <span style={{ color: "#e1ff51" }}>stay with us</span>.
          </h2>
          <p className="text-[18px] leading-[1.6]">
            A short list of the things we hear most after a year of working together.
          </p>
        </div>

        <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
          {REASONS.map(({ Icon, title, body }, index) => (
            <ReasonRow key={title} Icon={Icon} title={title} body={body} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ReasonRow({
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
  return (
    <div className="group relative flex flex-col lg:grid lg:grid-cols-[56px_1fr_1fr] lg:items-center gap-4 lg:gap-x-14 py-8 pl-6 lg:pl-8 transition-colors duration-300 ease-out">

      {/* Left chartreuse accent bar */}
      <span
        className="absolute left-0 inset-y-0 w-0.5 origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out rounded-full"
        style={{ background: "#e1ff51" }}
        aria-hidden="true"
      />

      {/* Step number */}
      <span className="font-mono text-[11px] tracking-[0.14em] text-white/20 group-hover:text-[#e1ff51] transition-colors duration-300 ease-out select-none">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Icon + title */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-out group-hover:scale-105"
          style={{
            background: "#00272c",
            color: "#e1ff51",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5)",
          }}
        >
          <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
        </div>
        <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-white transition-colors duration-300 ease-out group-hover:text-[#e1ff51]">
          {title}
        </h3>
      </div>

      {/* Body */}
      <p className="text-[14px] leading-[1.7] text-white/60 lg:max-w-[480px]">
        {body}
      </p>

    </div>
  );
}
