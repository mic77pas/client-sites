import Link from "next/link";
import {
  BsCameraReels,
  BsCameraReelsFill,
  BsChevronCompactDown,
  BsChevronDoubleDown,
} from "react-icons/bs";
import { LuClapperboard } from "react-icons/lu";
import { PiFilmReel } from "react-icons/pi";
import { LogoLoop } from "./LogoLoop";
import { CurvedLoop } from "./CurvedLoop";

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

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-black" />

      <div className="items-center z-40 h-fit w-full flex flex-col gap-4 p-8 pb-12">
        <h1 className="text-white font-montserrat text-6xl text-shadow-[0_2px_3px_rgba(0,0,0,0.5)]">
          K&F Video Production
        </h1>
        <p className="font-montserrat text-[18px] text-white font-normal text-center text-shadow-[0_2px_3px_rgba(0,0,0,0.5)] tracking-normal">
          Cinematic Video Production for Brands & Creators
        </p>
        {/* <p className="font-sans text-[18px] text-white text-center text-shadow-[0_2px_3px_rgba(0,0,0,0.5)] tracking-normal">
          A Toronto-based studio crafting cinematic stories that help brands
          showcase their strengths, connect with audiences, and stand out
          through powerful visual storytelling
        </p> */}
        <div className="flex flex-row gap-6">
          <Link href="/" className="btn-primary px-12 gap-3">
            <BsCameraReels size={18} />
            Reel
          </Link>
          <Link href="/" className="btn-primary gap-3">
            <LuClapperboard size={20} />
            Projects
          </Link>
        </div>

        {/* <CurvedLoop
          marqueeText="Be ✦ Creative ✦ With ✦ React ✦ Bits ✦"
          speed={2}
          curveAmount={70}
          direction="right"
          className="custom-text-style text-6xl w-full"
        /> */}

        {/* <LogoLoop
          logos={imageLogos}
          speed={100}
          direction="left"
          logoHeight={60}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          fadeOutColor="transparent"
          ariaLabel="Technology partners"
        /> */}
        {/* <BsChevronDoubleDown
          className="text-white animate-bounce scale-x-220"
          size={30}
        /> */}
      </div>
    </div>
  );
}
