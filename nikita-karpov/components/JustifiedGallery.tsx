"use client";

import { useEffect, useRef, useState } from "react";
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
 * Server render uses a CSS flex approximation; after mount the exact layout
 * takes over. Must sit inside a <LightboxProvider> that includes these photos.
 */
export function JustifiedGallery({ photos, eager = 0 }: { photos: PhotoData[]; eager?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ width: number; vw: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const width = Math.floor(entry.contentRect.width);
      setBox((b) => (b && b.width === width ? b : { width, vw: window.innerWidth }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const item = (p: PhotoData, i: number, style: React.CSSProperties, sizes: string) => (
    <li key={p.id} style={style}>
      <PhotoTrigger id={p.id} title={p.title}>
        <Photo photo={p} preload={i < eager} sizes={sizes} />
      </PhotoTrigger>
    </li>
  );

  if (!box || box.width === 0) {
    return (
      <div ref={ref}>
        <ul className="justified" role="list">
          {photos.map((p, i) => {
            const ar = p.width / p.height;
            return item(
              p,
              i,
              { "--ar": ar.toFixed(4) } as React.CSSProperties,
              `(max-width: 640px) ${Math.min(100, Math.round(ar * 55))}vw, ${Math.round(ar * 400)}px`,
            );
          })}
        </ul>
      </div>
    );
  }

  const gap = gapFor(box.vw);
  const rows = layout(photos, box.width, targetRowHeight(box.vw), gap);
  let n = 0;
  return (
    <div ref={ref} className="flex flex-col" style={{ gap }}>
      {rows.map((row, r) => (
        <ul key={r} role="list" className="flex" style={{ gap }}>
          {row.items.map((p) => {
            const w = (p.width / p.height) * row.height;
            return item(p, n++, { width: w, flex: "none" }, `${Math.ceil(w)}px`);
          })}
        </ul>
      ))}
    </div>
  );
}
