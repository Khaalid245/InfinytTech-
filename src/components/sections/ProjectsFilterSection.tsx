"use client";

import { useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { PROJECTS, ProjectCategory, type ProjectCardProps } from "./projects-data";
import ProjectModal from "./ProjectModal";

type Filter = "All" | ProjectCategory;

const FILTERS: { label: string; value: Filter }[] = [
  { label: "All",    value: "All"    },
  { label: "Web",    value: "Web"    },
  { label: "Mobile", value: "Mobile" },
  { label: "Design", value: "Design" },
];

function getCount(f: Filter) {
  return f === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.category === f).length;
}

export default function ProjectsFilterSection() {
  const [active, setActive] = useState<Filter>("All");
  const [selected, setSelected] = useState<ProjectCardProps | null>(null);

  const visible =
    active === "All"
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === active);

  return (
    <>
    <section className="wk-list-section">
      <div className="container">

        <div className="wk-list-header">
          <div className="wk-list-title-block">
            <h2 className="wk-list-h2">Featured Projects</h2>
          </div>
          <div className="wk-seg-ctrl">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`wk-seg-pill${active === f.value ? " active" : ""}`}
                onClick={() => setActive(f.value)}
              >
                {f.label}
                <span className="wk-seg-count">{getCount(f.value)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="wk-list">
          {visible.map((p, i) => (
            <div
              key={p.title}
              className="wk-list-item"
              style={{ "--i": i, cursor: "pointer" } as CSSProperties}
              onClick={() => setSelected(p)}
            >
              {/* Image panel */}
              <div className="wk-list-image">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 42vw"
                  style={{ objectFit: "cover" }}
                />
                <span className="wk-list-cat-badge">{p.industry}</span>
              </div>

              {/* Content panel */}
              <div className="wk-list-info">
                <span className="wk-list-num">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="wk-list-title">{p.title}</h3>
                <p className="wk-list-body">{p.body}</p>

                <div className="wk-list-stat">
                  <span className="wk-list-stat-val">{p.stats[0].value}</span>
                  <span className="wk-list-stat-label">{p.stats[0].label}</span>
                </div>

                <div className="wk-list-footer">
                  <span className="wk-list-cta-text">View Details</span>
                  <button
                    className="wk-list-arrow"
                    aria-label={`View ${p.title}`}
                    onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                  >
                    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 7h10M8 3l4 4-4 4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>

    {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
