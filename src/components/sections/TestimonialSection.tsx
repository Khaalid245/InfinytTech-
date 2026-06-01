import type { CSSProperties } from "react";
import Image from "next/image";
import Eyebrow from "@/components/ui/Eyebrow";
import ConnectCTA from "@/components/sections/ConnectCTA";

interface TestimonialProps {
  image: string;
  name: string;
  role: string;
  quote: string;
  accent: string;
}

function Testimonial({ image, name, role, quote, accent }: TestimonialProps) {
  return (
    <div className="testimonial" style={{ "--tm-accent": accent } as CSSProperties}>
      <span className="open">&ldquo;</span>
      <span className="close">&rdquo;</span>
      <p className="quote">{quote}</p>
      <div className="div" />
      <div className="author">
        <Image
          src={image}
          alt={name}
          width={48}
          height={48}
          className="av"
          style={{ objectFit: "cover", borderRadius: "999px" }}
        />
        <div>
          <div className="name">{name}</div>
          <div className="role">{role}</div>
        </div>
      </div>
    </div>
  );
}

const TESTIMONIALS: TestimonialProps[] = [
  {
    image: "/testimonial1-img.png",
    name: "Abdirahman Yusuf",
    role: "VP Engineering, Dalmar Labs",
    accent: "#3B82F6",
    quote: "They delivered real impact. The team moved faster than any vendor we have worked with — and the platform they built has scaled through three product launches.",
  },
  {
    image: "/testimonial2-img.png",
    name: "Fadumo Hassan",
    role: "Head of Product, Xoriyo Tech",
    accent: "#3B82F6",
    quote: "The discovery work alone paid for the engagement. They told us the truth about what we were trying to build and helped us cut the scope by half.",
  },
  {
    image: "/testimonial3-img.png",
    name: "Mohamed Abdi",
    role: "CTO, Jubba Digital",
    accent: "#3B82F6",
    quote: "Senior engineers, clear communication, no theater. We treat them as part of our core team and they have earned every bit of that trust.",
  },
];

export default function TestimonialSection() {
  return (
    <section className="section tm-section">
      <div className="container">
        <div className="section-head" style={{ marginBottom: 40 }}>
          <Eyebrow>What clients say</Eyebrow>
          <h2 className="h2">
            Real teams, <span className="accent">real impact</span>.
          </h2>
        </div>
        <div className="grid-3">
          {TESTIMONIALS.map((t) => (
            <Testimonial key={t.name} {...t} />
          ))}
        </div>
        <ConnectCTA />
      </div>
    </section>
  );
}
