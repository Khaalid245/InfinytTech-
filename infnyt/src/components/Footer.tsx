import Image from "next/image";
import SpiderLines from "./SpiderLines";

const COMPANY_LINKS = ["About us", "Careers", "Our Work", "Blog"];
const SERVICE_LINKS = [
  "Software Development",
  "Product Design",
  "AI & Automation",
  "Infrastructure & DevOps",
];
const CONTACT_ITEMS = [
  "hello@infinyttech.com",
  "+252 612912629",
  "Mogadishu, Nairobi",
];
const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/infinyttech",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-20 pb-8" style={{ background: "transparent" }}>

      {/* Dark teal overlay */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "rgba(0, 20, 26, 0.92)" }} aria-hidden="true" />

      {/* Particle network */}
      <SpiderLines />

      {/* Key light — teal from top-left */}
      <div
        className="cinema-key pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 72% 62% at 14% -5%, rgba(14,158,181,0.24) 0%, rgba(14,158,181,0.06) 45%, transparent 72%)",
          filter: "blur(8px)",
        }}
        aria-hidden="true"
      />

      {/* Fill light — chartreuse bloom from bottom-right */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 96% 110%, rgba(180,204,65,0.15) 0%, rgba(180,204,65,0.04) 48%, transparent 72%)",
          filter: "blur(14px)",
        }}
        aria-hidden="true"
      />

      {/* God rays */}
      <div className="cinema-rays pointer-events-none absolute inset-0 overflow-hidden" style={{ mixBlendMode: "screen" }} aria-hidden="true">
        <div style={{ position:"absolute", top:"-40%", left:"5%",  width:280, height:"170%", background:"linear-gradient(180deg,rgba(180,204,65,0.9) 0%,rgba(180,204,65,0.20) 52%,transparent 100%)", transform:"rotate(-28deg)", transformOrigin:"top center", filter:"blur(34px)", opacity:0.038 }} />
        <div style={{ position:"absolute", top:"-40%", left:"19%", width:95,  height:"170%", background:"linear-gradient(180deg,rgba(180,204,65,0.8) 0%,rgba(180,204,65,0.14) 58%,transparent 100%)", transform:"rotate(-28deg)", transformOrigin:"top center", filter:"blur(22px)", opacity:0.026 }} />
        <div style={{ position:"absolute", top:"-40%", left:"33%", width:160, height:"170%", background:"linear-gradient(180deg,rgba(14,158,181,0.8)  0%,rgba(14,158,181,0.10)  62%,transparent 100%)", transform:"rotate(-22deg)", transformOrigin:"top center", filter:"blur(30px)", opacity:0.028 }} />
      </div>

      {/* Drifting ambient */}
      <div className="hero-gradient-drift pointer-events-none absolute inset-0" aria-hidden="true" />

      {/* Ambient — upper-left chartreuse */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-160 h-160"
        style={{ background: "radial-gradient(circle, rgba(180,204,65,0.09) 0%, transparent 62%)" }}
        aria-hidden="true"
      />

      {/* Ambient — lower-right */}
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-120 w-[65%]"
        style={{ background: "radial-gradient(ellipse 80% 90% at 90% 100%, rgba(180,204,65,0.07) 0%, rgba(14,158,181,0.04) 45%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Mid-depth haze */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 88% 28% at 50% 46%, rgba(14,158,181,0.032) 0%, transparent 100%)" }}
        aria-hidden="true"
      />

      {/* Cinematic vignette */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 88% 74% at 50% 42%, transparent 30%, rgba(0,0,0,0.68) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.34) 0%, transparent 16%, transparent 84%, rgba(0,0,0,0.34) 100%)" }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, transparent 100%)" }} aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-300 mx-auto px-8">

        <div className="border-t border-white/[0.07]">

          {/* Main columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] pt-16 pb-14 gap-12 lg:gap-0">

            {/* Brand column */}
            <div className="lg:pr-14">
              <Image
                src="/infinytTech-Chartreue.png"
                alt="InfinytTech"
                width={130}
                height={60}
                style={{ objectFit: "contain" }}
              />
              <p className="mt-5 text-[13.5px] leading-[1.7] text-white/50 max-w-60">
                An engineering partner for product teams. Built in Mogadishu and Nairobi.
              </p>

              {/* Social */}
              <div className="mt-7 flex items-center gap-4">
                {SOCIAL_LINKS.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="group/social flex h-8 w-8 items-center justify-center rounded-full text-white/40 hover:text-[#e1ff51] transition-colors duration-200"
                    style={{
                      background: "#00272c",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 0 1px rgba(0,0,0,0.5)",
                    }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="text-[13px] font-bold leading-none tracking-[-0.04em]" aria-hidden="true">in</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Company */}
            <div className="lg:px-10 lg:border-l lg:border-white/[0.07]">
              <FooterCol heading="Company" links={COMPANY_LINKS} />
            </div>

            {/* Services */}
            <div className="lg:px-10 lg:border-l lg:border-white/[0.07]">
              <FooterCol heading="Services" links={SERVICE_LINKS} />
            </div>

            {/* Contact */}
            <div className="lg:pl-10 lg:border-l lg:border-white/[0.07]">
              <ContactCol />
            </div>

          </div>

          {/* Copyright row */}
          <div className="border-t border-white/[0.07] py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-[12px] text-white/30">
              &copy; {new Date().getFullYear()} InfinytTech. All rights reserved.
            </span>
            <div className="flex items-center gap-6">
              {["Privacy", "Terms", "Security"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-[12px] text-white/30 hover:text-[#e1ff51] transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  links,
}: {
  heading: string;
  links: readonly string[];
}) {
  return (
    <div>
      <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/30 mb-5">
        {heading}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-[13.5px] text-white/55 hover:text-[#e1ff51] transition-colors duration-200"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactCol() {
  return (
    <div>
      <h4 className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/30 mb-5">
        Contact
      </h4>
      <ul className="flex flex-col gap-3">
        {CONTACT_ITEMS.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-[13.5px] text-white/55 hover:text-[#e1ff51] transition-colors duration-200"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
