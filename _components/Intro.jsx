import { Montserrat, Caprasimo } from "next/font/google";
import Image from "next/image";

export default function Intro() {
  return (
    <main className="flex flex-col items-center justify-center w-full min-h-screen text-shadow-[0_6px_2px_rgba(0,0,0,1)]">
      <Image src="/logo.png" alt="nick" width={300} height={80} className="-mb-10"/>
      <h1 className="font-montserrat font-semibold tracking-[10px] text-6xl text-white text-center">
        NIK KARPOV
      </h1>
      {/* <p className="font-montserrat text-2xl font-bold mt-3 text-white">
        Photographer & Creator
      </p> */}
      <nav className="flex flex-row space-x-4 mt-6 text-md">
        <button className="btn">View Portfolio</button>
        <button className="btn">Contact Me</button>
      </nav>
    </main>
  );
}

{/* <h1 className={`${caprasimo.className} text-8xl font-bold text-white`}>
        Nikita Karpov
      </h1> */}