'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import type { CSSProperties } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import { Icons, IconComponent } from "@/components/icons/Icons";

/* ── Modal data types ─────────────────────────────────────── */
interface ServiceModalData {
  rating: string;
  timeline: string;
  startingPrice: string;
  teamSize: string;
  simpleTerms: string;
  whatYouGet: string[];
  perfectFor: string[];
}

interface ServiceItem {
  icon: IconComponent;
  label: string;
  title: string;
  body: string;
  accent: string;
  tags: string[];
  modal: ServiceModalData;
}

/* ── Services data ────────────────────────────────────────── */
const SERVICES: ServiceItem[] = [
  {
    icon: Icons.code,
    label: "Plan + Build",
    title: "Web Development",
    body: "Scalable websites, SaaS products, dashboards, and portals built for growth.",
    accent: "#1957DE",
    tags: ["React", "Next.js", "TypeScript", "Tailwind"],
    modal: {
      rating: "4.9",
      timeline: "4-12 weeks",
      startingPrice: "From $500",
      teamSize: "2-4 devs",
      simpleTerms: "We build your website or web application — from marketing sites to complex SaaS platforms — with clean code, great performance, and a design your users will love.",
      whatYouGet: [
        "Custom responsive website or web app",
        "Admin dashboard & CMS integration",
        "API & third-party integrations",
        "Performance & SEO optimization",
        "Deployment & hosting setup",
        "Post-launch support",
      ],
      perfectFor: [
        "Startups launching their first product",
        "Businesses replacing outdated websites",
        "SaaS teams building dashboards",
        "E-commerce stores needing custom features",
      ],
    },
  },
  {
    icon: Icons.smartphone,
    label: "Build",
    title: "Mobile App Development",
    body: "iOS, Android, and cross-platform apps with clean, reliable user flows.",
    accent: "#1957DE",
    tags: ["Flutter", "React Native", "Swift", "Kotlin"],
    modal: {
      rating: "4.8",
      timeline: "6-16 weeks",
      startingPrice: "From $800",
      teamSize: "2-3 devs",
      simpleTerms: "We design and build mobile apps for iOS and Android that users actually enjoy. Whether you need a native or cross-platform solution, we ship clean, reliable code.",
      whatYouGet: [
        "iOS & Android native or cross-platform app",
        "Intuitive, user-tested UI/UX",
        "App store submission & review support",
        "Push notifications & real-time features",
        "Offline mode & local storage",
        "Analytics & crash reporting integration",
      ],
      perfectFor: [
        "Businesses needing a mobile presence",
        "Startups with a mobile-first product",
        "Companies replacing legacy mobile apps",
        "Consumer apps needing great UX",
      ],
    },
  },
  {
    icon: Icons.serverCog,
    label: "Scale",
    title: "Custom Software & APIs",
    body: "Internal tools, workflows, APIs, and integrations that keep operations moving.",
    accent: "#1957DE",
    tags: ["Node.js", "GraphQL", "REST", "PostgreSQL"],
    modal: {
      rating: "4.9",
      timeline: "4-16 weeks",
      startingPrice: "From $600",
      teamSize: "2-4 devs",
      simpleTerms: "We build the internal tools, automation systems, and APIs that power your operations — so your team can move faster with fewer manual steps.",
      whatYouGet: [
        "Custom internal tools & portals",
        "REST & GraphQL API development",
        "Third-party system integrations",
        "Workflow & process automation",
        "Database architecture & optimization",
        "Full documentation & handoff",
      ],
      perfectFor: [
        "Teams with repetitive manual processes",
        "Companies needing system integrations",
        "Businesses with unique operational needs",
        "Enterprises modernizing legacy systems",
      ],
    },
  },
  {
    icon: Icons.penTool,
    label: "Design",
    title: "UI/UX Design",
    body: "Premium interfaces and user flows that make complex products feel simple.",
    accent: "#1957DE",
    tags: ["Figma", "Framer", "Prototyping", "Systems"],
    modal: {
      rating: "4.9",
      timeline: "1-4 weeks",
      startingPrice: "From $300",
      teamSize: "1-2 designers",
      simpleTerms: "We design how your website or app looks and feels — making sure it's not only beautiful but also easy and enjoyable for your customers to use.",
      whatYouGet: [
        "User research & journey mapping",
        "Wireframes & high-fidelity UI designs",
        "Interactive prototypes",
        "Design system & component library",
        "Usability testing & iteration",
        "Developer-ready Figma handoff",
      ],
      perfectFor: [
        "Businesses launching new websites or apps",
        "Companies with outdated or confusing interfaces",
        "Organizations wanting to improve satisfaction",
        "Anyone needing to make a strong first impression",
      ],
    },
  },
  {
    icon: Icons.palette,
    label: "Position",
    title: "Branding & Graphic Design",
    body: "Visual identity, pitch assets, and design systems that build trust fast.",
    accent: "#1957DE",
    tags: ["Illustrator", "Figma", "Adobe CC", "Identity"],
    modal: {
      rating: "4.8",
      timeline: "2-6 weeks",
      startingPrice: "From $200",
      teamSize: "1-2 designers",
      simpleTerms: "We create your visual identity — logo, colors, typography, and all the assets your business needs to look professional and build trust with your audience.",
      whatYouGet: [
        "Logo design & brand mark variations",
        "Comprehensive brand guidelines",
        "Color palette & typography system",
        "Business cards & stationery",
        "Social media kit & templates",
        "Pitch deck & presentation design",
      ],
      perfectFor: [
        "New businesses building their brand",
        "Established companies refreshing their identity",
        "Startups preparing for fundraising",
        "Businesses entering new markets",
      ],
    },
  },
  {
    icon: Icons.brainCircuit,
    label: "Automate",
    title: "AI Automation",
    body: "AI agents and automations that reduce repetitive work and unlock leverage.",
    accent: "#1957DE",
    tags: ["OpenAI", "LangChain", "Python", "Claude"],
    modal: {
      rating: "4.9",
      timeline: "2-8 weeks",
      startingPrice: "From $500",
      teamSize: "1-3 engineers",
      simpleTerms: "We build AI-powered systems that take over repetitive tasks, analyze data, and make smart decisions — so your team can focus on the work that actually matters.",
      whatYouGet: [
        "Custom AI agent development",
        "Workflow & process automation",
        "CRM & sales pipeline automation",
        "Data processing & enrichment pipelines",
        "LLM integration & fine-tuning",
        "Monitoring, logging & maintenance",
      ],
      perfectFor: [
        "Teams spending hours on repetitive tasks",
        "Businesses wanting to scale without hiring",
        "Companies with large amounts of data to process",
        "Sales teams needing lead qualification",
      ],
    },
  },
];

