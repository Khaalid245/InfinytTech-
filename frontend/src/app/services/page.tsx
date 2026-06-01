import { Fragment } from "react";
import type { CSSProperties } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import { Icons } from "@/components/icons/Icons";
import ServicesSection from "@/components/sections/ServicesSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";
import ConnectCTA from "@/components/sections/ConnectCTA";

const OUTCOMES = [
  { icon: Icons.rocket, title: "Faster Launches", body: "Move from idea to market with focused scope, senior execution, and fewer handoff delays.", accent: "#3B82F6" },
  { icon: Icons.star, title: "Better User Experiences", body: "Create products that feel intuitive, polished, and easy for customers and teams to adopt.", accent: "#8B5CF6" },
  { icon: Icons.database, title: "Scalable Systems", body: "Build foundations that can handle growth without constant rework or fragile shortcuts.", accent: "#0891B2" },
  { icon: Icons.settings, title: "Operational Efficiency", body: "Automate repetitive work, connect systems, and give teams tools that remove friction.", accent: "#10B981" },
];

const PROCESS = [
  { n: "01", icon: Icons.search,   title: "Discover",   body: "Understand your business, audience, and goals." },
  { n: "02", icon: Icons.trending, title: "Strategize", body: "Define the right roadmap to achieve success." },
  { n: "03", icon: Icons.penTool,  title: "Design",     body: "Craft intuitive experiences that engage." },
  { n: "04", icon: Icons.code,     title: "Build",      body: "Develop with clean, efficient, scalable code." },
  { n: "05", icon: Icons.rocket,   title: "Launch",     body: "Deploy seamlessly and ensure everything runs." },
  { n: "06", icon: Icons.barChart, title: "Scale",      body: "Optimize and iterate for continuous growth." },
];

const TECH = [
  { name: "Flutter",      color: "#54C5F8", bg: "rgba(84,197,248,0.10)" },
  { name: "React Native", color: "#61DAFB", bg: "rgba(97,218,251,0.10)" },
  { name: "iOS",          color: "#F05138", bg: "rgba(240,81,56,0.12)"  },
  { name: "Android",      color: "#3DDC84", bg: "rgba(61,220,132,0.12)" },
  { name: "REST APIs",    color: "#1957DE", bg: "rgba(25,87,222,0.10)"  },
  { name: "GraphQL",      color: "#E10098", bg: "rgba(225,0,152,0.12)"  },
  { name: "Figma",        color: "#A259FF", bg: "rgba(162,89,255,0.12)" },
  { name: "Next.js",      color: "#111111", bg: "rgba(0,0,0,0.06)"      },
  { name: "TypeScript",   color: "#3178C6", bg: "rgba(49,120,198,0.10)" },
  { name: "Node.js",      color: "#339933", bg: "rgba(51,153,51,0.10)"  },
  { name: "OpenAI",       color: "#10A37F", bg: "rgba(16,163,127,0.10)" },
  { name: "Stripe",       color: "#635BFF", bg: "rgba(99,91,255,0.12)"  },
];

const TECH_ROWS = [
  TECH.slice(0, 6),
  TECH.slice(6),
];

export default function ServicesPage() {
  return (
    <main className="services-premium">
      <section className="hero svc-hero-bg services-premium-about-hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="section-head center">
            <Eyebrow center>Our Services</Eyebrow>
            <h1 className="h1">
              The right expertise,{" "}
              <span className="accent">right when you need it.</span>
            </h1>
            <p className="lead">Tell us where you&apos;re headed. We&apos;ll handle how you get there.</p>
          </div>
        </div>
      </section>

      <ServicesSection />

      <section className="services-premium-section services-premium-soft">
        <div className="container services-premium-deliver-layout">
          <div className="services-premium-head">
            <Eyebrow>What we deliver</Eyebrow>
            <h2>Less complexity. <span>More momentum.</span></h2>
            <p>We focus on speed, usability, reliability, and operating leverage.</p>
          </div>
          <div className="services-premium-outcomes">
            {OUTCOMES.map((item) => (
              <article key={item.title}>
                <div className="services-premium-outcome-icon"><item.icon /></div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="ag-process svc-process">
        <div className="container">
          <div className="ag-section-head">
            <Eyebrow center>How We Work</Eyebrow>
            <h2 className="ag-h2">A simple, <span className="ag-grad-text">repeatable process</span>.</h2>
          </div>
          <div className="ag-process-grid">
            {PROCESS.map((s, i) => (
              <Fragment key={s.n}>
                <div className="ag-step">
                  {i < PROCESS.length - 1 && <div className="ag-step-connector" />}
                  <div className="ag-step-num">{s.n}</div>
                  <div className="ag-step-ico"><s.icon /></div>
                  <div className="ag-step-title">{s.title}</div>
                  <p className="ag-step-body">{s.body}</p>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      <section className="ag-tech">
        <div className="container">
          <div className="ag-section-head">
            <Eyebrow center>Technologies &amp; Expertise</Eyebrow>
            <h2 className="ag-h2">Modern tools for <span className="ag-grad-text">modern products.</span></h2>
            <p style={{ textAlign: "center", maxWidth: 520, margin: "12px auto 0" }}>We choose proven technologies that keep your product fast, maintainable, and ready to grow.</p>
          </div>
          <div className="ag-tech-marquees" aria-label="Technologies and platforms we use">
            {TECH_ROWS.map((row, rowIndex) => (
              <div className={`ag-tech-marquee ag-tech-marquee--${rowIndex + 1}`} key={rowIndex}>
                {[0, 1, 2, 3].map((copy) => (
                  <div className="ag-tech-track" key={copy} aria-hidden={copy > 0}>
                    {row.map((t) => (
                      <div
                        key={`${copy}-${t.name}`}
                        className="ag-tech-pill"
                        style={{ "--tc": t.color, "--tb": t.bg } as CSSProperties}
                      >
                        {t.name}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhyChooseSection>
        <ConnectCTA />
      </WhyChooseSection>
    </main>
  );
}
