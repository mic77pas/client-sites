"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

/**
 * Smooth (inertial) scrolling plus parallax for the page it's mounted on.
 *
 * Parallax hooks, set as attributes in the markup:
 *   data-speed="0.1"   the element lags behind the scroll by 10% (negative = runs ahead)
 *   data-drift="0.06"  on a photo frame (see Photo.tsx): the image slides inside the
 *                      frame by up to 6% of its height, so the crop shifts as it passes
 *
 * Every offset is zero when the element sits in the middle of the screen (or, for
 * elements that start in the first screen, at the top of the page), so the layout
 * is exactly as designed at rest. Skipped entirely for reduced-motion visitors.
 * Wheel scrolling inside anything marked data-lenis-prevent (lightbox, mobile menu)
 * is left alone.
 */

type Item =
  | { kind: "speed"; el: HTMLElement; speed: number; center: number; h: number }
  | { kind: "drift"; el: HTMLElement; img: HTMLElement; amount: number; center: number; h: number };

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.085, anchors: true });
    let items: Item[] = [];
    let vh = window.innerHeight;

    const apply = (y: number) => {
      for (const it of items) {
        // Distance scrolled past the point where this element is centred on screen.
        const d = y - Math.max(0, it.center - vh / 2);
        if (Math.abs(d) > vh + it.h) continue; // well off screen: leave it be
        if (it.kind === "speed") {
          it.el.style.translate = `0 ${(d * it.speed).toFixed(1)}px`;
        } else {
          const p = Math.max(-1, Math.min(1, d / ((vh + it.h) / 2)));
          it.img.style.translate = `0 ${(p * it.amount * 100).toFixed(2)}%`;
        }
      }
    };

    const measure = () => {
      vh = window.innerHeight;
      const factor = window.innerWidth < 768 ? 0.5 : 1;
      // Clear offsets first so nested parallax elements are measured at rest.
      document.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => (el.style.translate = ""));
      const y = window.scrollY;
      const next: Item[] = [];
      document.querySelectorAll<HTMLElement>("[data-speed]").forEach((el) => {
        const r = el.getBoundingClientRect();
        next.push({ kind: "speed", el, speed: Number(el.dataset.speed) * factor, center: r.top + y + r.height / 2, h: r.height });
      });
      document.querySelectorAll<HTMLElement>("[data-drift]").forEach((el) => {
        const img = el.querySelector("img");
        if (!img) return;
        const amount = Number(el.dataset.drift) * factor;
        img.style.scale = String(1 + 2 * amount); // enough overscan that the edges never show
        const r = el.getBoundingClientRect();
        next.push({ kind: "drift", el, img, amount, center: r.top + y + r.height / 2, h: r.height });
      });
      items = next;
      apply(y);
    };

    measure();
    lenis.on("scroll", ({ scroll }: Lenis) => apply(scroll));

    let raf = requestAnimationFrame(function loop(t) {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    });

    // Re-measure when the layout changes size (resize, fonts, late content).
    let queued = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(measure);
    });
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(queued);
      ro.disconnect();
      lenis.destroy();
      for (const it of items) {
        if (it.kind === "speed") it.el.style.translate = "";
        else {
          it.img.style.translate = "";
          it.img.style.scale = "";
        }
      }
    };
  }, []);

  return null;
}
