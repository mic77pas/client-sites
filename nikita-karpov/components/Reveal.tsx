"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** Direction it travels in from. */
  from?: "up" | "left" | "right";
  /** Extra wait once in view, in ms (for staggering siblings). */
  delay?: number;
  className?: string;
};

/**
 * Fades and slides its content in the first time it scrolls into view. Hidden
 * only via CSS gated on `html.js` and motion being allowed (see .reveal in
 * globals.css), so without JS or with reduced motion it simply shows.
 */
export function Reveal({ children, from = "up", delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.dataset.in = "";
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-from={from}
      className={`reveal ${className}`}
      style={delay ? ({ "--d": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
