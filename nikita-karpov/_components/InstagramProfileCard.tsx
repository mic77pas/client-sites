import Image from "next/image";
import { BsInstagram } from "react-icons/bs";

type InstagramProfileCardProps = {
  username: string; // e.g. "nikkarpov"
  name: string; // e.g. "Nik Karpov"
  avatarSrc: string; // e.g. "/ig-avatar.jpg" (put in /public)
  subtitle?: string; // e.g. "Photography • Videography"
};

export default function InstagramProfileCard({
  username,
  name,
  avatarSrc,
  subtitle,
}: InstagramProfileCardProps) {
  return (
    <a
      href={`https://www.instagram.com/${username}/`}
      target="_blank"
      rel="noreferrer"
      className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-3 transition hover:bg-white/10"
    >
      {/* Blurred stretched background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={avatarSrc}
          alt=""
          fill
          className="object-cover scale-110 blur-md opacity-80 transition duration-500 group-hover:scale-125 group-hover:opacity-75"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Avatar */}
      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/20">
        <Image
          src={avatarSrc}
          alt={`${name} avatar`}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>

      {/* Text */}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate text-[14px] font-semibold text-white">
            {name}
          </p>
          <span className="text-white transition group-hover:text-white/70">
            <BsInstagram size={16} />
          </span>
        </div>
        <p className="truncate text-sm text-white/70">@{username}</p>
        {subtitle && (
          <p className="mt-0.5 truncate text-xs text-white/50">{subtitle}</p>
        )}
      </div>
    </a>
  );
}