/* ── Modal component ──────────────────────────────────────── */
function ServiceModal({ service, onClose }: { service: ServiceItem; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { modal, icon: Ico, title, label, tags, accent } = service;

  return (
    <div className="svc-modal-backdrop" onClick={onClose}>
      <div className="svc-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>

        {/* Dark header + stats */}
        <div className="svc-modal-header">
          <div className="svc-modal-header-top">
            <div className="svc-modal-header-left">
              <div className="svc-modal-icon" style={{ background: accent }}>
                <Ico />
              </div>
              <div>
                <h2 className="svc-modal-title">{title}</h2>
                <span className="svc-modal-badge">{label}</span>
              </div>
            </div>
            <button className="svc-modal-close" onClick={onClose} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Stats inside dark header */}
          <div className="svc-modal-stats">
            {[
              { icon: <Icons.star />, value: modal.rating, label: "Rating" },
              { icon: <Icons.clock />, value: modal.timeline, label: "Timeline" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, value: modal.startingPrice, label: "Starting Price" },
              { icon: <Icons.users />, value: modal.teamSize, label: "Team Size" },
            ].map((s) => (
              <div key={s.label} className="svc-modal-stat">
                <span className="svc-modal-stat-icon">{s.icon}</span>
                <span className="svc-modal-stat-value">{s.value}</span>
                <span className="svc-modal-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="svc-modal-body">

          {/* Simple terms */}
          <div className="svc-modal-section">
            <h3 className="svc-modal-section-title">What is this in simple terms?</h3>
            <p className="svc-modal-section-body">{modal.simpleTerms}</p>
          </div>

          {/* What you get */}
          <div className="svc-modal-section">
            <h3 className="svc-modal-section-title">What you get with this service:</h3>
            <div className="svc-modal-checklist">
              {modal.whatYouGet.map((item) => (
                <div key={item} className="svc-modal-check-item">
                  <span className="svc-modal-checkmark"><Icons.check /></span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Perfect for */}
          <div className="svc-modal-section">
            <h3 className="svc-modal-section-title">This is perfect for:</h3>
            <div className="svc-modal-dotlist">
              {modal.perfectFor.map((item) => (
                <div key={item} className="svc-modal-dot-item">
                  <span className="svc-modal-dot" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="svc-modal-section">
            <h3 className="svc-modal-tech-title">Technologies &amp; Tools We Use:</h3>
            <div className="svc-modal-tags">
              {tags.map((tag) => (
                <span key={tag} className="svc-modal-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="svc-modal-cta">
            <h4>Ready to get started?</h4>
            <p>Let&apos;s discuss your project and see how we can help you achieve your goals.</p>
            <Link href="/contact" className="svc-modal-cta-btn" onClick={onClose}>
              Contact Us Now
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Service card ─────────────────────────────────────────── */
function ServiceCard({ service, onLearnMore }: { service: ServiceItem; onLearnMore: () => void }) {
  const { icon: Ico, label, title, body, accent, tags } = service;
  return (
    <div
      className="sv-card"
      style={{ "--sv-accent": accent } as CSSProperties}
      onClick={onLearnMore}
    >
      <div className="sv-card-bar" />
      <div className="sv-card-inner">
        <div className="sv-card-head">
          <div className="sv-card-ico"><Ico /></div>
        </div>
        <span className="sv-card-label">{label}</span>
        <h3 className="sv-card-title">{title}</h3>
        <p className="sv-card-body">{body}</p>
        <div className="sv-card-tags">
          {tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="sv-card-foot">
          <span>Learn more</span>
          <span className="sv-card-arrow-btn" aria-hidden="true">
            <Icons.arrowRight />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Section ──────────────────────────────────────────────── */
export default function ServicesSection() {
  const [active, setActive] = useState<ServiceItem | null>(null);

  return (
    <section className="sv-section">
      <div className="container">
        <div className="sv-header">
          <div className="sv-heading">
            <Eyebrow>Our services</Eyebrow>
            <h2 className="sv-h2">
              Built to <span className="sv-accent">scale</span> with you.
            </h2>
            <p className="sv-lead">
              Strategy, design, software, and AI systems for teams ready to launch and grow.
            </p>
          </div>
        </div>

        <div className="sv-grid">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.title}
              service={service}
              onLearnMore={() => setActive(service)}
            />
          ))}
        </div>

        <Link href="/contact" className="sv-footer-row">
          <span>Not sure what you need yet?</span>
          <strong>Book a free discovery call</strong>
          <Icons.arrowRight />
        </Link>
      </div>

      {active && <ServiceModal service={active} onClose={() => setActive(null)} />}
    </section>
  );
}
