"use client";

import { useEffect, type ReactElement } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { ProjectCardProps } from "./projects-data";

interface Props {
  project: ProjectCardProps;
  onClose: () => void;
}

/* ── Brand SVG icons keyed by tech name ── */
const TechIcon = ({ name }: { name: string }) => {
  const icons: Record<string, ReactElement> = {
    "React": (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
        <circle cx="12" cy="12" r="2.2" fill="#61DAFB"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.6" stroke="#61DAFB" strokeWidth="1.4"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.6" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.6" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(-60 12 12)"/>
      </svg>
    ),
    "React Native": (
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none">
        <circle cx="12" cy="12" r="2.2" fill="#61DAFB"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.6" stroke="#61DAFB" strokeWidth="1.4"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.6" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(60 12 12)"/>
        <ellipse cx="12" cy="12" rx="10" ry="3.6" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(-60 12 12)"/>
      </svg>
    ),
    "Next.js": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <circle cx="12" cy="12" r="10" fill="#000"/>
        <path d="M7.5 16.5V7.5l9 11M14.5 7.5v4.5" stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    "Node.js": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M12 2l8.66 5v10L12 22l-8.66-5V7z" fill="#339933"/>
        <path d="M9 8.5v7l3-4.5 3 4.5v-7" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    "Python": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M12 2C8.7 2 7 3.6 7 6v2h5v1H6C4.3 9 3 10.5 3 13s1.3 4 3 5l1.3-1.8C6.5 15.4 6 14.3 6 13h12c0 1.3-.5 2.4-1.3 3.2L18 18c1.7-1 3-2.8 3-5s-1.3-4-3-4h-1V6c0-2.4-1.7-4-5-4zm-2 3a1 1 0 110 2 1 1 0 010-2z" fill="#3776AB"/>
        <path d="M12 22c3.3 0 5-1.6 5-4v-2h-5v-1h6c1.7 0 3-1.5 3-4s-1.3-4-3-5l-1.3 1.8c.8.8 1.3 1.9 1.3 3.2H6c0-1.3.5-2.4 1.3-3.2L6 7c-1.7 1-3 2.8-3 5s1.3 4 3 4h1v2c0 2.4 1.7 4 5 4zm2-3a1 1 0 110-2 1 1 0 010 2z" fill="#FFD43B"/>
      </svg>
    ),
    "AWS": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M7 14.5c-2-.8-3.5-2.5-3.5-4.5C3.5 7 6 5 9 5.5M17 14.5c2-.8 3.5-2.5 3.5-4.5C20.5 7 18 5 15 5.5" stroke="#FF9900" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M6 19l2-1.5M18 19l-2-1.5M12 20v-3" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6 19h12M7 14.5c1.2.8 3 1.2 5 1.2s3.8-.4 5-1.2" stroke="#FF9900" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    ),
    "Azure": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M13.5 3L7 13.5 11.5 21H21L13.5 3z" fill="#0078D4"/>
        <path d="M3 21h8.5L7 13.5 3 21z" fill="#0063B1"/>
      </svg>
    ),
    "PostgreSQL": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <ellipse cx="12" cy="8" rx="7" ry="5" fill="#336791"/>
        <path d="M5 8v8c0 2.8 3.1 5 7 5s7-2.2 7-5V8" stroke="#336791" strokeWidth="1.5" fill="none"/>
        <line x1="5" y1="12" x2="19" y2="12" stroke="#fff" strokeWidth="1" opacity="0.4"/>
        <ellipse cx="12" cy="8" rx="7" ry="5" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3"/>
      </svg>
    ),
    "Postgres": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <ellipse cx="12" cy="8" rx="7" ry="5" fill="#336791"/>
        <path d="M5 8v8c0 2.8 3.1 5 7 5s7-2.2 7-5V8" stroke="#336791" strokeWidth="1.5" fill="none"/>
        <line x1="5" y1="12" x2="19" y2="12" stroke="#fff" strokeWidth="1" opacity="0.4"/>
        <ellipse cx="12" cy="8" rx="7" ry="5" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3"/>
      </svg>
    ),
    "MongoDB": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M12 2c0 0-6 8-6 12a6 6 0 0012 0C18 10 12 2 12 2z" fill="#47A248"/>
        <line x1="12" y1="14" x2="12" y2="22" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    "Tailwind": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C13.38 11.01 14.5 12.16 17 12.16c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C15.62 7.15 14.5 6 12 6zM7 12.16c-2.67 0-4.33 1.34-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35C8.38 17.17 9.5 18.32 12 18.32c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.31-.74-1.91-1.35C10.62 13.31 9.5 12.16 7 12.16z" fill="#06B6D4"/>
      </svg>
    ),
    "TypeScript": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <rect width="24" height="24" rx="3" fill="#3178C6"/>
        <path d="M14 10h-3.5v9H8V10H4.5V8H14v2zM20 16.5c0 1.4-1.1 2.5-2.5 2.5s-2.5-1.1-2.5-2.5c0-.6.2-1.1.6-1.5l-.1-.1c-.7-.7-.9-1.6-.9-2.4H17c0 .4.1.9.4 1.2l.4.4c.4-.3.8-.5 1.2-.5 1.4 0 2.5 1.1 2.5 2.5l-.5.4z" fill="#fff"/>
      </svg>
    ),
    "Vercel": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <circle cx="12" cy="12" r="10" fill="#000"/>
        <path d="M12 7l6 10H6L12 7z" fill="#fff"/>
      </svg>
    ),
    "Shopify": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M15.5 4.5S15 4 14 4c-1 0-1.5.5-2 1.5C11 6.5 11 10 11 10l4 1 1-6.5zM19 6c-.5 0-1 .2-1.5.5L16 18H8L6 8c-.5-.3-1-.5-1.5-.5L3 20h18L19 6z" fill="#96BF48"/>
        <path d="M15.5 4.5L14.5 11l-3.5-1s0-3.5 1-4.5c.5-.5 1-.5 2-.5 1.1 0 1.5.5 1.5.5z" fill="#5E8E3E"/>
      </svg>
    ),
    "OpenAI": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M12 2a4.8 4.8 0 00-4.8 4.8v.3A4.8 4.8 0 004 11.5a4.8 4.8 0 002.6 4.3v.3A4.8 4.8 0 0012 21a4.8 4.8 0 005.4-4.9v-.3A4.8 4.8 0 0020 11.5a4.8 4.8 0 00-3.2-4.4v-.3A4.8 4.8 0 0012 2zm0 2.5a2.3 2.3 0 012.3 2.3v.7h-4.6v-.7A2.3 2.3 0 0112 4.5zm0 15a2.3 2.3 0 01-2.3-2.3v-.7h4.6v.7A2.3 2.3 0 0112 19.5z" fill="#412991"/>
        <circle cx="12" cy="11.5" r="2.5" fill="#412991"/>
      </svg>
    ),
    "FastAPI": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <circle cx="12" cy="12" r="10" fill="#009688"/>
        <path d="M13 4l-5 9h5l-2 7 7-10h-5l2-6z" fill="#fff"/>
      </svg>
    ),
    "TensorFlow": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2z" fill="#FF6F00"/>
        <path d="M12 7v10M8 9.5l4-2.5 4 2.5M8 14.5l4 2.5 4-2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    "Java": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M9.5 18s-.5 1 2.5 1.5c3.5.5 4.5-.2 4.5-.2s-.5.5-3 .7c-2.5.2-6-.2-4-2z" fill="#007396"/>
        <path d="M8.5 15.5s-.5 1.5 3 1.8c3.5.3 5.5-.5 5.5-.5s-1 1-4 1.2c-3 .2-5.5-.5-4.5-2.5z" fill="#007396"/>
        <path d="M13 2s2 2 .5 4.5C12 9 10 9.5 11.5 12c1.5 2.5-1-1-1-1S8 9.5 9.5 7C11 4.5 13 2 13 2z" fill="#E76F00"/>
        <path d="M9 19.5c3.5 1 9 .5 9-2.5 0-1.5-1.5-2.5-4-3 2.5.3 4 1 4 2s-1.5 2.5-9 3.5z" fill="#007396"/>
      </svg>
    ),
    "LangChain": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M9 7a3 3 0 000 6h2M15 17a3 3 0 000-6h-2" stroke="#1C3C3C" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M7 10h10M7 14h10" stroke="#1C3C3C" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      </svg>
    ),
    "Maps API": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#4285F4"/>
        <circle cx="12" cy="9" r="2.5" fill="#fff"/>
      </svg>
    ),
    "Oracle DB": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <ellipse cx="12" cy="12" rx="9" ry="5.5" fill="none" stroke="#F80000" strokeWidth="2"/>
        <ellipse cx="12" cy="12" rx="5" ry="5.5" fill="none" stroke="#F80000" strokeWidth="1.5"/>
      </svg>
    ),
    "HTML": (
      <svg viewBox="0 0 24 24" width="13" height="13">
        <path d="M4 3l1.5 16.5L12 21l6.5-1.5L20 3H4z" fill="#E44D26"/>
        <path d="M12 5.5v13l5-1.5 1.2-13.5H12z" fill="#F16529"/>
        <path d="M8 9h4m0 0h3.5l-.4 4H12m0 0H8.5L8 9" stroke="#fff" strokeWidth=".8" fill="none"/>
        <path d="M12 17l2.5-.6.3-3.4" stroke="#fff" strokeWidth=".8" fill="none" strokeLinecap="round"/>
      </svg>
    ),
  };

  const found = icons[name];
  if (found) return <span style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>{found}</span>;

  /* Fallback: colored dot */
  const hue = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span style={{
      width: 13, height: 13, borderRadius: "50%", flexShrink: 0,
      background: `hsl(${hue},65%,50%)`, display: "inline-block",
    }} />
  );
};

