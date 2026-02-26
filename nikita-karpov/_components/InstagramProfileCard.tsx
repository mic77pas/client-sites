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
  ...props
}: InstagramProfileCardProps) {
  return (
    <a
      href={`https://www.instagram.com/${username}/`}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-1 items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10 transition"
    >
      <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/20">
        <Image
          src={avatarSrc}
          alt={`${name} avatar`}
          fill
          className="object-cover"
        />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-white text-[14px] truncate">
            {name}
          </p>
          <span className="text-white group-hover:text-white/70 transition">
            <BsInstagram size={16} />
          </span>
        </div>
        <p className="text-sm text-white/70 truncate">@{username}</p>
        {subtitle ? (
          <p className="text-xs text-white/50 truncate mt-0.5">{subtitle}</p>
        ) : null}
      </div>
    </a>
  );
}
