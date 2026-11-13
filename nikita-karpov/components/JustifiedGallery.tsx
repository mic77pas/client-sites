"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Photo as PhotoData } from "@/lib/media";
import { Photo } from "./Photo";
import { PhotoTrigger } from "./Lightbox";

/** Target row height by viewport width — mirrors the CSS fallback in globals.css. */
function targetRowHeight(vw: number) {
  if (vw >= 1600) return 400;
  if (vw >= 1024) return 340;
  if (vw >= 640) return 260;
  return 200;
}
const gapFor = (vw: number) => Math.round(Math.min(12, Math.max(6, vw * 0.008)));

type Row = { items: PhotoData[]; height: number };

/** Greedy justified layout: fill each row to the exact width; let a nearly-full last row stretch a little. */
function layout(photos: PhotoData[], width: number, target: number, gap: number): Row[] {
  const rows: Row[] = [];
  let row: PhotoData[] = [];
  let sum = 0;
  for (const p of photos) {
    const ar = p.width / p.height;
    row.push(p);
    sum += ar;
    const natural = sum * target + gap * (row.length - 1);
    if (natural >= width) {
      const hWith = (width - gap * (row.length - 1)) / sum;
      const hWithout = row.length > 1 ? (width - gap * (row.length - 2)) / (sum - ar) : Infinity;
      if (Math.abs(hWithout - target) < Math.abs(hWith - target)) {
        // Closing the row before this photo lands nearer the target height.
        rows.push({ items: row.slice(0, -1), height: hWithout });
        row = [p];
        sum = ar;
      } else {
        rows.push({ items: row, height: hWith });
        row = [];
        sum = 0;
      }
    }
  }
  if (row.length) {
    const fit = (width - gap * (row.length - 1)) / sum;
    rows.push({ items: row, height: Math.min(fit, target * 1.35) });
  }
  return rows;
}

/**
 * Rows that fill the width while every photo keeps its own proportions.
 * Server render uses a CSS flex approximation; on the client the exact layout
 * is measured before first paint. Both layouts are the same single list with the
 * same keyed items, so switching between them never re-mounts (and so never
 * re-flashes) a photo. Tiles fade up in a short cascade as they scroll into view.
 * Must sit inside a <LightboxProvider> that includes these photos.
 */
export function JustifiedGallery({ photos, eager = 0 }: { photos: PhotoData[]; eager?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [box, setBox] = useState<{ width: number; vw: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = (w: number) => {
      const width = Math.floor(w);
      setBox((b) => (b && b.width === width ? b : { width, vw: window.innerWidth }));
    };
    update(el.clientWidth); // synchronous, so client navigations paint the exact layout first
    const ro = new ResizeObserver(([entry]) => update(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Reveal: tiles start hidden (CSS, only when JS runs and motion is allowed) and
  // are marked in as they cross into view; each batch is staggered left to right.
  useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty("--d", `${Math.min(n++, 8) * 70}ms`);
          el.dataset.in = "";
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -6% 0px" },
    );
    ul.querySelectorAll<HTMLElement>(":scope > .tile:not([data-in])").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [photos]);

  const exact = box && box.width > 0 ? box : null;
  const gap = exact ? gapFor(exact.vw) : 0;
  const widths = new Map<string, number>();
  if (exact) {
    for (const row of layout(photos, exact.width, targetRowHeight(exact.vw), gap)) {
      for (const p of row.items) widths.set(p.id, (p.width / p.height) * row.height);
    }
  }

  return (
    <div ref={ref}>
      <ul
        ref={list}
        role="list"
        className={exact ? "flex flex-wrap" : "justified"}
        style={exact ? { gap } : undefined}
      >
        {photos.map((p, i) => {
          const ar = p.width / p.height;
          const w = widths.get(p.id);
          // Each width is trimmed by a hair so rounding can never push the last
          // photo of a row onto the next line; the next row's first photo never fits
          // in what's left, so rows break exactly where the layout put them.
          const style: React.CSSProperties =
            w !== undefined ? { width: w - 0.05, flex: "none" } : ({ "--ar": ar.toFixed(4) } as React.CSSProperties);
          const sizes =
            w !== undefined
              ? `${Math.ceil(w)}px`
              : `(max-width: 640px) ${Math.min(100, Math.round(ar * 55))}vw, ${Math.round(ar * 400)}px`;
          return (
            <li key={p.id} className="tile" style={style}>
              <PhotoTrigger id={p.id} title={p.title}>
                <Photo photo={p} preload={i < eager} sizes={sizes} />
              </PhotoTrigger>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
