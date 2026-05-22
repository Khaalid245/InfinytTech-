"use client";
import { useState, useEffect } from "react";

const VALUES = ["15ms", "18ms", "17ms", "21ms", "16ms", "19ms", "14ms", "18ms"];

export function LiveLatency() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % VALUES.length);
        setFading(false);
      }, 180);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ transition: "opacity 0.18s ease", opacity: fading ? 0 : 1 }}>
      {VALUES[idx]}
    </span>
  );
}
