import { Fragment } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Eyebrow from "@/components/ui/Eyebrow";
import { Icons } from "@/components/icons/Icons";
import ConnectCTA from "@/components/sections/ConnectCTA";

const ARROW = (
  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const TIMELINE = [
  { year: "2023", title: "Founded",      desc: "Started with a bold vision: build digital products that create measurable impact." },
  { year: "2024", title: "Scaled Up",    desc: "Grew our team and expanded across web, mobile, AI, and cloud services." },
  { year: "2025", title: "40+ Projects", desc: "Delivered over 40 successful digital products across industries." },
  { year: "2026", title: "AI-First",     desc: "Leading the next wave of AI-powered product development at scale." },
];

const BELIEFS = [
  { icon: Icons.trending,     title: "Strategy First",       body: "We solve the right problems before writing a single line of code.",        gradient: "linear-gradient(135deg,#1957DE,#3B82F6)", color: "#1957DE" },
  { icon: Icons.penTool,      title: "Design With Purpose",  body: "Beautiful design is only powerful when it drives measurable outcomes.",      gradient: "linear-gradient(135deg,#7C3AED,#A78BFA)", color: "#7C3AED" },
  { icon: Icons.code,         title: "Build To Scale",       body: "Robust, flexible architecture that grows seamlessly with your business.",    gradient: "linear-gradient(135deg,#0891B2,#22D3EE)", color: "#0891B2" },
  { icon: Icons.brainCircuit, title: "Impact That Matters",  body: "We measure success by results: faster launches, better UX, real savings.",  gradient: "linear-gradient(135deg,#059669,#34D399)", color: "#059669" },
];

const STEPS = [
  { n: "01", icon: Icons.search,   title: "Discover",   body: "Understand your business, audience, and goals." },
  { n: "02", icon: Icons.trending, title: "Strategize", body: "Define the right roadmap to achieve success." },
  { n: "03", icon: Icons.penTool,  title: "Design",     body: "Craft intuitive experiences that engage." },
  { n: "04", icon: Icons.code,     title: "Build",      body: "Develop with clean, efficient, scalable code." },
  { n: "05", icon: Icons.rocket,   title: "Launch",     body: "Deploy seamlessly and ensure everything runs." },
  { n: "06", icon: Icons.barChart, title: "Grow",       body: "Optimize and iterate for continuous growth." },
];

const STATS = [
  { value: "40+",  label: "Projects Delivered",  icon: Icons.briefcase, color: "#3B82F6" },
  { value: "3+",   label: "Years Experience",    icon: Icons.star,      color: "#8B5CF6" },
  { value: "20+",  label: "Experts Onboard",     icon: Icons.users,     color: "#0891B2" },
  { value: "98%",  label: "Client Satisfaction", icon: Icons.heart,     color: "#10B981" },
];

const TECH = [
  { name: "React",      color: "#61DAFB", bg: "rgba(97,218,251,0.10)" },
  { name: "Next.js",    color: "#111111", bg: "rgba(0,0,0,0.06)" },
  { name: "TypeScript", color: "#3178C6", bg: "rgba(49,120,198,0.10)" },
  { name: "JavaScript", color: "#F7DF1E", bg: "rgba(247,223,30,0.16)" },
  { name: "Tailwind CSS", color: "#38BDF8", bg: "rgba(56,189,248,0.12)" },
  { name: "Framer Motion", color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
  { name: "Redux", color: "#764ABC", bg: "rgba(118,74,188,0.12)" },
  { name: "Vite", color: "#646CFF", bg: "rgba(100,108,255,0.12)" },
  { name: "HTML5", color: "#E34F26", bg: "rgba(227,79,38,0.12)" },
  { name: "CSS3", color: "#1572B6", bg: "rgba(21,114,182,0.12)" },
  { name: "Flutter",    color: "#54C5F8", bg: "rgba(84,197,248,0.10)" },
  { name: "React Native", color: "#61DAFB", bg: "rgba(97,218,251,0.10)" },
  { name: "Swift", color: "#F05138", bg: "rgba(240,81,56,0.12)" },
  { name: "Kotlin", color: "#7F52FF", bg: "rgba(127,82,255,0.12)" },
  { name: "Node.js",    color: "#339933", bg: "rgba(51,153,51,0.10)" },
  { name: "Express", color: "#111111", bg: "rgba(0,0,0,0.06)" },
  { name: "Python", color: "#3776AB", bg: "rgba(55,118,171,0.12)" },
  { name: "Django", color: "#092E20", bg: "rgba(9,46,32,0.10)" },
  { name: "FastAPI", color: "#009688", bg: "rgba(0,150,136,0.12)" },
  { name: "GraphQL", color: "#E10098", bg: "rgba(225,0,152,0.12)" },
  { name: "REST APIs", color: "#1957DE", bg: "rgba(25,87,222,0.10)" },
  { name: "Azure", color: "#0078D4", bg: "rgba(0,120,212,0.12)" },
  { name: "Google Cloud", color: "#4285F4", bg: "rgba(66,133,244,0.12)" },
  { name: "Cloudflare", color: "#F38020", bg: "rgba(243,128,32,0.12)" },
  { name: "Firebase", color: "#FFCA28", bg: "rgba(255,202,40,0.16)" },
  { name: "Kubernetes", color: "#326CE5", bg: "rgba(50,108,229,0.12)" },
  { name: "Terraform", color: "#844FBA", bg: "rgba(132,79,186,0.12)" },
  { name: "GitHub Actions", color: "#2088FF", bg: "rgba(32,136,255,0.12)" },
  { name: "CI/CD", color: "#1957DE", bg: "rgba(25,87,222,0.10)" },
  { name: "PostgreSQL", color: "#336791", bg: "rgba(51,103,145,0.10)" },
  { name: "MongoDB", color: "#47A248", bg: "rgba(71,162,72,0.12)" },
  { name: "MySQL", color: "#4479A1", bg: "rgba(68,121,161,0.12)" },
  { name: "Docker",     color: "#2496ED", bg: "rgba(36,150,237,0.10)" },
  { name: "OpenAI",     color: "#10A37F", bg: "rgba(16,163,127,0.10)" },
  { name: "LangChain", color: "#1C3C3C", bg: "rgba(28,60,60,0.10)" },
  { name: "Vector Search", color: "#1957DE", bg: "rgba(25,87,222,0.10)" },
  { name: "Claude", color: "#D97706", bg: "rgba(217,119,6,0.12)" },
  { name: "TensorFlow", color: "#FF6F00", bg: "rgba(255,111,0,0.12)" },
  { name: "Figma", color: "#A259FF", bg: "rgba(162,89,255,0.12)" },
  { name: "Adobe CC", color: "#FF0000", bg: "rgba(255,0,0,0.10)" },
  { name: "Webflow", color: "#4353FF", bg: "rgba(67,83,255,0.12)" },
  { name: "Shopify", color: "#7AB55C", bg: "rgba(122,181,92,0.12)" },
  { name: "WordPress", color: "#21759B", bg: "rgba(33,117,155,0.12)" },
  { name: "Stripe", color: "#635BFF", bg: "rgba(99,91,255,0.12)" },
  { name: "Auth0", color: "#EB5424", bg: "rgba(235,84,36,0.12)" },
];

const HALF = Math.ceil(TECH.length / 2);
const TECH_ROWS = [
  TECH.slice(0, HALF),
  TECH.slice(HALF),
];

export default function AboutPage() {
  return (
    <main className="ag-page">

      {/* ── 01 Hero ─────────────────────────────────── */}
      <section className="hero about-service-hero" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="section-head center">
            <Eyebrow center>About Us</Eyebrow>
            <h1 className="h1">
              More than builders.{" "}
              <span className="accent">Partners in what&apos;s next.</span>
            </h1>
            <p className="lead">
              We combine design, technology, and product thinking to help ambitious
              companies move faster, grow smarter, and create lasting impact.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 Our Story ────────────────────────────── */}
      <section className="ag-story">
        <div className="container ag-story-grid">
          <div className="ag-story-left">
            <Eyebrow>Our Story</Eyebrow>
            <h2 className="ag-h2">Built from passion.<br /><span className="ag-grad-text">Growing with purpose.</span></h2>
            <p className="ag-body" style={{ marginTop: 20 }}>
              We started with a simple belief: great products come from the
              perfect blend of strategy, creativity, and technology.
            </p>
            <p className="ag-body" style={{ marginTop: 14 }}>
              What began as a small team of passionate designers and developers
              has grown into a trusted digital partner for ambitious brands worldwide.
            </p>
            <p className="ag-body" style={{ marginTop: 14 }}>
              Today, we partner closely with clients from idea to launch, bringing
              clear strategy, thoughtful design, and reliable engineering to every
              stage of the product journey.
            </p>
            <Link href="/projects" className="ag-story-cta" style={{ marginTop: 28, display: "inline-flex" }}>
              View Our Work {ARROW}
            </Link>
          </div>

          <div className="ag-timeline">
            {TIMELINE.map((item, i) => (
              <div key={item.year} className={`ag-tl-item${i === TIMELINE.length - 1 ? " ag-tl-active" : ""}`}>
                <div className="ag-tl-dot" />
                <div className="ag-tl-content">
                  <div className="ag-tl-year">{item.year}</div>
                  <div className="ag-tl-title">{item.title}</div>
                  <p className="ag-tl-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 What We Believe ──────────────────────── */}
      <section className="ag-beliefs">
        <div className="container">
          <div className="ag-section-head">
            <Eyebrow center>What We Believe</Eyebrow>
            <h2 className="ag-h2">Principles that guide<br /><span className="ag-grad-text">every decision</span> we make.</h2>
          </div>
          <div className="ag-belief-grid">
            {BELIEFS.map((b) => (
              <div key={b.title} className="ag-belief-card" style={{ "--bc-grad": b.gradient, "--bc-color": b.color } as CSSProperties}>
                <div className="ag-belief-ico" style={{ background: b.gradient }}>
                  <b.icon />
                </div>
                <h3 className="ag-belief-title">{b.title}</h3>
                <p className="ag-belief-body">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 How We Work ──────────────────────────── */}
      <section className="ag-process">
        <div className="container">
          <div className="ag-section-head">
            <Eyebrow center>How we work</Eyebrow>
            <h2 className="ag-h2">A simple, <span className="ag-grad-text">repeatable process</span>.</h2>
          </div>
          <div className="ag-process-grid svc-steps">
            {STEPS.map((s, i) => (
              <Fragment key={s.n}>
                <div className="ag-step svc-step">
                  <div className="ag-step-num svc-step-num">STEP {s.n}</div>
                  <div className="ag-step-ico svc-step-ico"><s.icon /></div>
                  <div className="ag-step-title svc-step-title">{s.title}</div>
                  <p className="ag-step-body svc-step-desc">{s.body}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="ag-step-arrow svc-step-arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 By The Numbers ───────────────────────── */}
      <section className="ag-numbers">
        <Image
          src="/About.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center", zIndex: 0 }}
        />
        <div className="about-cta-overlay" />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div className="ag-section-head">
            <Eyebrow center>By The Numbers</Eyebrow>
            <h2 className="ag-h2 ag-h2--inv">Results that<br /><span className="ag-grad-text-inv">speak for themselves</span>.</h2>
          </div>
          <div className="ag-stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="ag-stat">
                <div className="ag-stat-ico"><s.icon /></div>
                <div>
                  <div className="ag-stat-val">{s.value}</div>
                  <div className="ag-stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 Technologies ─────────────────────────── */}
      <section className="ag-tech">
        <div className="container">
          <div className="ag-section-head">
            <Eyebrow center>Technologies &amp; Expertise</Eyebrow>
            <h2 className="ag-h2">Modern tools for <span className="ag-grad-text">modern products.</span></h2>
            <p style={{ textAlign: "center", maxWidth: 520, margin: "12px auto 0", fontSize: 16, color: "#607086", lineHeight: 1.7 }}>We choose proven technologies that keep your product fast, maintainable, and ready to grow.</p>
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

      <section style={{ background: "#fff", paddingBottom: 80 }}>
        <div className="container">
          <ConnectCTA />
        </div>
      </section>

    </main>
  );
}
