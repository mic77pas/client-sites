"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Photo } from "@/lib/media";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { exifLine } from "@/lib/format";
import mediaLoader from "@/lib/image-loader";

type Ctx = { open: (id: string, trigger?: HTMLElement | null) => void };
const LightboxContext = createContext<Ctx | null>(null);

/**
 * Wrap any layout of photos. Children render on the server; only the triggers
 * and the viewer itself are client code.
 *
 * `syncUrl` mirrors the open photo into ?p=<id> so a single image can be shared.
 */
export function LightboxProvider({
  photos,
  syncUrl = false,
  children,
}: {
  photos: Photo[];
  syncUrl?: boolean;
  children: React.ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback(
    (id: string, trigger?: HTMLElement | null) => {
      const i = photos.findIndex((p) => p.id === id);
      if (i < 0) return;
      triggerRef.current = trigger ?? null;
      setIndex(i);
    },
    [photos],
  );

  const close = useCallback(() => {
    setIndex(null);
    // Return focus to the photo that opened the viewer.
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  }, []);

  // Deep link: open ?p=<id> on first load.
  useEffect(() => {
    if (!syncUrl) return;
    const id = new URLSearchParams(window.location.search).get("p");
    if (!id) return;
    const i = photos.findIndex((p) => p.id === id);
    if (i >= 0) {
      triggerRef.current = document.querySelector<HTMLElement>(`[data-photo="${CSS.escape(id)}"]`);
      queueMicrotask(() => setIndex(i));
    }
  }, [syncUrl, photos]);

  useEffect(() => {
    if (!syncUrl) return;
    const url = new URL(window.location.href);
    const current = url.searchParams.get("p");
    const next = index === null ? null : photos[index].id;
    if (current === next) return;
    if (next) url.searchParams.set("p", next);
    else url.searchParams.delete("p");
    window.history.replaceState(window.history.state, "", url);
  }, [index, photos, syncUrl]);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      {index !== null ? <Viewer photos={photos} index={index} setIndex={setIndex} onClose={close} /> : null}
    </LightboxContext.Provider>
  );
}

/** Makes its children open the viewer at `id`. */
export function PhotoTrigger({
  id,
  title,
  className = "",
  style,
  children,
}: {
  id: string;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const ctx = useContext(LightboxContext);
  return (
    <button
      type="button"
      data-photo={id}
      onClick={(e) => ctx?.open(id, e.currentTarget)}
      className={`group block w-full cursor-zoom-in text-left ${className}`}
      style={style}
    >
      {children}
      <span className="sr-only">{`${title}, view full screen`}</span>
    </button>
  );
}

// ------------------------------------------------------------------ viewer ---

const CHROME = 148; // px of top + bottom bars around the image on desktop

function Viewer({
  photos,
  index,
  setIndex,
  onClose,
}: {
  photos: Photo[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const photo = photos[index];
  const n = photos.length;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);

  const prev = useCallback(() => setIndex((index - 1 + n) % n), [index, n, setIndex]);
  const next = useCallback(() => setIndex((index + 1) % n), [index, n, setIndex]);

  // Scroll lock, initial focus.
  useEffect(() => {
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    const prevPad = root.style.paddingRight;
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = prevOverflow;
      root.style.paddingRight = prevPad;
    };
  }, []);

  // Keyboard: arrows, Escape, and keep Tab inside the dialog.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  // Warm the cache for neighbours so stepping through feels instant.
  useEffect(() => {
    const w = Math.min(2048, Math.ceil(window.innerWidth * (window.devicePixelRatio || 1)));
    for (const p of [photos[(index + 1) % n], photos[(index - 1 + n) % n]]) {
      const img = new window.Image();
      img.decoding = "async";
      img.src = mediaLoader({ src: p.src, width: w });
    }
  }, [index, n, photos]);

  const ar = photo.width / photo.height;
  // Height-bound when the viewport is wider than the photo; width-bound otherwise.
  const sizes = `(min-aspect-ratio: ${photo.width}/${photo.height}) calc((100vh - ${CHROME}px) * ${ar.toFixed(3)}), 100vw`;
  const meta = exifLine(photo.exif);
  const where = [photo.place, photo.exif?.year].filter(Boolean).join(", ");

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      data-lenis-prevent=""
      aria-label={`Photo ${index + 1} of ${n}: ${photo.title}`}
      className="fixed inset-0 z-[100] flex flex-col bg-night text-night-fg"
    >
      {/* top bar */}
      <div className="wrap flex h-14 shrink-0 items-center justify-between">
        <p className="t-label text-night-mute">{photo.category.title}</p>
        <p className="sr-only" aria-live="polite">{`Photo ${index + 1} of ${n}: ${photo.title}`}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-night-mute transition-colors hover:text-night-fg"
        >
          <X aria-hidden="true" strokeWidth={1.5} className="size-6" />
        </button>
      </div>

      {/* stage */}
      <div
        className="relative min-h-0 flex-1 touch-pan-y select-none"
        onPointerDown={(e) => {
          swipe.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={(e) => {
          const s = swipe.current;
          swipe.current = null;
          if (!s) return;
          const dx = e.clientX - s.x;
          const dy = e.clientY - s.y;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) (dx < 0 ? next : prev)();
        }}
      >
        <Image
          key={photo.id}
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          preload
          draggable={false}
          placeholder="blur"
          blurDataURL={photo.blurDataURL}
          className="lb-in object-contain px-(--gutter) md:px-20"
        />

        {/* large invisible hit areas on desktop; visible arrows */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="group absolute inset-y-0 left-0 hidden w-1/4 cursor-w-resize items-center justify-start pl-5 md:flex"
        >
          <ArrowLeft
            aria-hidden="true"
            strokeWidth={1.25}
            className="size-7 text-night-mute transition-[color,translate] duration-500 ease-out-quint group-hover:-translate-x-1 group-hover:text-night-fg"
          />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="group absolute inset-y-0 right-0 hidden w-1/4 cursor-e-resize items-center justify-end pr-5 md:flex"
        >
          <ArrowRight
            aria-hidden="true"
            strokeWidth={1.25}
            className="size-7 text-night-mute transition-[color,translate] duration-500 ease-out-quint group-hover:translate-x-1 group-hover:text-night-fg"
          />
        </button>
      </div>

      {/* caption */}
      <div className="wrap flex shrink-0 items-end justify-between gap-6 py-4 md:min-h-[92px] md:py-5">
        <div className="min-w-0">
          <p className="t-wide text-[1.4rem] leading-tight">
            {photo.title}
            {where ? <span className="text-night-mute">, {where}</span> : null}
          </p>
          {meta ? <p className="t-label mt-2 truncate text-night-mute">{meta}</p> : null}
        </div>
        <div className="-mr-3 flex shrink-0 md:hidden">
          <button type="button" onClick={prev} aria-label="Previous photo" className="inline-flex h-11 w-11 items-center justify-center">
            <ArrowLeft aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </button>
          <button type="button" onClick={next} aria-label="Next photo" className="inline-flex h-11 w-11 items-center justify-center">
            <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
