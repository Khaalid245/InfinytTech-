"use client";

const PATH =
  "M 260 130 C 292 48,452 48,472 130 C 452 212,292 212,260 130 C 228 212,68 212,48 130 C 68 48,228 48,260 130 Z";

const NODES = [
  { x: 371, y:  72, label: "Plan",    anchor: "middle" as const, dx:   0, dy: -22 },
  { x: 472, y: 130, label: "Build",   anchor: "start"  as const, dx:  18, dy:   0 },
  { x: 371, y: 188, label: "Test",    anchor: "middle" as const, dx:   0, dy:  24 },
  { x: 149, y: 188, label: "Deploy",  anchor: "middle" as const, dx:   0, dy:  24 },
  { x:  48, y: 130, label: "Monitor", anchor: "end"    as const, dx: -18, dy:   0 },
  { x: 149, y:  72, label: "Iterate", anchor: "middle" as const, dx:   0, dy: -22 },
];

const MONO = "var(--font-jakarta, 'Plus Jakarta Sans', sans-serif)";

export default function InfinityWorkflow() {
  return (
    <div style={{ width: "100%" }}>
      <svg
        viewBox="0 0 520 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", overflow: "visible" }}
        aria-hidden="true"
      >
        <defs>
          {/* Motion path */}
          <path id="wf-motion-path" d={PATH} />

          {/* Ambient bg glow */}
          <radialGradient id="wf-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#b4cc41" stopOpacity="0.18" />
            <stop offset="55%"  stopColor="#b4cc41" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#b4cc41" stopOpacity="0"    />
          </radialGradient>

          {/* Path glow filters — four passes of depth */}
          <filter id="glow-xxl" x="-60%" y="-120%" width="220%" height="340%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <filter id="glow-lg" x="-25%" y="-80%" width="150%" height="260%">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-md" x="-12%" y="-50%" width="124%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="dot-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* ── Background ambient glow ── */}
        <ellipse cx="260" cy="130" rx="245" ry="115" fill="url(#wf-bg)" />

        {/* ── Path — four glow layers ── */}
        {/* Layer 1: very wide haze */}
        <path d={PATH} stroke="rgba(180,204,65,0.07)" strokeWidth="28" filter="url(#glow-xxl)" />
        {/* Layer 2: medium halo */}
        <path d={PATH} stroke="rgba(180,204,65,0.14)" strokeWidth="10" filter="url(#glow-lg)"  />
        {/* Layer 3: tight glow */}
        <path d={PATH} stroke="rgba(180,204,65,0.22)" strokeWidth="4"  filter="url(#glow-md)"  />
        {/* Layer 4: crisp base line */}
        <path d={PATH} stroke="rgba(180,204,65,0.35)" strokeWidth="1.5" />

        {/* ── Moving chartreuse segment ── */}
        <path
          d={PATH}
          stroke="#d6ec3e"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength="1000"
          strokeDasharray="55 945"
          strokeDashoffset="0"
          opacity="0.9"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0" to="-1000"
            dur="9s"
            repeatCount="indefinite"
          />
        </path>

        {/* ── Nodes ── */}
        {/* Outer pulsing rings */}
        {NODES.map(({ x, y, label }) => (
          <circle
            key={`${label}-ring-outer`}
            cx={x} cy={y} r={20}
            stroke="rgba(180,204,65,0.14)"
            strokeWidth="1"
            fill="none"
            className="node-ring"
          />
        ))}
        {/* Inner rings */}
        {NODES.map(({ x, y, label }) => (
          <circle
            key={`${label}-ring-inner`}
            cx={x} cy={y} r={10}
            stroke="rgba(180,204,65,0.28)"
            strokeWidth="1"
            fill="none"
          />
        ))}
        {/* Dot fill */}
        {NODES.map(({ x, y, label }) => (
          <circle
            key={`${label}-dot`}
            cx={x} cy={y} r={5}
            fill="#b4cc41"
            opacity="0.9"
          />
        ))}

        {/* ── Labels ── */}
        {NODES.map(({ x, y, label, anchor, dx, dy }) => (
          <text
            key={`${label}-text`}
            x={x + dx}
            y={y + dy}
            textAnchor={anchor}
            dominantBaseline="middle"
            style={{
              fill: "rgba(245,245,240,0.55)",
              fontSize: "11px",
              fontFamily: MONO,
              letterSpacing: "0.12em",
            }}
          >
            {label.toUpperCase()}
          </text>
        ))}

        {/* Center crossing marker */}
        <circle cx="260" cy="130" r="3.5" fill="#b4cc41" opacity="0.5" />

        {/* ── Comet trail ── */}
        <circle r="3" fill="rgba(225,255,81,0.22)">
          <animateMotion dur="9s" begin="-8.5s" repeatCount="indefinite">
            <mpath href="#wf-motion-path" />
          </animateMotion>
        </circle>
        <circle r="4.5" fill="rgba(225,255,81,0.42)">
          <animateMotion dur="9s" begin="-8.75s" repeatCount="indefinite">
            <mpath href="#wf-motion-path" />
          </animateMotion>
        </circle>

        {/* ── Leading dot — halo + glow core ── */}
        <circle r="22" fill="rgba(225,255,81,0.05)">
          <animateMotion dur="9s" begin="0s" repeatCount="indefinite">
            <mpath href="#wf-motion-path" />
          </animateMotion>
        </circle>
        <g filter="url(#dot-glow)">
          <circle r="6.5" fill="#e1ff51">
            <animateMotion dur="9s" begin="0s" repeatCount="indefinite">
              <mpath href="#wf-motion-path" />
            </animateMotion>
          </circle>
        </g>
      </svg>
    </div>
  );
}
