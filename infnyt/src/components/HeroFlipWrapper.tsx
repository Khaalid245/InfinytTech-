"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Wraps the hero in a 200vh scroll container.
 * The hero is sticky (height: 100vh).
 * As the user scrolls through the extra 100vh, the hero folds away
 * like a book page (rotateY from 0° → -90°) revealing the next section.
 *
 * The flip starts once the user has used 50% of the extra scroll space,
 * and completes when the extra space is exhausted.
 */
export default function HeroFlipWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pageRef    = useRef<HTMLDivElement>(null);
  const shadowRef  = useRef<HTMLDivElement>(null);
  const curlRef    = useRef<HTMLDivElement>(null);
  const raf        = useRef<number>(0);

  const tick = useCallback(() => {
    const wrapper = wrapperRef.current;
    const page    = pageRef.current;
    const shadow  = shadowRef.current;
    const curl    = curlRef.current;
    if (!wrapper || !page || !shadow || !curl) return;

    const vh         = window.innerHeight;
    // Extra scroll space = wrapper height − one viewport
    const extra      = wrapper.offsetHeight - vh;
    const scrollY    = Math.max(0, window.scrollY);
    const progress   = Math.min(1, scrollY / extra);        // 0 → 1

    // Flip starts at 50 % progress, completes at 100 %
    const raw  = Math.max(0, (progress - 0.5) / 0.5);
    // Ease-in-out cubic for cinematic feel
    const t    = raw < 0.5
      ? 4 * raw * raw * raw
      : 1 - Math.pow(-2 * raw + 2, 3) / 2;

    const angle = t * -90;                     // 0° → -90° (top folds backward)

    page.style.transform  = `perspective(2200px) rotateX(${angle}deg)`;
    shadow.style.opacity  = String(t * 0.80);
    curl.style.opacity    = String(t * 0.55);
    curl.style.height     = `${t * 22}%`;
  }, []);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", tick,     { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", tick);
      cancelAnimationFrame(raf.current);
    };
  }, [onScroll, tick]);

  return (
    /* 200 vh — gives 100 vh of scroll room for the flip */
    <div ref={wrapperRef} style={{ height: "200vh" }}>
      <div
        ref={pageRef}
        style={{
          position:        "sticky",
          top:             0,
          height:          "100vh",
          transformOrigin: "bottom center",
          willChange:      "transform",
        }}
      >
        {children}

        {/* Flat dark shadow — deepens as page rotates */}
        <div
          ref={shadowRef}
          style={{
            position:      "absolute",
            inset:         0,
            background:    "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.08) 100%)",
            opacity:       0,
            pointerEvents: "none",
            zIndex:        202,
          }}
        />

        {/* Bottom-edge curl highlight — simulates page peeling backward */}
        <div
          ref={curlRef}
          style={{
            position:      "absolute",
            bottom:        0,
            left:          0,
            width:         "100%",
            height:        "0%",
            background:    "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 100%)",
            opacity:       0,
            pointerEvents: "none",
            zIndex:        203,
          }}
        />
      </div>
    </div>
  );
}
