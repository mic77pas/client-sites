"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CategoryNav } from "./CategoryNav";

type Item = { slug: string; title: string; blurb: string };

const ALL = {
  title: "Work",
  blurb: "Photographs by series. Select any image to see it full screen, along with how it was made.",
};

/**
 * Title, blurb and series nav for /work and /work/<slug>. It lives in the work
 * layout, so it stays mounted while switching series: the nav underline slides
 * across, and only the title and blurb are swapped, rising in through a mask
 * (the same motion as the home intro) instead of the whole page redrawing.
 */
export function WorkHeader({ categories }: { categories: Item[] }) {
  const slug = usePathname().split("/")[2];
  const cat = slug ? categories.find((c) => c.slug === slug) : undefined;
  const ref = useRef<HTMLElement>(null);

  // Arriving from far down the page (e.g. "Next series"): start at the top so
  // the new title is the first thing seen.
  useEffect(() => {
    const el = ref.current;
    if (el && el.getBoundingClientRect().bottom < 0) window.scrollTo({ top: 0 });
  }, [slug]);

  if (slug && !cat) return null; // unknown series: leave the 404 on its own
  const { title, blurb } = cat ?? ALL;
  const key = cat?.slug ?? "all";

  return (
    <header ref={ref} className="wrap pb-8 pt-10 md:pt-16">
      <h1 key={key} className="t-display" aria-label={title}>
        {title.split(" ").map((word, i) => (
          <span key={i} aria-hidden>
            {i > 0 ? " " : null}
            <span className="intro-mask">
              <span className="intro-word" style={{ "--i": i } as React.CSSProperties}>
                {word}
              </span>
            </span>
          </span>
        ))}
      </h1>
      <p key={`${key}-blurb`} className="intro-rise t-lede mt-6 max-w-xl text-ink-2 [--d:220ms]">
        {blurb}
      </p>
      <div className="mt-10">
        <CategoryNav categories={categories} active={cat?.slug} />
      </div>
    </header>
  );
}
