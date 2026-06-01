import Eyebrow from "@/components/ui/Eyebrow";
import Link from "next/link";

export default function ConnectCTA() {
  return (
    <div className="cta-strip about-cta-strip" style={{ marginTop: 72, marginBottom: 0 }}>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Eyebrow>Let&rsquo;s Connect</Eyebrow>
        <h2 style={{ marginTop: 14 }}>
          Let&rsquo;s build something remarkable together.
        </h2>
        <p>
          Have a project in mind? We&rsquo;d love to hear about it and
          explore how we can help bring your ideas to life.
        </p>
      </div>
      <div className="actions" style={{ position: "relative", zIndex: 1 }}>
        <Link href="/contact" className="cta-consult-btn">
          Start a Project
          <svg
            viewBox="0 0 14 14"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 7h10M8 3l4 4-4 4" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
