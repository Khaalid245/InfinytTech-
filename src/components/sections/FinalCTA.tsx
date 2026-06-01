import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="section" style={{ paddingBottom: 0, background: "radial-gradient(circle at 88% 12%, rgba(96,165,250,0.13), transparent 30%), linear-gradient(180deg, #FFFFFF 0%, #F7FAFF 100%)" }}>
      <div className="container">
        <div className="cta-strip about-cta-strip">
          <Image
            src="/About.png"
            alt=""
            fill
            sizes="100vw"
            className="about-cta-bg"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className="about-cta-overlay" />
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
      </div>
    </section>
  );
}
