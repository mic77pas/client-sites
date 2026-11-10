import Link from "next/link";
import { nav, site } from "@/content/site";
import { Mark } from "./Mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="wrap grid gap-10 py-12 md:grid-cols-12 md:py-16">
        <div className="md:col-span-5">
          <Mark className="w-14 text-ink" />
          <p className="mt-5 max-w-xs text-[15px] text-mute">
            {site.role}. Based in {site.location}.
          </p>
        </div>
        <nav aria-label="Footer" className="md:col-span-3">
          <p className="t-label mb-4 text-mute">Pages</p>
          <ul className="space-y-1.5 text-[15px]">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-line">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="t-label mb-4 text-mute">Elsewhere</p>
          <ul className="space-y-1.5 text-[15px]">
            <li>
              <a href={`mailto:${site.email}`} className="link-line">
                {site.email}
              </a>
            </li>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="link-line">
                  {s.label} <span className="text-mute">{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap">
        <div className="flex justify-between gap-4 border-t border-rule py-5 text-mute">
          <p className="t-label">© {new Date().getFullYear()} {site.name}</p>
          <p className="t-label">Toronto, ON</p>
        </div>
      </div>
    </footer>
  );
}
