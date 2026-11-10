"use client";

/**
 * Light/dark switch. The current theme is resolved purely in CSS (see the
 * `dark:` variant in globals.css), so the icon is correct on first paint with
 * no hydration flicker. Picking the theme that matches the OS clears the saved
 * choice, so the site goes back to following the system.
 */
export const THEME_KEY = "nk-theme";

const COLORS = { light: "#efece6", dark: "#141311" } as const;

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
      {/* moon (shown in light mode) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.5] transition-transform duration-500 ease-out-quint group-hover:-rotate-12 dark:hidden"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
      </svg>
      {/* sun (shown in dark mode) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="hidden h-[18px] w-[18px] fill-none stroke-current stroke-[1.5] transition-transform duration-500 ease-out-quint group-hover:rotate-45 dark:block"
      >
        <circle cx="12" cy="12" r="4" />
        <path
          d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
