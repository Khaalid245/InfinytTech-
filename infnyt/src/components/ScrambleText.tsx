"use client";
import { useEffect, useState } from "react";

// Technical charset — mixes uppercase alpha, digits, and engineering symbols
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/|\\._-:#@";

interface Props {
  text: string;
  /** ms to wait before scramble begins */
  delay?: number;
  /** ms between each character locking into its final value */
  lockInterval?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrambleText({
  text,
  delay = 0,
  lockInterval = 58,
  className,
  style,
}: Props) {
  // null = not yet started (renders at opacity:0 to reserve layout height)
  const [display, setDisplay] = useState<string | null>(null);

  useEffect(() => {
    let raf: number;

    const startTimer = setTimeout(() => {
      const t0 = performance.now();

      const tick = () => {
        const elapsed = performance.now() - t0;
        const chars = text.split("").map((char, i) => {
          if (char === " ") return " ";
          const lockAt = i * lockInterval;
          if (elapsed >= lockAt + lockInterval) return char; // locked
          return CHARSET[Math.floor(Math.random() * CHARSET.length)];
        });
        setDisplay(chars.join(""));

        if (elapsed < text.length * lockInterval + lockInterval) {
          raf = requestAnimationFrame(tick);
        } else {
          setDisplay(text);
        }
      };

      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, lockInterval]);

  return (
    <span
      className={className}
      style={{ ...style, opacity: display === null ? 0 : 1, transition: "opacity 0.08s" }}
    >
      {/* real text always rendered — reserves layout space even before animation */}
      {display ?? text}
    </span>
  );
}
