import Image from "next/image";
import Link from "next/link";
import TrueFocus from "../components/TrueFocus";

export default function Intro() {
  return (
    <section
      id="top"
      className="relative flex flex-col min-h-[100svh] items-center justify-center px-6"
    >
      <div className="w-full max-w-4xl text-center text-shadow-[0_6px_2px_rgba(0,0,0,1)]">
        <Image
          src="/logo.png"
          alt="Nik Karpov logo"
          width={320}
          height={90}
          priority
          className="mx-auto -mb-8 select-none"
        />
        {/* <TrueFocus
          sentence="NIK KARPOV"
          manualMode
          blurAmount={3}
          borderColor="#ffffff"
          animationDuration={0.5}
          pauseBetweenAnimations={1}
          className="font-montserrat font-semibold tracking-[10px] text-5xl sm:text-6xl md:text-7xl text-white"
        /> */}

        <h1 className="font-montserrat font-semibold tracking-[10px] text-5xl sm:text-6xl md:text-7xl text-white">
          NIK KARPOV
        </h1>
        <p className="mt-4 text-xs sm:text-sm tracking-[0.35em] text-white/75">
          PHOTOGRAPHY • VIDEOGRAPHY • EDITING
        </p>
      </div>
      <div className="items-center justify-center">
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="#work" className="btn">
            View Portfolio
          </Link>
          <Link href="#contact" className="btn btn-outline">
            Contact Me
          </Link>
        </div>
      </div>
    </section>
  );
}
