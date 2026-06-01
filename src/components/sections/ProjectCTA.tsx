"use client";

import { useState } from "react";
import Eyebrow from "@/components/ui/Eyebrow";

export default function ProjectCTA() {
  const [msg, setMsg] = useState("");

  return (
    <div className="proj-cta">
      <div className="proj-cta-left">
        <Eyebrow>Start a project</Eyebrow>
        <h2 className="proj-cta-h2">
          Tell us about<br />your project.
        </h2>
        <p className="proj-cta-sub">
          A few lines is enough — we&rsquo;ll follow up from there.
        </p>
      </div>
      <div className="proj-cta-right">
        <form className="proj-cta-form" onSubmit={(e) => e.preventDefault()}>
          <textarea
            className="proj-cta-textarea"
            placeholder="Describe your project, goals, timeline…"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={4}
          />
          <button type="submit" className="proj-cta-btn">
            Send Message
            <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
