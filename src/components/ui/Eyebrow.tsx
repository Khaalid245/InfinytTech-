import { ReactNode } from "react";

interface EyebrowProps {
  children: ReactNode;
  center?: boolean;
}

export default function Eyebrow({ children, center }: EyebrowProps) {
  return (
    <span className={`eyebrow${center ? " center" : ""}`}>{children}</span>
  );
}
