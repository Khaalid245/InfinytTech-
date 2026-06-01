import { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export function Eyebrow({
  children,
  center = false,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-[13px] font-semibold tracking-[0.12em] uppercase ${center ? "justify-center" : ""}`}
      style={{ color: "#e1ff51" }}
    >
      {children}
      <span style={{ display: "inline-block", width: 28, height: 1.5, background: "#e1ff51", flexShrink: 0 }} aria-hidden="true" />
    </span>
  );
}

export function PrimaryBtn({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[14px] font-semibold whitespace-nowrap cta-glow"
      style={{ background: "#e1ff51", color: "#00272c" }}
    >
      <span>{children}</span>
    </a>
  );
}

export function SecondaryBtn({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="secondary-btn inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold whitespace-nowrap"
    >
      <span>{children}</span>
      <ArrowRight size={13} strokeWidth={2} className="btn-arrow" style={{ transform: "rotate(-45deg)" }} aria-hidden="true" />
    </a>
  );
}

export function Wave({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`absolute bottom-6 right-6 w-[140px] opacity-30 pointer-events-none ${className}`}
      viewBox="0 0 140 36"
      fill="none"
      stroke="rgba(43,184,207,0.5)"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M0 18 Q 17.5 0, 35 18 T 70 18 T 105 18 T 140 18" />
    </svg>
  );
}
