import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/lib/media";
import { Photo } from "./Photo";

/**
 * Index of series: cover, title, blurb. No dividers: rows are separated by space,
 * and hovering one dims the others so the row under the pointer stands out.
 */
export function SeriesIndex({ categories }: { categories: Category[] }) {
  return (
    <ul className="group/list space-y-3 md:space-y-4">
      {categories.map((c) => (
        <li
          key={c.slug}
          className="transition-opacity duration-500 ease-out-quint group-has-[a:hover]/list:opacity-35 has-[a:hover]:opacity-100!"
        >
          <Link
            href={`/work/${c.slug}`}
            className="group grid grid-cols-[72px_1fr_auto] items-center gap-x-5 py-1 sm:grid-cols-[96px_minmax(0,3fr)_minmax(0,4fr)_auto] md:gap-x-8"
          >
            <Photo photo={c.coverPhoto} ratio={4 / 5} sizes="96px" className="w-full" />
            <span className="t-wide text-[1.6rem] leading-none transition-transform duration-500 ease-out-quint group-hover:translate-x-1.5 md:text-[2.2rem]">
              {c.title}
            </span>
            <p className="hidden max-w-md text-[15px] leading-snug text-mute sm:block">{c.blurb}</p>
            <ArrowRight
              aria-hidden="true"
              strokeWidth={1.5}
              className="size-5 text-mute transition-[color,translate] duration-500 ease-out-quint group-hover:translate-x-1 group-hover:text-ink"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
