"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      if (!dotRef.current) return;
      dotRef.current.style.left = `${e.clientX}px`;
      dotRef.current.style.top  = `${e.clientY}px`;
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button"))
        dotRef.current?.classList.add("cursor-grow");
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest("a, button"))
        dotRef.current?.classList.remove("cursor-grow");
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);

    return () => {
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      className="cursor-dot"
      style={{ left: "-9999px", top: "-9999px" }}
    />
  );
}
