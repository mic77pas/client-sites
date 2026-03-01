"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Video, Mail } from "lucide-react";
import scrollToId from "./scrollToId";

type Item = {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

const items: Item[] = [
  { id: "about", label: "about", Icon: User },
  { id: "work", label: "work", Icon: Video },
  { id: "contact", label: "contact", Icon: Mail },
];

export default function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full -translate-x-1/2 md:hidden">
      <div className="flex items-center justify-between rounded-t-3xl border border-white/15 bg-black/40 px-2 py-2 backdrop-blur-md shadow-lg shadow-black/30">
        {/* Logo / Home */}
        <button
          onClick={() => scrollToId("top")}
          aria-label="Home"
          className="flex h-12 w-16 items-center justify-center transition active:scale-[0.97] cursor-pointer"
        >
          <Image
            src="/nick2.png"
            alt="Nik Karpov"
            width={36}
            height={36}
            className="object-contain"
          />
        </button>

        {/* Icons */}
        {items.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => scrollToId(id)}
            aria-label={label}
            className="flex h-12 w-16 items-center justify-center transition active:scale-[0.97] cursor-pointer"
          >
            <Icon size={22} className="text-white/80" />
          </button>
        ))}
      </div>
    </nav>
  );
}
