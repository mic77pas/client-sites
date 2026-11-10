import Link from "next/link";
import type { Category } from "@/lib/media";

/** Series filter — plain links, so every view is a real, shareable URL. */
export function CategoryNav({ categories, active, total }: { categories: Category[]; active?: string; total: number }) {
  const items = [{ href: "/work", label: "All", count: total, key: "all" }].concat(
    categories.map((c) => ({ href: `/work/${c.slug}`, label: c.title, count: c.photos.length, key: c.slug })),
  );
  return (
    <nav aria-label="Series" className="-mx-(--gutter) overflow-x-auto px-(--gutter) [scrollbar-width:none]">
      <ul className="flex min-w-max gap-x-7 border-b border-rule">
        {items.map((it) => {
          const current = (active ?? "all") === it.key;
          return (
            <li key={it.key}>
              <Link
                href={it.href}
                aria-current={current ? "page" : undefined}
                className={`-mb-px flex items-baseline gap-2 border-b py-3.5 text-[15px] transition-colors ${
                  current ? "border-ink text-ink" : "border-transparent text-mute hover:text-ink"
                }`}
              >
                {it.label}
                <span className="t-label text-[10.5px]">{it.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
