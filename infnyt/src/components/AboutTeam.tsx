import Image from "next/image";
import { Eyebrow } from "./ui";
import SpiderLines from "./SpiderLines";

const TEAM = [
  {
    name: "Khalid Mohamud",
    area: "Design & Frontend",
    bio: "Turns rough product ideas into interfaces that actually ship — focused on clarity, usability, and clean frontend code.",
  },
  {
    name: "Khalid Sh. Xareed",
    area: "Backend Development",
    bio: "The systems layer no one sees until something breaks. Builds the APIs and infrastructure that let product teams move fast without fearing the backend.",
  },
  {
    name: "Mohamed Abdifatah",
    area: "AI & Automation",
    bio: "Takes the workflows eating your team's time and replaces them with AI systems that actually run in production — not just demos.",
  },
  {
    name: "Abid Yusuf",
    area: "Marketing",
    bio: "Writes the words and shapes the strategy that make technical products land with the people who buy them.",
  },
];

export default function AboutTeam() {
  return (
    <section className="relative overflow-hidden py-24" style={{ background: "transparent" }}>

      {/* Dark teal overlay */}
      <div className="pointer-events-none absolute inset-0" style={{ background: "rgba(0, 20, 26, 0.88)" }} aria-hidden="true" />

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

        <div className="flex flex-col gap-3.5 max-w-145 mb-16">
          <Eyebrow>The team</Eyebrow>
          <h2 className="text-[36px] lg:text-[40px] font-extrabold tracking-tight leading-[1.1] text-white">
            The people{" "}
            <span style={{ color: "#e1ff51" }}>behind the work</span>.
          </h2>
        </div>

        {/* Open 4-column hairline grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 border-t border-white/[0.07]">
          {TEAM.map(({ name, area, bio }, index) => (
            <ProfilePanel key={name} name={name} area={area} bio={bio} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

function ProfilePanel({
  name,
  area,
  bio,
  index,
}: {
  name: string;
  area: string;
  bio: string;
  index: number;
}) {
  const mdRight   = index % 2 === 1;
  const xlRight   = index === 3;

  return (
    <div
      className={[
        "group relative flex flex-col border-b border-white/[0.07] overflow-hidden",
        "transition-colors duration-500 ease-out hover:bg-white/1.5",
        !mdRight  ? "md:border-r md:border-white/[0.07]"  : "",
        !xlRight  ? "xl:border-r xl:border-white/[0.07]"  : "",
        mdRight   ? "md:border-r-0" : "",
      ].join(" ")}
    >
      {/* Chartreuse top accent — fills on hover */}
      <span
        className="absolute top-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500 ease-out z-10"
        style={{ background: "linear-gradient(90deg, transparent, #e1ff51 50%, transparent)" }}
        aria-hidden="true"
      />

      {/* Chartreuse bloom on hover */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
        style={{
          background: "radial-gradient(ellipse 80% 35% at 50% 0%, rgba(225,255,81,0.05) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Photo */}
      <div className="w-full h-64 overflow-hidden shrink-0">
        <Image
          src="/khalid.jpg"
          alt={name}
          width={400}
          height={533}
          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
        />
      </div>

      {/* Hairline between photo and text */}
      <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.07)" }} aria-hidden="true" />

      {/* Text content */}
      <div className="relative z-10 flex flex-col gap-1.5 p-6">
        <p
          className="font-mono text-[10px] tracking-[0.14em] uppercase mb-1"
          style={{ color: "#e1ff51" }}
        >
          {area}
        </p>
        <h3 className="text-[15px] font-semibold tracking-tight text-white transition-colors duration-300 ease-out group-hover:text-[#e1ff51]">
          {name}
        </h3>
        <p className="text-[12.5px] leading-relaxed text-white/55 mt-1">
          {bio}
        </p>
      </div>
    </div>
  );
}
