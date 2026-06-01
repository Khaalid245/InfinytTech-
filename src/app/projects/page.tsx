"use client";

import ProjectsFilterSection from "@/components/sections/ProjectsFilterSection";
import ConnectCTA from "@/components/sections/ConnectCTA";
import Eyebrow from "@/components/ui/Eyebrow";
import { ProjectCard } from "@/components/sections/ProjectsSection";
import { PROJECTS } from "@/components/sections/projects-data";

export default function ProjectsPage() {
  return (
    <main>
      <section className="hero work-hero-bg" style={{ paddingBottom: 40 }}>
        <div className="container">
          <div className="section-head center">
            <Eyebrow center>Our work</Eyebrow>
            <h1 className="h1">
              Built with care,<br /><span className="accent">shipped with pride.</span>
            </h1>
            <p className="lead">
              From startup MVPs to enterprise platforms — we bring the same precision and craft to every project we take on.
            </p>
          </div>
        </div>
      </section>

      <ProjectsFilterSection />

      <section className="services-premium-section" style={{ background: "radial-gradient(circle at 78% 18%, rgba(25,87,222,0.09) 0%, transparent 46%), radial-gradient(circle at 12% 82%, rgba(96,165,250,0.08) 0%, transparent 42%), linear-gradient(180deg, #F8FBFF 0%, #EEF4FF 100%)" }}>
        <div className="container">
          <div className="services-premium-head">
            <Eyebrow center>What We Have Built</Eyebrow>
            <h2>Projects we are <span>proud of.</span></h2>
            <p style={{ textAlign: "center", maxWidth: 520, margin: "12px auto 0", fontSize: 15, color: "#607086", lineHeight: 1.7 }}>We bring together design, engineering, and product thinking to build things that work and last.</p>
          </div>
          <div className="pj-grid">
            {PROJECTS.slice(0, 3).map((p) => (
              <ProjectCard key={p.title} {...p} />
            ))}
          </div>
          <ConnectCTA />
        </div>
      </section>

    </main>
  );
}
