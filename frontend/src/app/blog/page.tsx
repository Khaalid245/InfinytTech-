"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useState } from "react";
import ConnectCTA from "@/components/sections/ConnectCTA";
import Eyebrow from "@/components/ui/Eyebrow";
import { Icons } from "@/components/icons/Icons";

const CAT_COLOR: Record<string, string> = {
  AI:          "#10B981",
  Product:     "#F59E0B",
  Development: "#0891B2",
  Design:      "#D946EF",
  Strategy:    "#3B82F6",
  Startups:    "#F43F5E",
};

const CATEGORIES = ["All", "Design", "Development", "AI", "Product", "Strategy", "Startups"];

const ARTICLES = [
  { category: "AI",          title: "Building AI products that teams actually adopt",       excerpt: "A practical guide to turning prototypes into dependable workflows with clear UX, evaluation, and trust built in.",                    read: "8 min", date: "May 12, 2026", image: "/Blog.png"    },
  { category: "Product",     title: "The product decisions hidden inside every dashboard",  excerpt: "Dashboards work when they compress complexity into decisions, not when they display every metric available.",                        read: "6 min", date: "May 4, 2026",  image: "/Work.png"    },
  { category: "Development", title: "Shipping faster without creating technical debt",      excerpt: "The engineering habits that help product teams move quickly while keeping the system understandable.",                               read: "7 min", date: "Apr 24, 2026", image: "/Service.png" },
  { category: "Design",      title: "Why premium interfaces feel quieter",                  excerpt: "Spacing, hierarchy, and restraint do more for trust than decorative complexity ever could.",                                         read: "5 min", date: "Apr 16, 2026", image: "/About.png"   },
  { category: "Strategy",    title: "A better way to scope digital products",               excerpt: "Start with the business movement you need, then choose the software shape that gets you there.",                                    read: "6 min", date: "Apr 8, 2026",  image: "/card.png"    },
  { category: "Startups",    title: "What founders should build before they scale",         excerpt: "The minimum systems that create clarity before growth starts multiplying every rough edge.",                                          read: "4 min", date: "Mar 29, 2026", image: "/Work.png"    },
];

const FEATURED = ARTICLES[0];


export default function BlogPage() {
  const [active, setActive] = useState("All");
  const [nlEmail, setNlEmail] = useState("");
  const [nlSent, setNlSent] = useState(false);
  const filtered = active === "All" ? ARTICLES : ARTICLES.filter((a) => a.category === active);

  return (
    <main className="blog-page">

      {/* ── 01 Hero ── */}
      <section className="blg-hero">
        <div className="container">
          <div className="section-head center">
            <Eyebrow center>Insights &amp; Ideas</Eyebrow>
            <h1 className="h1">
              Ideas that help teams<br />
              <span className="accent">build better products.</span>
            </h1>
            <p className="lead">
              Practical thinking on software, AI, design, and product strategy
              for founders and teams shipping real products.
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 Spotlight ── */}
      <section className="blg-spotlight-section">
        <div className="container">
          <div className="blg-feature-card">
            {/* Image */}
            <div className="blg-feature-img">
              <Image
                src={FEATURED.image}
                alt={FEATURED.title}
                fill
                sizes="(max-width: 900px) 100vw, 55vw"
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="blg-feature-overlay" />
              <div className="blg-feature-badges">
                <span className="blg-feature-badge">Featured</span>
                <span
                  className="blg-cat-tag"
                  style={{ "--cc": CAT_COLOR[FEATURED.category] } as CSSProperties}
                >
                  {FEATURED.category}
                </span>
              </div>
            </div>

            {/* Right panel */}
            <div className="blg-feature-panel">
              <div className="blg-feature-article">
                <div className="blg-feature-meta">
                  <span>{FEATURED.date}</span>
                  <span className="blg-dot" />
                  <span>{FEATURED.read} read</span>
                </div>
                <h2 className="blg-feature-title">{FEATURED.title}</h2>
                <p className="blg-feature-excerpt">{FEATURED.excerpt}</p>
                <Link href="#" className="blg-feature-cta">
                  Read article <Icons.arrowRight />
                </Link>
              </div>

              <div className="blg-feature-divider" />

              <div className="blg-feature-nl">
                {nlSent ? (
                  <div className="blg-feature-nl-success">
                    <div className="blg-feature-nl-ico"><Icons.check /></div>
                    <div>
                      <h4>You&apos;re in.</h4>
                      <p>Next piece goes straight to your inbox.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="blg-feature-nl-eyebrow">Newsletter</p>
                    <h3 className="blg-feature-nl-title">Stay in the loop.</h3>
                    <form
                      className="blg-feature-nl-form"
                      onSubmit={(e) => { e.preventDefault(); setNlSent(true); }}
                    >
                      <input
                        type="email"
                        className="blg-feature-nl-input"
                        placeholder="your@email.com"
                        value={nlEmail}
                        onChange={(e) => setNlEmail(e.target.value)}
                        required
                      />
                      <button type="submit" className="blg-feature-nl-btn">
                        Subscribe <Icons.arrowRight />
                      </button>
                    </form>
                    <p className="blg-feature-nl-trust">No spam. Unsubscribe anytime.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 Articles Grid ── */}
      <section className="blg-grid-section" id="blg-insights">
        <div className="container">
          <div className="blg-grid-head">
            <div className="blg-grid-heading">
              <Eyebrow>Latest Insights</Eyebrow>
              <h2 className="blg-section-h2">Recent thinking from<br />the build floor.</h2>
            </div>
            <div className="blg-filter-bar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`blg-filter-pill${active === cat ? " active" : ""}`}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="blg-grid">
            {filtered.map((article) => (
              <article key={article.title} className="blg-card">
                <div className="blg-card-img">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <span
                    className="blg-cat-tag blg-card-tag"
                    style={{ "--cc": CAT_COLOR[article.category] ?? "#1957DE" } as CSSProperties}
                  >
                    {article.category}
                  </span>
                </div>
                <div className="blg-card-body">
                  <h3 className="blg-card-title">{article.title}</h3>
                  <p className="blg-card-excerpt">{article.excerpt}</p>
                  <div className="blg-card-foot">
                    <div className="blg-card-meta">
                      <span>{article.date}</span>
                      <span className="blg-dot" />
                      <span>{article.read} read</span>
                    </div>
                    <span className="blg-arrow-btn"><Icons.arrowRight /></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 Project CTA ── */}
      <section className="blg-bottom-section">
        <div className="container">
          <ConnectCTA />
        </div>
      </section>

    </main>
  );
}
