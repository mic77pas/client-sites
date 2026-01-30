import Image from "next/image";
import Link from "next/link";

export default function Intro() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-6"
    >
      <div className="w-full max-w-5xl text-center text-shadow-[0_6px_2px_rgba(0,0,0,1)]">
        {/* LOGO — slightly smaller & responsive */}
        <Image
          src="/logo.png"
          alt="Nik Karpov logo"
          width={260} // smaller base
          height={70}
          priority
          className="mx-auto -mb-6 select-none
                     w-[200px] sm:w-[230px] md:w-[260px]"
        />

        {/* NAME — always one line */}
        <h1
          className="
            font-montserrat font-semibold tracking-[0.25em] text-white
            whitespace-nowrap
            text-[2.2rem] sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem]
          "
        >
          NIK KARPOV
        </h1>

        <p className=" text-[10px] sm:text-xs tracking-[0.35em] text-white/75 whitespace-nowrap">
          PHOTOGRAPHY • VIDEOGRAPHY • EDITING
        </p>
      </div>

      {/* BUTTONS — NEVER STACK */}
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
