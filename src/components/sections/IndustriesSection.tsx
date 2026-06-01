import Link from "next/link";
import type { CSSProperties } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import { Icons, IconComponent } from "@/components/icons/Icons";

interface IndustryCardProps {
  icon: IconComponent;
  title: string;
  hook: string;
  builds: string[];
  proofBadge: string;
  proofLabel: string;
  accent: string;
}

function IndustryCard({ icon: Ico, title, hook, builds, proofBadge, proofLabel, accent }: IndustryCardProps) {
  return (
    <div className="industry-card" style={{ "--ind-accent": accent } as CSSProperties}>
      <div className="ind-header">
        <div className="ico"><Ico /></div>
        <div className="ind-title-group">
          <div className="title">{title}</div>
          <div className="ind-hook">{hook}</div>
        </div>
      </div>
      <div className="ind-divider" />
      <ul className="ind-list">
        {builds.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="ind-proof">
        <span className="ind-proof-badge">{proofBadge}</span>
        <span className="ind-proof-label">{proofLabel}</span>
      </div>
      <Link href="/projects" className="ind-cta">
        See related work
        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M2 7h10M8 3l4 4-4 4" />
        </svg>
      </Link>
    </div>
  );
}

const INDUSTRIES: IndustryCardProps[] = [
  {
    accent: "#3B82F6",
    icon: Icons.trending,
    title: "Fintech",
    hook: "Compliant from day one.",
    builds: [
      "Payment gateways, wallets & ledger systems",
      "KYC / AML onboarding flows",
      "Trading dashboards & portfolio tools",
      "Lending engines & credit scoring APIs",
    ],
    proofBadge: "PCI-DSS Ready",
    proofLabel: "Architecture designed for financial-grade security",
  },
  {
    accent: "#10B981",
    icon: Icons.heartPulse,
    title: "Healthcare",
    hook: "Products clinicians trust, patients use.",
    builds: [
      "EHR & HL7 / FHIR integrations",
      "Patient portals & telehealth platforms",
      "Clinical decision-support tools",
      "Appointment scheduling & billing systems",
    ],
    proofBadge: "HIPAA Compliant",
    proofLabel: "End-to-end privacy controls, audit logs included",
  },
  {
    accent: "#F59E0B",
    icon: Icons.bag,
    title: "Retail & E-commerce",
    hook: "Storefronts that convert, stacks that scale.",
    builds: [
      "Headless & DTC commerce storefronts",
      "Inventory, WMS & supplier portals",
      "Loyalty, promotions & personalisation",
      "Omnichannel checkout & returns flows",
    ],
    proofBadge: "3× Avg. CVR Lift",
    proofLabel: "Across checkout and product-page optimisations",
  },
  {
    accent: "#0891B2",
    icon: Icons.car,
    title: "Mobility & Logistics",
    hook: "Real-time ops, zero downtime tolerance.",
    builds: [
      "Fleet & asset tracking platforms",
      "Route optimisation & dispatch engines",
      "Driver & last-mile delivery apps",
      "IoT sensor integration & alerting",
    ],
    proofBadge: "Sub-100ms Updates",
    proofLabel: "Live location refresh at fleet scale",
  },
  {
    accent: "#8B5CF6",
    icon: Icons.chartCombo,
    title: "SaaS & B2B",
    hook: "Platforms your customers renew — and recommend.",
    builds: [
      "Multi-tenant SaaS architecture",
      "Usage-based billing & subscription management",
      "In-app analytics & reporting dashboards",
      "Developer-facing APIs & webhooks",
    ],
    proofBadge: "99.9% Uptime SLA",
    proofLabel: "Infrastructure patterns engineered for reliability",
  },
  {
    accent: "#1957DE",
    icon: Icons.briefcase,
    title: "Enterprise",
    hook: "Modernise without breaking what works.",
    builds: [
      "Legacy migration & re-platforming",
      "Workflow automation & RPA integration",
      "Cloud infrastructure & DevOps pipelines",
      "Enterprise integrations & middleware",
    ],
    proofBadge: "Zero-Downtime",
    proofLabel: "Migration playbooks with rollback guarantees",
  },
];

export default function IndustriesSection({ className = "" }: { className?: string }) {
  return (
    <section className={`section ${className}`.trim()}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: 52 }}>
          <Eyebrow>Industries We Work With</Eyebrow>
          <h2 className="h2">
            Experience across <span className="accent">high-impact</span> markets.
          </h2>
          <p className="lead" style={{ marginTop: 10 }}>
            We bring product, design, and engineering judgment to teams building in
            complex, fast-moving industries — so you get a partner who already knows
            the terrain.
          </p>
        </div>
        <div className="grid-3 grid-ind">
          {INDUSTRIES.map((ind) => (
            <IndustryCard key={ind.title} {...ind} />
          ))}
        </div>
      </div>
    </section>
  );
}
