"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { User, Grid3X3, Video, Mail } from "lucide-react";

type Item = {
  href: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

const items: Item[] = [
  { href: "#about", label: "About", Icon: User },
  { href: "#work", label: "Work", Icon: Video },
  { href: "#contact", label: "Contact", Icon: Mail },
];

export default function MobileNav() {
  const [active, setActive] = useState<string>("#top");

  useEffect(() => {
    const ids = items.map((i) => i.href.replace("#", ""));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // pick the most visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0),
          )[0];

        if (visible?.target?.id) setActive(`#${visible.target.id}`);
      },
      {
        // tune for your header + bottom nav
        root: null,
        threshold: [0.15, 0.3, 0.5],
      },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 md:hidden">
      <div className="flex items-center justify-between rounded-t-3xl border border-white/15 bg-black/40 px-2 py-2 backdrop-blur-md shadow-lg shadow-black/30">
        {/* Logo / Home */}
        <Link
          href="#top"
          className={[
            "flex h-12 w-16 items-center justify-center rounded-xl transition",
            "hover:bg-white/10 active:scale-[0.98]",
            active === "#top" ? "bg-white/10" : "",
          ].join(" ")}
        >
          <Image
            src="/nick2.png" // or your logo.png
            alt="Nik Karpov"
            width={36}
            height={36}
            className="object-contain"
          />
        </Link>

        {/* Other icons */}
        {items.map(({ href, label, Icon }) => {
          const isActive = active === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              className={[
                "flex h-12 w-16 items-center justify-center rounded-xl transition",
                "hover:bg-white/10 active:scale-[0.98]",
                isActive ? "bg-white/10" : "",
              ].join(" ")}
            >
              <Icon
                size={22}
                className={isActive ? "text-white" : "text-white/70"}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
