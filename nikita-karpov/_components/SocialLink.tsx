import React from "react";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import { IoIosArrowRoundForward } from "react-icons/io";

type Props = {
  href: string;
  title: string;
  subtitle: string;

  // icon on the right of title
  icon: React.ReactNode;

  // images
  backgroundSrc: string;
  avatarSrc?: string; // defaults to backgroundSrc

  // link behavior
  external?: boolean; // default true
  className?: string;

  // Next/Image sizes
  bgSizes?: string;
  avatarSizes?: string;
};

export default function SocialLinkCard({
  href,
  title,
  subtitle,
  icon,
  backgroundSrc,
  avatarSrc,
  external = true,
  className = "",
  bgSizes = "(max-width: 768px) 100vw, 400px",
  avatarSizes = "48px",
}: Props) {
  const rel = external ? "noreferrer" : undefined;
  const target = external ? "_blank" : undefined;

  const finalAvatarSrc = avatarSrc ?? backgroundSrc;

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={[
        "group justify-between relative flex w-full items-center gap-4 overflow-hidden rounded-2xl",
        "border border-white/30 bg-linear-to-b from-black to-transparent px-5 py-3 transition hover:from-black/80",
        className,
      ].join(" ")}
    >
      <div className="flex flex-row items-center gap-4">
        {/* Blurred stretched background */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={backgroundSrc}
            alt=""
            fill
            className="object-cover scale-110 blur-sm opacity-80 transition duration-500 group-hover:scale-125 group-hover:opacity-75"
            sizes={bgSizes}
          />
          <div className="absolute inset-0 " />
        </div>

        {/* Avatar */}
        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/20">
          <Image
            src={finalAvatarSrc}
            alt={`${title} avatar`}
            fill
            className="object-cover"
            sizes={avatarSizes}
          />
        </div>

        {/* Text */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-white transition group-hover:text-white/70 drop-shadow-[0_4px_8px_#000000]">
              {icon}
            </span>
          </div>
        </div>
      </div>

      <span className="flex flex-row gap-2 items-center">
        <p className="truncate text-sm text-white/80">{subtitle}</p>
        <IoIosArrowRoundForward size={20} />
      </span>
    </a>
  );
}
