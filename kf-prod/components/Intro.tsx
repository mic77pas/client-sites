import Link from "next/link";
import {
  BsCameraReels,
  BsCameraReelsFill,
  BsCameraVideo,
  BsChevronCompactDown,
  BsChevronDoubleDown,
} from "react-icons/bs";
import { LuClapperboard } from "react-icons/lu";
import { PiFilmReel } from "react-icons/pi";
import { LogoLoop } from "./LogoLoop";
import { FaPlay } from "react-icons/fa";
import Image from "next/image";

const imageLogos = [
  {
    src: "/logos/tire.png",
    alt: "Company 1",
    href: "https://company1.com",
  },
  {
    src: "/logos/montana.jpg",
    alt: "Company 2",
    href: "https://company2.com",
  },
  {
    src: "/logos/company3.png",
    alt: "Company 3",
    href: "https://company3.com",
  },
];

export default function Intro() {
  return (
    <div className="flex items-end justify-center min-h-screen overflow-hidden bg-black">
      {/* Vimeo Background */}
      <div className="absolute inset-0 overflow-hidden">
        <iframe
          src="https://player.vimeo.com/video/796183598?background=1&autoplay=1&loop=1&muted=1&autopause=0"
          className="absolute inset-0 h-full w-full scale-120 bg-linear-to-b from-transparent to-black"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Dark Overlay
      <div className="absolute inset-0 bg-black/60" /> */}

      <div className="flex flex-row gap-8 z-40 pb-12">
        <Link href="/" className="btn-primary px-12 gap-3">
          <BsCameraVideo size={22} />
          Reel
        </Link>
        <Link href="/" className="btn-primary gap-3">
          <LuClapperboard size={20} />
          Projects
        </Link>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-black" />

      {/* <div className="items-start z-40 h-fit w-full flex flex-col gap-4 p-12">
        <div className="flex flex-row gap-4">
          <Image
            src="/kf.png"
            alt="Logo"
            width={60}
            height={50}
            unoptimized
            className="transition-opacity duration-300 group-hover:opacity-0"
          />
          <h1 className="text-white font-montserrat text-6xl text-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
            Video Production
          </h1>
        </div>

        <p className="font-montserrat text-[18px] text-[#dddddd] font-bold text-center text-shadow-[0_2px_3px_rgba(0,0,0,0.5)] tracking-normal">
          Cinematic Video Production for Brands & Creators
        </p>

        <div className="flex flex-row gap-4">
          <Link href="/" className="btn-primary px-12 gap-3">
            <BsCameraVideo size={22} />
            Reel
          </Link>
          <Link href="/" className="btn-primary gap-3">
            <LuClapperboard size={20} />
            Projects
          </Link>
        </div>
      </div> */}
    </div>
  );
}
