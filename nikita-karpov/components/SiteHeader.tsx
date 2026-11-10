"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { Mark } from "./Mark";
import { SocialIcon } from "./SocialIcon";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 bg-paper transition-[border-color] duration-300 border-b ${
        scrolled || open ? "border-rule" : "border-transparent"
      }`}
    >
      <div className="wrap flex h-(--header-h) items-center justify-between">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name} — home`}>
          <Mark className="w-10 text-ink transition-transform duration-500 ease-out-quint group-hover:-rotate-6" />
          <span className="text-[15px] font-medium tracking-tight">{site.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden md:flex md:items-center md:gap-9">
          <ul className="flex items-center gap-9 text-[15px]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="link-line py-1"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="h-4 w-px bg-rule" />
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="t-label -mr-2 px-2 py-3"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-(--header-h) overflow-y-auto bg-paper md:hidden"
      >
        <nav aria-label="Mobile" className="wrap flex min-h-full flex-col justify-between pb-10 pt-8">
          <ul>
            {nav.map((item, i) => (
              <li key={item.href} className="border-b border-rule">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-baseline justify-between py-4"
                >
                  <span className="font-serif text-[2.6rem] leading-none">{item.label}</span>
                  <span className="t-label text-mute">0{i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 space-y-4 text-[15px]">
            <a href={`mailto:${site.email}`} className="flex items-center gap-3">
              <SocialIcon name="email" />
              <span className="underline underline-offset-4">{site.email}</span>
            </a>
            <ul className="flex gap-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${s.label} (${s.handle})`}
                    className="flex h-11 w-11 items-center justify-center border border-rule text-ink transition-colors hover:border-ink"
                  >
                    <SocialIcon name={s.icon} className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
