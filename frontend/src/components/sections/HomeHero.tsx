"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const PROOF_AVATARS = [
  { src: "/testimonial1-img.png", alt: "Client" },
  { src: "/testimonial2-img.png", alt: "Client" },
  { src: "/testimonial3-img.png", alt: "Client" },
  { src: "/testimonial4-img.png", alt: "Client" },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 7h10M8 3l4 4-4 4" />
    </svg>
  );
}

export default function HomeHero() {
  return (
    <section className="hero2">
      <div className="hero2-overlay" aria-hidden="true" />

      {/* Glow left — slow float */}
      <motion.div
        className="hero2-glow-left"
        aria-hidden="true"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 9, ease: "easeInOut", repeat: Infinity }}
      />

      {/* Glow right streak — counter-drift */}
      <motion.div
        className="hero2-glow-br"
        aria-hidden="true"
        animate={{ y: [0, 16, 0], x: [0, -8, 0] }}
        transition={{ duration: 11, ease: "easeInOut", repeat: Infinity, delay: 1.2 }}
      >
        <svg viewBox="0 0 500 720" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
          <defs>
            <filter id="rb1" x="-80%" y="-30%" width="260%" height="160%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <filter id="rb2" x="-80%" y="-30%" width="260%" height="160%">
              <feGaussianBlur stdDeviation="22" />
            </filter>
          </defs>
          <path d="M 475 -60 C 320 90, 295 370, 490 740" stroke="rgba(96,165,250,0.74)" strokeWidth="108" strokeLinecap="round" filter="url(#rb1)" />
          <path d="M 475 -60 C 320 90, 295 370, 490 740" stroke="rgba(255,255,255,0.55)" strokeWidth="28" strokeLinecap="round" filter="url(#rb1)" />
          <path d="M 530 120 C 400 260, 385 490, 545 770" stroke="rgba(25,87,222,0.42)" strokeWidth="82" strokeLinecap="round" filter="url(#rb2)" />
        </svg>
      </motion.div>

      {/* Badge */}
      <div className="hero2-badge">
        <motion.span
          className="hero2-badge-dot"
          aria-hidden="true"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
        />
        You imagine it. We build it.
      </div>

      <h1 className="hero2-h1">
        We <span className="hero2-accent">design</span> and <span className="hero2-accent">build</span><br />
        digital experiences<br />
        that <span className="hero2-accent">deliver.</span>
      </h1>

      <p className="hero2-sub">
        From strategy and branding to software and scalable systems, every
        experience is crafted to help businesses grow, connect, and stand out.
      </p>

      <div className="hero2-cta-group">
        <Link href="/contact" className="hero2-btn-primary">
          Book a call <ArrowIcon />
        </Link>
        <Link href="/projects" className="hero2-btn-secondary">
          See our work <ArrowIcon />
        </Link>
      </div>

      <p className="hero2-trust">No commitment &nbsp;·&nbsp; Free 30-min discovery call</p>

      <div className="hero2-proof">
        <div className="hero2-proof-avatars">
          {PROOF_AVATARS.map(({ src, alt }) => (
            <div key={src} className="hero2-proof-avatar">
              <Image src={src} alt={alt} fill sizes="27px" style={{ objectFit: "cover" }} />
            </div>
          ))}
        </div>
        <span className="hero2-proof-text"><strong>Trusted by 40+</strong> businesses</span>
        <span className="hero2-proof-sep" aria-hidden="true" />
        <span className="hero2-proof-stars" aria-label="4.8 star rating">★★★★★</span>
        <span className="hero2-proof-rating">4.8</span>
      </div>
    </section>
  );
}
