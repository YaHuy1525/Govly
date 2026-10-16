import React from "react";

export function Container({
  children,
  maxWidth,
  className = "",
}: {
  children: React.ReactNode;
  maxWidth?: number;
  className?: string;
}) {
  return (
    <div className={`container ${className}`} style={maxWidth ? { maxWidth } : undefined}>
      {children}
    </div>
  );
}

export function Section({
  children,
  bg,
  className = "",
  id,
}: {
  children: React.ReactNode;
  bg?: "soft" | "grey";
  className?: string;
  id?: string;
}) {
  const bgClass = bg === "soft" ? " section--soft" : bg === "grey" ? " section--grey" : "";
  return (
    <section id={id} className={`section${bgClass} ${className}`}>
      {children}
    </section>
  );
}

export function Button({
  children,
  href,
  variant = "primary",
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const cls = `btn btn--${variant}`;
  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
