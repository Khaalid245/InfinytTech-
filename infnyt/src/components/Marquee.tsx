const STACK = [
  "React", "Next.js", "TypeScript", "Node.js", "Python",
  "PostgreSQL", "AWS", "Figma", "OpenAI", "TailwindCSS", "Docker", "Supabase",
];

const ITEMS = [...STACK, ...STACK];

export default function Marquee() {
  return (
    <div
      className="relative overflow-hidden py-5 border-y"
      style={{
        background: "transparent",
        borderColor: "rgba(245,245,240,0.06)",
      }}
    >
      <div className="marquee-track flex gap-0 whitespace-nowrap">
        {ITEMS.map((item, i) => (
          <span key={i} className="shrink-0 flex items-center">
            <span
              className="text-[11px] font-medium tracking-[0.14em] uppercase"
              style={{ color: "rgba(245,245,240,0.35)" }}
            >
              {item}
            </span>
            <span
              className="mx-8 text-[10px]"
              style={{ color: "rgba(180,204,65,0.35)" }}
              aria-hidden="true"
            >
              ·
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
