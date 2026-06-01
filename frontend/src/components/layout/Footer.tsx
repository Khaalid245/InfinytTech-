import Link from "next/link";
import Image from "next/image";

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        {/* Newsletter strip */}
        <div className="footer-newsletter-strip">
          <div className="footer-newsletter-left">
            <h2 className="footer-newsletter-headline">Stay in the loop.</h2>
            <p className="footer-newsletter-sub">Insights on tech, product, and AI — straight to your inbox. No spam.</p>
          </div>
          <form className="footer-newsletter-form">
            <input
              type="email"
              placeholder="your@email.com"
              className="footer-newsletter-input"
              required
            />
            <button type="submit" className="footer-newsletter-btn">
              Subscribe
              <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline", verticalAlign: "middle" }}>
                <path d="M2 7h10M8 3l4 4-4 4" />
              </svg>
            </button>
          </form>
        </div>

        <div className="footer-divider" />

        {/* Main columns */}
        <div className="cols">

          {/* Brand */}
          <div className="brand">
            <Link href="/">
              <Image
                src="/logo1.png"
                alt="InfinytTech"
                width={400}
                height={120}
                style={{ height: "36px", width: "auto" }}
              />
            </Link>
            <p>
              Full-stack digital partner. We handle branding, design,
              software, and AI so your team can focus on growth.
            </p>
            <div className="footer-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="footer-social-btn">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About us</Link></li>
              <li><Link href="/projects">Our work</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4>Services</h4>
            <ul>
              <li><Link href="/services">Web Development</Link></li>
              <li><Link href="/services">Mobile App Development</Link></li>
              <li><Link href="/services">Custom Software &amp; APIs</Link></li>
              <li><Link href="/services">UI / UX Design</Link></li>
              <li><Link href="/services">Branding &amp; Graphic Design</Link></li>
              <li><Link href="/services">AI Automation</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4>Get in touch</h4>
            <ul>
              <li><a href="mailto:hello@infinyttech.com">hello@infinyttech.com</a></li>
              <li><a href="tel:+252612345678">+252 61 234 5678</a></li>
              <li>
                <span className="footer-location">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Mogadishu, Somalia · Remote worldwide</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="bottom">
          <span>© 2026 InfinytTech. All rights reserved.</span>
          <div className="footer-legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/security">Security</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
