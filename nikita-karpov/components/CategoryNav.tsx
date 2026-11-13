"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";

export type NavCategory = { slug: string; title: string };

/**
 * Series filter: plain links, so every view is a real, shareable URL. One
 * underline slides between items: it follows the pointer and settles back on
 * the current series, so switching categories reads as one continuous motion.
 */
export function CategoryNav({ categories, active }: { categories: NavCategory[]; active?: string }) {
  const items = [{ href: "/work", label: "All", key: "all" }].concat(
    categories.map((c) => ({ href: `/work/${c.slug}`, label: c.title, key: c.slug })),
  );
  const current = active ?? "all";
  const [hover, setHover] = useState<string | null>(null);
  const target = hover ?? current;

  const nav = useRef<HTMLElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const links = useRef(new Map<string, HTMLAnchorElement>());
  const [bar, setBar] = useState<{ x: number; w: number; animate: boolean } | null>(null);

  // Measure before paint so the bar never shows in a stale spot.
  useLayoutEffect(() => {
    const place = (animate: boolean) => {
      const el = links.current.get(target);
      if (!el) return;
      const x = el.offsetLeft;
      const w = el.offsetWidth;
      // Unchanged geometry keeps the current state, so the observer's first call
      // (made right after this one) can't cancel the slide in progress.
      setBar((b) => (b && b.x === x && b.w === w ? b : { x, w, animate: animate && b !== null }));
    };
    place(true);
    // Widths change once the web font arrives, or when the window resizes.
    const ro = new ResizeObserver(() => place(false));
    if (list.current) ro.observe(list.current);
    return () => ro.disconnect();
  }, [target]);

  // On narrow screens the row scrolls sideways: bring the current series into view.
  useLayoutEffect(() => {
    const el = links.current.get(current);
    const box = nav.current;
    if (!el || !box || box.scrollWidth <= box.clientWidth) return;
    const left = el.offsetLeft - box.clientWidth / 2 + el.offsetWidth / 2;
    box.scrollTo({ left, behavior: "smooth" });
  }, [current]);

  return (
    <nav
      ref={nav}
      aria-label="Series"
      className="-mx-(--gutter) overflow-x-auto px-(--gutter) [scrollbar-width:none]"
      onMouseLeave={() => setHover(null)}
    >
      <ul ref={list} className="relative flex min-w-max gap-x-7 pb-px">
        {items.map((it) => {
          const on = current === it.key;
          return (
            <li key={it.key}>
              <Link
                ref={(el) => {
                  if (el) links.current.set(it.key, el);
                  else links.current.delete(it.key);
                }}
                href={it.href}
                aria-current={on ? "page" : undefined}
                onMouseEnter={() => setHover(it.key)}
                onFocus={() => setHover(it.key)}
                onBlur={() => setHover(null)}
                className={`block py-1 text-[15px] transition-colors duration-300 ${on || hover === it.key ? "text-ink" : "text-mute"}`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
        <li
          aria-hidden
          role="presentation"
          className="pointer-events-none absolute bottom-0 left-0 h-px w-px origin-left bg-current"
          style={
            bar
              ? {
                  transform: `translateX(${bar.x}px) scaleX(${bar.w})`,
                  transition: bar.animate ? "transform 550ms var(--ease-out-quint)" : "none",
                }
              : { opacity: 0 }
          }
        />
      </ul>
    </nav>
  );
}
