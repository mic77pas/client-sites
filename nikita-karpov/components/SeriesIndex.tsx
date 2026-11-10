import Link from "next/link";
import type { Category } from "@/lib/media";
import { pad2 } from "@/lib/format";
import { Photo } from "./Photo";

/** Editorial index of series: cover, title, blurb, count. */
export function SeriesIndex({ categories }: { categories: Category[] }) {
  return (
    <ul className="border-t border-rule">
      {categories.map((c, i) => (
        <li key={c.slug} className="border-b border-rule">
          <Link
            href={`/work/${c.slug}`}
            className="group -mx-3 grid grid-cols-[72px_1fr_auto] items-center gap-x-5 px-3 py-4 transition-colors hover:bg-paper-2/70 sm:grid-cols-[96px_minmax(0,3fr)_minmax(0,4fr)_auto] md:gap-x-8 md:py-5"
          >
            <Photo photo={c.coverPhoto} ratio={4 / 5} sizes="96px" className="w-full" />
            <div className="flex items-baseline gap-4">
              <span className="t-label hidden text-mute md:inline">{pad2(i + 1)}</span>
              <span className="font-serif text-[1.9rem] leading-none md:text-[2.6rem]">{c.title}</span>
            </div>
            <p className="hidden max-w-md text-[15px] leading-snug text-mute sm:block">{c.blurb}</p>
            <span className="t-label flex items-center gap-3 pr-1 text-mute group-hover:text-ink">
              {c.photos.length}
              <span aria-hidden="true" className="transition-transform duration-500 ease-out-quint group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
