import type { Metadata } from "next";
import { Mail, Clock, ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui";
import ContactForm from "@/components/ContactForm";
import SpiderLines from "@/components/SpiderLines";

export const metadata: Metadata = {
  title: "Contact — InfinytTech",
  description:
    "Talk to the engineers building your product. A 30-minute call, no pitch.",
};

const SIGNALS = [
  { label: "Typical response",  value: "Within one business day"    },
  { label: "First call",        value: "30 min — no pitch"          },
  { label: "Engagement start",  value: "Within 2 weeks of scoping"  },
];

const ICON_BOX = {
  background: "#00272c",
  color: "#e1ff51",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5)",
};

export default function ContactPage() {
  return (
    <main className="relative overflow-hidden pb-28" style={{ background: "transparent" }}>

      {/* Dark teal overlay */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "rgba(0, 20, 26, 0.88)" }} aria-hidden="true" />

      {/* Particle network */}
      <SpiderLines />

      {/* Key light — teal from top-left */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 72% 62% at 14% -5%, rgba(14,158,181,0.24) 0%, rgba(14,158,181,0.06) 45%, transparent 72%)",
          filter: "blur(8px)",
        }}
        aria-hidden="true"
      />

      {/* Fill light — chartreuse from bottom-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 96% 110%, rgba(180,204,65,0.15) 0%, rgba(180,204,65,0.04) 48%, transparent 72%)",
          filter: "blur(14px)",
        }}
        aria-hidden="true"
      />

      {/* God rays */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ mixBlendMode: "screen" }} aria-hidden="true">
        <div style={{ position: "absolute", top: "-40%", left: "5%",  width: 280, height: "170%", background: "linear-gradient(180deg,rgba(180,204,65,0.9) 0%,rgba(180,204,65,0.20) 52%,transparent 100%)", transform: "rotate(-28deg)", transformOrigin: "top center", filter: "blur(34px)", opacity: 0.038 }} />
        <div style={{ position: "absolute", top: "-40%", left: "19%", width: 95,  height: "170%", background: "linear-gradient(180deg,rgba(180,204,65,0.8) 0%,rgba(180,204,65,0.14) 58%,transparent 100%)", transform: "rotate(-28deg)", transformOrigin: "top center", filter: "blur(22px)", opacity: 0.026 }} />
        <div style={{ position: "absolute", top: "-40%", left: "33%", width: 160, height: "170%", background: "linear-gradient(180deg,rgba(14,158,181,0.8) 0%,rgba(14,158,181,0.10) 62%,transparent 100%)", transform: "rotate(-22deg)", transformOrigin: "top center", filter: "blur(30px)", opacity: 0.028 }} />
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

      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 88% 74% at 50% 42%, transparent 30%, rgba(0,0,0,0.68) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.34) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.34) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 100%)" }} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-300 mx-auto px-8 pt-20">

        {/* Header */}
        <div className="max-w-160 mb-12">
          <Eyebrow>Contact us</Eyebrow>
          <h1 className="mt-4.5 text-[36px] lg:text-[48px] font-extrabold tracking-tight leading-[1.08] text-white">
            Tell us what<br />you&apos;re building.
          </h1>
          <p className="mt-5 text-[14.5px] leading-[1.68] text-white/55 max-w-130">
            Bring us the part of your roadmap that&apos;s stuck. A 30-minute call —
            we&apos;ll tell you whether we&apos;re the right team, or point you toward who is.
          </p>
        </div>

        {/* Signal strip — horizontal hairline grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 border border-white/[0.07] mb-8">
          {SIGNALS.map(({ label, value }, i) => {
            const isLast = i === SIGNALS.length - 1;
            return (
              <div
                key={label}
                className={`px-6 py-5 flex flex-col gap-1.5${!isLast ? " border-b border-white/[0.07] sm:border-b-0 sm:border-r sm:border-r-white/[0.07]" : ""}`}
                style={{ background: "rgba(0,20,26,0.30)" }}
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
                  {label}
                </span>
                <span className="text-[14px] font-semibold text-white">{value}</span>
              </div>
            );
          })}
        </div>

        {/* Two-column bento — gap-px hairline separator */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-px"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >

          {/* Left: form panel */}
          <div
            className="relative overflow-hidden p-8"
            style={{ background: "rgba(0,20,26,0.45)" }}
          >
            {/* Chartreuse top-edge glow */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px z-10"
              style={{ background: "linear-gradient(90deg, transparent, rgba(225,255,81,0.45) 50%, transparent)" }}
              aria-hidden="true"
            />
            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.018] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden="true"
            />
            <h2 className="relative z-10 text-[18px] font-semibold tracking-[-0.01em] text-white mb-6">
              Send us a message
            </h2>
            <div className="relative z-10">
              <ContactForm />
            </div>
          </div>

          {/* Right column */}
          <div
            className="flex flex-col gap-px"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >

            {/* Team status strip */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: "rgba(0,20,26,0.45)" }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-1.5 h-1.5 rounded-full live-dot"
                  style={{ background: "#e1ff51" }}
                  aria-hidden="true"
                />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: "#e1ff51" }}
                >
                  Available for new projects
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/30">Q2 · 2025</span>
            </div>

            {/* Contact details */}
            <div
              className="relative overflow-hidden px-6 py-6"
              style={{ background: "rgba(0,20,26,0.45)" }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(225,255,81,0.25) 50%, transparent)" }}
                aria-hidden="true"
              />
              <p
                className="text-[10px] font-bold uppercase tracking-[0.14em] mb-5"
                style={{ color: "#e1ff51" }}
              >
                Get in touch
              </p>
              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center"
                    style={ICON_BOX}
                  >
                    <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40 mb-0.5">
                      Email
                    </p>
                    <a
                      href="mailto:hello@infinyttech.com"
                      className="text-[13.5px] font-medium text-white transition-colors duration-200 hover:text-[#e1ff51]"
                    >
                      hello@infinyttech.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center"
                    style={ICON_BOX}
                  >
                    <Clock size={15} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40 mb-0.5">
                      Hours
                    </p>
                    <span className="text-[13.5px] font-medium text-white">
                      Sat – Fri, 9 AM – 6 PM
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA panel */}
            <div
              className="relative overflow-hidden flex-1 px-6 py-8 flex flex-col justify-end min-h-56"
              style={{
                background:
                  "linear-gradient(145deg, rgba(0,20,26,0.55) 0%, rgba(0,39,44,0.65) 55%, rgba(14,158,181,0.10) 120%)",
              }}
            >
              {/* Chartreuse bloom */}
              <div
                className="pointer-events-none absolute inset-0 blur-3xl"
                style={{
                  background:
                    "radial-gradient(ellipse 90% 60% at 50% 100%, rgba(225,255,81,0.08) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />
              {/* Decorative wave */}
              <svg
                className="absolute right-[-20px] bottom-[-20px] w-[180px] opacity-[0.07] pointer-events-none"
                viewBox="0 0 180 50"
                fill="none"
                stroke="#e1ff51"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M0 25 Q 22.5 0, 45 25 T 90 25 T 135 25 T 180 25" />
              </svg>
              <div className="relative z-10">
                <h3 className="text-[20px] font-bold text-white leading-[1.2] mb-2.5 tracking-tight">
                  Not sure where<br />to start?
                </h3>
                <p className="text-[13px] text-white/55 leading-[1.65] mb-6">
                  30 minutes. No pitch — just an honest conversation about your
                  goals and whether we&apos;re the right fit.
                </p>
                <a
                  href="mailto:hello@infinyttech.com"
                  className="inline-flex items-center gap-2 text-[13px] font-bold transition-opacity duration-200 hover:opacity-75"
                  style={{ color: "#e1ff51" }}
                >
                  Book via email
                  <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
