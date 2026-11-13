"use client";

import { useEffect, useRef, useState } from "react";
import { LOGOS, type Brand } from "./kit/logos";
import type { KitHandle } from "./kit/scene";
import type { KitId } from "./kit/models";

/** Cameras and lenses, as recorded in the portfolio's own EXIF data. */
const kit: { id: KitId; brand: Brand; model: string; kind: string }[] = [
  { id: "a6700", brand: "sony", model: "α6700", kind: "Camera" },
  { id: "eos7d", brand: "canon", model: "EOS 7D", kind: "Camera" },
  { id: "sigma1850", brand: "sigma", model: "18–50mm F2.8", kind: "Zoom lens" },
  { id: "sony50", brand: "sony", model: "50mm F1.8", kind: "Prime lens" },
  { id: "sony70200", brand: "sony", model: "70–200mm F4", kind: "Telephoto lens" },
  { id: "sony1650", brand: "sony", model: "16–50mm", kind: "Zoom lens" },
];

/** Spoken name and drawn height per brand; heights are trimmed by eye so the three marks weigh the same. */
const BRANDS: Record<Brand, { name: string; height: number }> = {
  sony: { name: "Sony", height: 9.5 },
  canon: { name: "Canon", height: 12.5 },
  sigma: { name: "Sigma", height: 9.5 },
};

/** The maker's wordmark. Sony and Sigma take the text colour; Canon keeps its red. */
function BrandMark({ brand }: { brand: Brand }) {
  const { box, d, color, evenOdd } = LOGOS[brand];
  const { height } = BRANDS[brand];
  return (
    <svg
      aria-hidden
      viewBox={box.join(" ")}
      height={height}
      width={(height * box[2]) / box[3]}
      fill={color ?? "currentColor"}
      className="block"
    >
      <path d={d} fillRule={evenOdd ? "evenodd" : undefined} />
    </svg>
  );
}

/**
 * The gear bar: a row of names with a 3D model standing above each one. The
 * models are built in code (components/kit/models.ts) and three.js is only
 * downloaded when the bar is about to scroll into view. Without WebGL the
 * model row collapses and the names remain as a plain list.
 */
export function KitShowcase() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const handle = useRef<KitHandle | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        import("./kit/scene")
          .then(({ mountKit }) => {
            if (cancelled || !canvas.current) return;
            const slots = Array.from(el.querySelectorAll<HTMLElement>("[data-kit-slot]"));
            handle.current = mountKit(
              canvas.current,
              slots,
              kit.map((k) => k.id),
              { reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches },
            );
            setState("ready");
          })
          .catch(() => {
            if (!cancelled) setState("failed");
          });
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      handle.current?.dispose();
      handle.current = null;
    };
  }, []);

  useEffect(() => {
    handle.current?.setActive(active);
  }, [active, state]);

  const failed = state === "failed";

  return (
    <div ref={stage} className="relative">
      {!failed && (
        <canvas
          ref={canvas}
          aria-hidden
          className={`pointer-events-none absolute -inset-x-4 -inset-y-6 h-[calc(100%+48px)] w-[calc(100%+32px)] transition-opacity duration-700 ${
            state === "ready" ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      <ul className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
        {kit.map((k, i) => {
          const on = active === i;
          const dim = active !== null && !on;
          return (
            <li key={k.id}>
              <button
                type="button"
                aria-pressed={on}
                aria-label={`${BRANDS[k.brand].name} ${k.model}, ${k.kind}`}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setActive((a) => (a === i ? null : a))}
                onFocus={() => setActive(i)}
                onBlur={() => setActive((a) => (a === i ? null : a))}
                onClick={() => setActive(i)}
                className="group block w-full cursor-default text-left outline-offset-4"
              >
                {!failed && <span data-kit-slot className="block aspect-[5/4]" />}
                <span
                  className={`block border-t pt-3 transition-[border-color,opacity] duration-300 ${
                    on ? "border-ink" : "border-rule"
                  } ${dim ? "opacity-45" : ""}`}
                >
                  <span className="flex h-4 items-center">
                    <BrandMark brand={k.brand} />
                  </span>
                  <span className="t-wide mt-1 block text-[1.05rem] leading-snug">{k.model}</span>
                  <span
                    className={`t-label mt-1 block text-mute transition-opacity duration-300 ${
                      on ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {k.kind}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
