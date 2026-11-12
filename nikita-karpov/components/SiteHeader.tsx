"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
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
      className={`sticky top-0 z-50 transition-[background-color,backdrop-filter] duration-300 ${
        scrolled && !open ? "bg-paper/80 backdrop-blur-md backdrop-saturate-150" : "bg-paper"
      }`}
    >
      <div className="wrap flex h-(--header-h) items-center justify-between">
        <Link href="/" className="group flex items-center gap-3" aria-label={`${site.name}, home`}>
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
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <X aria-hidden="true" strokeWidth={1.5} className="size-[22px]" />
            ) : (
              <Menu aria-hidden="true" strokeWidth={1.5} className="size-[22px]" />
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        data-lenis-prevent=""
        className="fixed inset-x-0 bottom-0 top-(--header-h) overflow-y-auto bg-paper md:hidden"
      >
        <nav aria-label="Mobile" className="wrap flex min-h-full flex-col justify-between pb-10 pt-8">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="t-wide block py-4 text-[2.25rem] leading-none aria-[current=page]:text-mute"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-12 space-y-3 text-[15px]">
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-3 py-1">
                <SocialIcon name="email" className="h-5 w-5 text-mute" />
                <span>{site.email}</span>
              </a>
            </li>
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${s.label}: ${s.handle}`}
                  className="flex items-center gap-3 py-1"
                >
                  <SocialIcon name={s.icon} className="h-5 w-5 text-mute" />
                  <span>{s.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
