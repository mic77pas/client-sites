"use client";

import { Moon, Sun } from "lucide-react";

/**
 * Light/dark switch. The current theme is resolved purely in CSS (see the
 * `dark:` variant in globals.css), so the icon is correct on first paint with
 * no hydration flicker. Picking the theme that matches the OS clears the saved
 * choice, so the site goes back to following the system.
 */
export const THEME_KEY = "nk-theme";

const COLORS = { light: "#f3f3f1", dark: "#121212" } as const;

export function ThemeToggle({ className = "" }: { className?: string }) {
  function toggle() {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = (root.dataset.theme as "light" | "dark" | undefined) ?? (systemDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      if ((next === "dark") === systemDark) localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable — choice lasts for this page view */
    }
    // Browser UI colour: our own tag, first in <head>, overrides Next's media-query tags.
    let meta = document.getElementById("nk-theme-color") as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.id = "nk-theme-color";
      document.head.prepend(meta);
    }
    meta.content = COLORS[next];
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`group relative -m-2 inline-flex h-10 w-10 items-center justify-center text-ink ${className}`}
    >
      <span className="sr-only dark:hidden">Switch to dark mode</span>
      <span className="sr-only hidden dark:inline">Switch to light mode</span>
      <Moon
        aria-hidden="true"
        strokeWidth={1.5}
        className="size-[18px] transition-transform duration-500 ease-out-quint group-hover:-rotate-12 dark:hidden"
      />
      <Sun
        aria-hidden="true"
        strokeWidth={1.5}
        className="hidden size-[18px] transition-transform duration-500 ease-out-quint group-hover:rotate-45 dark:block"
      />
    </button>
  );
}
