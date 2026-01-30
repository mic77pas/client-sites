import Image from "next/image";
import Link from "next/link";

export default function Intro() {
  return (
    <section
      id="top"
      className="
        relative flex min-h-[100svh] flex-col items-center
        justify-start md:justify-center
        px-6 sm:pt-28 md:pt-0
      "
    >
      <div className="w-full max-w-5xl text-center text-shadow-[0_6px_2px_rgba(0,0,0,1)]">
        <Image
          src="/logo.png"
          alt="Nik Karpov logo"
          width={260}
          height={70}
          priority
          className="mx-auto -mb-6 select-none w-[200px] sm:w-[230px] md:w-[260px]"
        />

        <h1
          className="
            font-montserrat font-semibold text-white whitespace-nowrap
            tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.25em]
            text-[2.2rem] sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem]
          "
        >
          NIK KARPOV
        </h1>

        <p
          className="
            text-[10px] sm:text-xs text-white/75 whitespace-nowrap
            tracking-[0.22em] sm:tracking-[0.28em] md:tracking-[0.35em]
          "
        >
          PHOTOGRAPHY • VIDEOGRAPHY • EDITING
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 flex-nowrap">
        <Link href="#work" className="btn whitespace-nowrap">
          View Portfolio
        </Link>
        <Link href="#contact" className="btn btn-outline whitespace-nowrap">
          Contact Me
        </Link>
      </div>
    </section>
  );
}
