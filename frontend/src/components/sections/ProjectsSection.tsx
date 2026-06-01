"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import { Icons } from "@/components/icons/Icons";
import ProjectModal from "./ProjectModal";
import { type ProjectCardProps, type ProjectCategory, PROJECTS } from "./projects-data";

export type { ProjectCardProps, ProjectCategory };

export function ProjectCard(props: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const { title, body, accent, image, industry } = props;

  return (
    <>
      <div
        className="pj-card"
        style={{ "--pj-accent": accent, cursor: "pointer" } as CSSProperties}
        onClick={() => setOpen(true)}
      >
        <div className="pj-card-visual">
          <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" className="pj-card-photo" />
          <span className="pj-category-badge">{industry}</span>
        </div>

        <div className="pj-card-content">
          <h3 className="pj-card-title">{title}</h3>
          <p className="pj-card-body">{body}</p>
          <div className="pj-card-foot">
            <span style={{ color: "#1957DE" }}>View Details</span>
            <div className="pj-card-foot-right">
              <span className="sv-card-arrow-btn" aria-hidden="true">
                <Icons.arrowRight />
              </span>
            </div>
          </div>
        </div>
      </div>

      {open && <ProjectModal project={props} onClose={() => setOpen(false)} />}
    </>
  );
}

export { PROJECTS };

export default function ProjectsSection({ limit = 6 }: { limit?: number }) {
  const visible = PROJECTS.slice(0, limit);
  return (
    <section className="pj-section">
      <div className="container">

        <div className="pj-header">
          <div className="pj-heading">
            <Eyebrow>Our work</Eyebrow>
            <h2 className="pj-h2">
              Projects that <span className="pj-accent-text">moved the needle</span>.
            </h2>
            <p className="pj-lead">Real impact. Measurable results. Built to scale.</p>
          </div>
        </div>

        <div className="pj-grid">
          {visible.map((p) => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>

        <div className="pj-footer-row">
          <Link href="/projects" className="pj-view-all">
            View All Projects
            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 7h10M8 3l4 4-4 4" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
