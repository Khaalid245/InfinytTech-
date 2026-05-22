"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Home",     href: "/",            section: null       },
  { label: "About",    href: "/about",       section: null       },
  { label: "Services", href: "/#services",   section: "services" },
  { label: "Work",     href: "/case-studies", section: null      },
  { label: "Blog",     href: "/blog",        section: null       },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (pathname !== "/") { setActiveSection(null); return; }
    const el = document.getElementById("services");
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActiveSection(entry.isIntersecting ? "services" : null),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  const isActive = (href: string, section: string | null) => {
    if (section) return activeSection === section;
    if (href.includes("#")) return false;
    if (href === "/" && pathname === "/") return activeSection === null;
    return pathname === href;
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(2,12,19,0.85)" : "rgba(2,12,19,0.08)",
        backdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(0px)",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)"}`,
      }}
    >
      <div className="max-w-310 mx-auto w-full px-8">
        <nav className="relative h-20 flex items-center" aria-label="Main navigation">

          {/* Logo — left */}
          <a href="/" className="logo-entrance shrink-0">
            <Image
              src="/infinytTech-Chartreue1.png"
              alt="InfinytTech"
              width={160}
              height={40}
              style={{ objectFit: "contain" }}
              priority
            />
          </a>

          {/* Links — center */}
          <div className="flex-1 flex items-center justify-center gap-8">
            {NAV_LINKS.map(({ label, href, section }) => {
              const active = isActive(href, section);
              return (
                <a
                  key={label}
                  href={href}
                  className="relative text-[13.5px] font-medium transition-colors duration-200"
                  style={{
                    color: active ? "#e1ff51" : "rgba(255,255,255,0.50)",
                    textShadow: active ? "0 0 22px rgba(225,255,81,0.40)" : "none",
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.90)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = active ? "#e1ff51" : "rgba(255,255,255,0.50)";
                  }}
                >
                  {label}
                  {/* Active indicator — chartreuse hairline at nav bottom */}
                  {active && (
                    <span
                      className="absolute left-0 right-0 pointer-events-none"
                      style={{
                        bottom: -30,
                        height: 1,
                        background: "linear-gradient(90deg, transparent, #e1ff51 50%, transparent)",
                      }}
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* CTA — right */}
          <a
            href="/contact"
            className="ml-auto shrink-0 px-5 py-2 rounded-full text-[13.5px] font-semibold cta-glow"
            style={{ background: "#e1ff51", color: "#000000" }}
          >
            Contact us
          </a>

        </nav>
      </div>
    </header>
  );
}
