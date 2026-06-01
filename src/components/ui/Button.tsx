import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "teal" | "submit" | "outline";
type Arrow = "right" | "diag" | "none";

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  arrow?: Arrow;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

export default function Button({
  children,
  variant = "primary",
  arrow = "right",
  href,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  const isBadge = variant === "primary" || variant === "secondary";
  const arrowChar = arrow === "diag" ? "↗" : "→";

  const inner = (
    <>
      <span>{children}</span>
      {isBadge && arrow !== "none" && (
        <span className="arr-badge" aria-hidden="true">
          {arrowChar}
        </span>
      )}
      {!isBadge && arrow !== "none" && (
        <span aria-hidden="true">{arrowChar}</span>
      )}
    </>
  );

  const cls = `btn btn-${variant === "outline" ? "outline-pill" : variant} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}