function trendDir(change?: string): "up" | "down" | "neutral" {
  if (!change) return "neutral";
  if (change.startsWith("+")) return "up";
  if (change.startsWith("−") || change.startsWith("-")) return "down";
  return "neutral";
}

export default function ProjectModal({ project, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const Icon = project.tagIcon;

  return createPortal(
    <div className="pm-backdrop" onClick={onClose}>
      <div
        className="pm-shell"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={project.title}
      >

        {/* ── Banner with header overlaid on top of image ── */}
        <div className="pm-banner">
          <Image src={project.image} alt={project.title} fill style={{ objectFit: "cover" }} sizes="680px" />
          <div className="pm-banner-vignette" />
          <span className="pm-banner-num" aria-hidden="true">{project.num}</span>

          {/* Close button — absolute top-right */}
          <button
            autoFocus
            className="pm-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Identity + KPI strip stacked at bottom of image */}
          <div className="pm-header-overlay">
            <div className="pm-identity">
              <div className="pm-icon" style={{ background: "#1957DE" }}>
                <Icon />
              </div>
              <div>
                <h2 className="pm-title">{project.title}</h2>
                <div className="pm-meta">
                  <span className="pm-industry-badge">{project.industry}</span>
                  <span className="pm-client-name">{project.client}</span>
                </div>
              </div>
            </div>

            <div className="pm-kpi-strip">
              {project.stats.map((s) => {
                const dir = trendDir(s.change);
                return (
                  <div key={s.label} className="pm-kpi">
                    {dir !== "neutral" && s.change ? (
                      <span className={`pm-kpi-delta pm-kpi-delta--${dir}`}>{s.change}</span>
                    ) : (
                      <span className="pm-kpi-value">{s.value}</span>
                    )}
                    <span className="pm-kpi-label">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="pm-body">

          <section className="pm-section">
            <h3 className="pm-section-heading">Overview</h3>
            <blockquote className="pm-overview">{project.overview}</blockquote>
          </section>

          <section className="pm-section">
            <h3 className="pm-section-heading">Challenges &amp; Solutions</h3>
            <div className="pm-cs-list">
              {project.challenges.map((c, i) => (
                <div key={i} className="pm-cs-item">
                  <div className="pm-cs-challenge">
                    <span className="pm-cs-tag pm-cs-tag--problem">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                      </svg>
                      Challenge
                    </span>
                    <p className="pm-cs-text">{c.problem}</p>
                  </div>
                  <div className="pm-cs-solution">
                    <span className="pm-cs-tag pm-cs-tag--solution">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                      </svg>
                      Solution
                    </span>
                    <p className="pm-cs-text">{c.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="pm-section">
            <h3 className="pm-stack-heading">Tech Stack</h3>
            <div className="pm-tags">
              {project.stack.map((s) => (
                <span key={s} className="pm-tag" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <TechIcon name={s} />
                  {s}
                </span>
              ))}
            </div>
          </section>

          <div className="pm-cta">
            <p className="pm-cta-eyebrow">Ready to build something similar?</p>
            <h4 className="pm-cta-heading">Let&apos;s turn your idea into measurable results.</h4>
            <div className="pm-cta-actions">
              <a
                href={project.liveUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="pm-cta-demo"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                </svg>
                Live Demo
              </a>
              <Link href="/contact" className="pm-cta-primary" onClick={onClose}>
                Start a Conversation
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
