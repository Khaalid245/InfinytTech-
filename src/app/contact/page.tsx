"use client";

import { useState } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import { Icons } from "@/components/icons/Icons";

const PROJECT_TYPES = ["Web App", "Mobile App", "Design", "AI / Automation", "Strategy", "Other"];
const BUDGETS = ["Under $500", "$500 – $2K", "$2K – $5K", "$5K – $10K", "Let's talk"];

const TRUST = [
  "Senior-led from kickoff to launch",
  "Fixed-price & T&M options available",
  "Direct Slack channel with your team",
  "Weekly progress updates, no surprises",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", message: "" });
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");
  const [sent, setSent] = useState(false);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  return (
    <main className="ct-page">
      <section className="ct-hero">
        <div className="container">
          <div className="section-head center">
            <Eyebrow center>Let&apos;s Talk</Eyebrow>
            <h1 className="h1">
              Let&apos;s shape your next <span className="accent">digital product.</span>
            </h1>
            <p className="lead">
              Share the idea or challenge you want to tackle. We&apos;ll respond within one working day.
            </p>
          </div>
        </div>
      </section>

      <section className="ct-main">
        <div className="container">
          <div className="ct-layout">
            <form
              className="ct-form-card"
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            >
              {sent ? (
                <div className="ct-success">
                  <div className="ct-success-ico"><Icons.check /></div>
                  <h3>Message sent.</h3>
                  <p>We&apos;ll be in touch within one working day.</p>
                </div>
              ) : (
                <>
                  <div className="ct-form-head">
                    <h2>Tell us about your project</h2>
                    <p>A few lines is enough. We&apos;ll follow up with the right questions.</p>
                  </div>

                  <div className="ct-field-row">
                    <div className="ct-field">
                      <label htmlFor="ct-name">Your name</label>
                      <input id="ct-name" type="text" placeholder="Alex Johnson" value={form.name} onChange={set("name")} required />
                    </div>
                    <div className="ct-field">
                      <label htmlFor="ct-email">Work email</label>
                      <input id="ct-email" type="email" placeholder="alex@company.com" value={form.email} onChange={set("email")} required />
                    </div>
                  </div>

                  <div className="ct-field-row">
                    <div className="ct-field">
                      <label htmlFor="ct-company">Company <span className="ct-opt">(optional)</span></label>
                      <input id="ct-company" type="text" placeholder="Company name" value={form.company} onChange={set("company")} />
                    </div>
                    <div className="ct-field">
                      <label htmlFor="ct-role">Your role <span className="ct-opt">(optional)</span></label>
                      <input id="ct-role" type="text" placeholder="e.g. Founder, CTO" value={form.role} onChange={set("role")} />
                    </div>
                  </div>

                  <div className="ct-pill-group">
                    <span className="ct-pill-label">Project type</span>
                    <div className="ct-pills">
                      {PROJECT_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          className={`ct-pill${projectType === t ? " active" : ""}`}
                          onClick={() => setProjectType(t === projectType ? "" : t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="ct-pill-group">
                    <span className="ct-pill-label">Estimated budget</span>
                    <div className="ct-pills">
                      {BUDGETS.map((b) => (
                        <button
                          key={b}
                          type="button"
                          className={`ct-pill${budget === b ? " active" : ""}`}
                          onClick={() => setBudget(b === budget ? "" : b)}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="ct-field">
                    <label htmlFor="ct-message">What are you building?</label>
                    <textarea
                      id="ct-message"
                      placeholder="Describe the problem you're solving, the users you're building for, and any constraints we should know about."
                      value={form.message}
                      onChange={set("message")}
                      required
                    />
                  </div>

                  <button className="ct-submit" type="submit">
                    <span>Send message</span>
                    <span className="ct-submit-arr"><Icons.arrowRight /></span>
                  </button>
                </>
              )}
            </form>

            <aside className="ct-aside">
              <div className="ct-info-card">
                <p className="ct-card-title">Get in touch</p>
                <div className="ct-channels">
                  <a href="mailto:hello@infinyttech.com" className="ct-channel">
                    <div className="ct-channel-ico"><Icons.mail /></div>
                    <div>
                      <span className="ct-channel-label">Email us</span>
                      <span className="ct-channel-value">hello@infinyttech.com</span>
                      <span className="ct-channel-meta">Replies within one working day</span>
                    </div>
                  </a>
                  <a href="tel:+252612345678" className="ct-channel">
                    <div className="ct-channel-ico"><Icons.phone /></div>
                    <div>
                      <span className="ct-channel-label">Call us</span>
                      <span className="ct-channel-value">+252 61 234 5678</span>
                      <span className="ct-channel-meta">Sat – Thu, 8 am – 5 pm EAT</span>
                    </div>
                  </a>
                  <div className="ct-channel">
                    <div className="ct-channel-ico"><Icons.pin /></div>
                    <div>
                      <span className="ct-channel-label">Find us</span>
                      <span className="ct-channel-value">Mogadishu, Somalia</span>
                      <span className="ct-channel-meta">Remote worldwide</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ct-trust-card">
                <p className="ct-card-title">Why work with us</p>
                {TRUST.map((item) => (
                  <div key={item} className="ct-trust-item">
                    <span><Icons.check /></span>
                    {item}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
