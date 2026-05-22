"use client";
import { useState, useEffect } from "react";

const TEXT = "your customers depend on.";
const CHAR_MS  = 55;   // ms per character
const START_MS = 400;  // delay before typing begins

export function TypewriterAccent() {
  const [len, setLen] = useState(0);
  const done = len === TEXT.length;

  useEffect(() => {
    const start = setTimeout(() => {
      const tick = setInterval(() => {
        setLen(l => {
          if (l >= TEXT.length) { clearInterval(tick); return l; }
          return l + 1;
        });
      }, CHAR_MS);
      return () => clearInterval(tick);
    }, START_MS);
    return () => clearTimeout(start);
  }, []);

  return (
    <span style={{ color: "#D4FF3A" }}>
      {TEXT.slice(0, len)}
      {!done && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "2px",
            height: "0.82em",
            background: "#D4FF3A",
            verticalAlign: "middle",
            marginLeft: "2px",
            borderRadius: "1px",
          }}
        />
      )}
    </span>
  );
}
