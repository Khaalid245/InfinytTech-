import type { CSSProperties, ReactNode } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import { Icons, IconComponent } from "@/components/icons/Icons";

interface Reason {
  icon: IconComponent;
  title: string;
  body: string;
  badge: string;
  accent: string;
}

const REASONS: Reason[] = [
  {
    icon: Icons.users,
    title: "Senior-Led Execution",
    body: "Senior builders own every decision from strategy to delivery.",
    badge: "No junior handoffs",
    accent: "#1957DE",
  },
  {
    icon: Icons.message,
    title: "Direct Communication",
    body: "Clear updates, fewer layers, and faster alignment every time.",
    badge: "< 4h response time",
    accent: "#1957DE",
  },
  {
    icon: Icons.shieldCheck,
    title: "Security First",
    body: "Security built into architecture, access control, and data handling.",
    badge: "Built responsibly",
    accent: "#1957DE",
  },
  {
    icon: Icons.briefcase,
    title: "Business Focused",
    body: "Every technical decision connects to revenue, operations, and outcomes.",
    badge: "Outcome led",
    accent: "#1957DE",
  },
  {
    icon: Icons.zap,
    title: "Fast Delivery",
    body: "Focused execution keeps momentum high without sacrificing quality.",
    badge: "2-week milestones",
    accent: "#1957DE",
  },
  {
    icon: Icons.infinity,
    title: "Long-Term Partnership",
    body: "Support, iteration, and product judgment that continues beyond launch.",
    badge: "Beyond launch",
    accent: "#1957DE",
  },
];

export default function WhyChooseSection({ children }: { children?: ReactNode }) {
  return (
    <section className="home-why">
      <div className="container">
        <div className="home-why-header">
          <Eyebrow center>Why Clients Choose Us</Eyebrow>
          <h2 className="home-why-h2">
            Senior thinking,{" "}
            <span className="home-why-h2-accent">without the overhead.</span>
          </h2>
          <p className="home-why-lead">
            Senior-level thinking and execution, delivered directly.
            No overhead, no unnecessary layers.
          </p>
        </div>

        <div className="home-why-grid">
          {REASONS.map((item) => (
            <article
              key={item.title}
              className="home-why-card"
              style={{ "--why-accent": item.accent } as CSSProperties}
            >
              <div className="sv-card-bar" aria-hidden="true" />
              <div className="home-why-icon" aria-hidden="true">
                <item.icon />
              </div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <span className="home-why-badge">{item.badge}</span>
            </article>
          ))}
        </div>
        {children}
      </div>
    </section>
  );
}
