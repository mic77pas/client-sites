import Link from "next/link";
import type { Category } from "@/lib/media";

/** Series filter: plain links, so every view is a real, shareable URL. */
export function CategoryNav({ categories, active }: { categories: Category[]; active?: string }) {
  const items = [{ href: "/work", label: "All", key: "all" }].concat(
    categories.map((c) => ({ href: `/work/${c.slug}`, label: c.title, key: c.slug })),
  );
  return (
    <nav aria-label="Series" className="-mx-(--gutter) overflow-x-auto px-(--gutter) [scrollbar-width:none]">
      <ul className="flex min-w-max gap-x-7">
        {items.map((it) => {
          const current = (active ?? "all") === it.key;
          return (
            <li key={it.key}>
              <Link
                href={it.href}
                aria-current={current ? "page" : undefined}
                className={`link-line block py-1 text-[15px] transition-colors ${current ? "text-ink" : "text-mute hover:text-ink"}`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
