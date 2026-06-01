"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="nav2-header">
      <div className="container">
        <nav className="nav2">

          {/* Logo */}
          <Link href="/" className="nav2-logo">
            <Image
              src="/logo.png"
              alt="InfinytTech"
              width={400}
              height={120}
              style={{ height: "36px", width: "auto" }}
              priority
            />
          </Link>

          {/* Links */}
          <div className="nav2-links">
            {NAV_ITEMS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav2-link${pathname === href ? " active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link href="/contact" className="nav2-cta">
            Start Project
            <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12L12 2M5 2h7v7" />
            </svg>
          </Link>

        </nav>
      </div>
    </header>
  );
}
