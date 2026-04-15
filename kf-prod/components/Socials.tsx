"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Youtube,
  Instagram,
  Facebook,
  Linkedin,
  Music2,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { IoLogoYoutube } from "react-icons/io";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaVimeoV,
} from "react-icons/fa";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const defaultLinks = [
  {
    name: "YouTube",
    href: "https://www.youtube.com/@KFVideoProductionToronto",
    icon: IoLogoYoutube,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/kfvideo/",
    icon: FaInstagram,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/KfVideoProductions/",
    icon: FaFacebook,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/k-f-video-productions/",
    icon: FaLinkedinIn,
  },
  { name: "TikTok", href: "https://www.tiktok.com/@kfvideo", icon: FaTiktok },
  {
    name: "Vimeo",
    href: "https://vimeo.com/user8522331?fl=pp&fe=sh",
    icon: FaVimeoV,
  },
  { name: "X", href: "https://x.com/kfvideo", icon: FaXTwitter },
];

export default function SocialDrawer() {
  const [open, setOpen] = useState(false);
  const links = useMemo(() => defaultLinks, []);

  return (
    <div className="fixed -right-3 top-1/2 z-50 -translate-y-1/2 overflow-visible">
      <motion.div
        initial={false}
        animate={{ x: open ? 0 : 80 }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
        className="relative flex items-center"
      >
        <div
          aria-label={
            open ? "Close social links panel" : "Open social links panel"
          }
          onClick={() => setOpen((prev) => !prev)}
          className="absolute cursor-pointer left-0 top-1/2 z-10 flex h-28 w-8 -translate-x-full -translate-y-1/2 items-center justify-center rounded-l-3xl rounded-r-none bg-orange/60 transition hover:brightness-110 pointer-cursor"
        >
          <div className="flex items-center gap-1 ml-1 ">
            <span className="h-12 w-1 rounded-full bg-[#dd8a4d]" />
            <span className="h-12 w-1 rounded-full bg-[#dd8a4d]" />
          </div>
        </div>

        <aside className="mr-3 rounded-l-[2rem] bg-orange/60 px-3 py-4 ">
          <div className="flex flex-col gap-3">
            {links.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                aria-label={name}
                target="_blank"
                rel="noreferrer"
                className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange text-white transition hover:scale-105 hover:bg-[#c86a2e] active:scale-95"
              >
                <Icon size={34} />
                {/* strokeWidth={2.25} */}
              </a>
            ))}
          </div>
        </aside>
      </motion.div>
    </div>
  );
}
