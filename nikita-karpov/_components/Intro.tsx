"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import scrollToId from "./scrollToId";
import { IoBriefcase } from "react-icons/io5";
import { LuSend } from "react-icons/lu";

export default function Intro({
  containerClassName = "mx-auto w-full max-w-6xl px-6",
}: {
  containerClassName?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const STOP = 0.35;

  const MAX_SECONDS = 5 * 60; // 5 minutes

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev + 1) % MAX_SECONDS);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Track scroll progress *through this hero section*
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"], // 0 at top, 1 when section ends past top
  });

  // show viewfinder only after a tiny scroll, fully on by STOP
  const vfOpacity = useTransform(scrollYProgress, [0, 0.06, STOP], [0, 0, 1]);

  // keep it subtle and stable (optional)
  const vfScale = useTransform(
    scrollYProgress,
    [0, 0.06, STOP],
    [1.01, 1.01, 1],
  );

  // scanline moves top->bottom while viewfinder is on
  const scanY = useTransform(scrollYProgress, [0.06, STOP], ["-20%", "120%"]);

  // As you scroll, shrink + add padding + border + rounded corners
  const scale = useTransform(scrollYProgress, [0, STOP], [1, 0.85]);
  const radius = useTransform(scrollYProgress, [0, STOP], [0, 22]);
  const inset = useTransform(scrollYProgress, [0, STOP], [0, 28]);

  const borderWidth = useTransform(scrollYProgress, [0, 0.05, STOP], [0, 0, 1]);
  const borderAlpha = useTransform(
    scrollYProgress,
    [0, 0.05, STOP, 1],
    [0, 0, 0.6, 0.6],
  );
  const shadowAlpha = useTransform(
    scrollYProgress,
    [0, 0.05, STOP, 1],
    [0, 0, 0.35, 0.35],
  );

  const borderColor = useTransform(borderAlpha, (a) => `rgba(255,255,255,1)`);

  const boxShadow = useTransform(
    shadowAlpha,
    (a) => `0 18px 60px rgba(0,0,0,${a})`,
  );

  // add near your other transforms
  const CAMERA_START = 0.18; // when camera begins appearing
  const CAMERA_FULL = STOP; // fully visible by STOP

  const cameraOpacity = useTransform(
    scrollYProgress,
    [CAMERA_START, CAMERA_FULL],
    [0, 1],
  );
  const screenReveal = useTransform(
    scrollYProgress,
    [CAMERA_START, CAMERA_FULL],
    [0, 1],
  );

  // TWEAK THESE to match your PNG (in % of the overlay)
  const screenTop = "41%";
  const screenLeft = "24%";
  const screenWidth = "52%";
  const screenHeight = "32%";

  return (
    // Make this section taller than 100vh so you have room for the animation
    <section ref={ref} id="top" className="relative h-[180svh]">
      {/* Sticky container keeps the hero pinned while it transforms */}
      <div className="sticky top-0 h-[100vh] overflow-hidden">
        <motion.div
          style={{
            scale,
            borderRadius: radius,
            // "padding around it" effect using inset
            position: "absolute",
            top: inset,
            left: inset,
            right: inset,
            bottom: inset,
            borderWidth,
            borderStyle: "solid",
            borderColor,
            boxShadow,
          }}
          className="overflow-hidden will-change-transform"
        >
          {/* Video */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/nick.mp4" type="video/mp4" />
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50" />

          <motion.div
            style={{ opacity: vfOpacity, scale: vfScale }}
            className="pointer-events-none absolute inset-0 z-30"
          >
            {/* Corner frame lines */}
            <div className="absolute inset-0">
              {/* top-left */}
              <div className="absolute left-7 top-7 h-14 w-14 border-l-2 border-t-2 border-white/80" />
              {/* top-right */}
              <div className="absolute right-7 top-7 h-14 w-14 border-r-2 border-t-2 border-white/80" />
            </div>

            {/* Rule-of-thirds grid */}
            <div className="absolute inset-0">
              <div className="absolute left-1/3 top-0 h-full w-px bg-white/15" />
              <div className="absolute left-2/3 top-0 h-full w-px bg-white/15" />
              <div className="absolute top-1/3 left-0 h-px w-full bg-white/15" />
              <div className="absolute top-2/3 left-0 h-px w-full bg-white/15" />
            </div>

            {/* REC indicator */}
            <div className="absolute left-10 top-10 flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500/90 shadow-[0_0_12px_rgba(239,68,68,0.7)]" />
              <span className="text-[11px] tracking-[0.24em] text-white/85 font-semibold">
                REC
              </span>
            </div>

            {/* Tiny timestamp vibe (optional) */}
            <div className="absolute right-10 top-10 text-[11px] tracking-[0.18em] text-white/70 font-medium">
              {formatTime(seconds)}
            </div>

            {/* Scanline sweep */}
            <motion.div
              style={{ top: scanY }}
              className="absolute left-0 right-0 h-[2px] bg-white/10 blur-[0.5px]"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 flex h-full flex-col items-center justify-center px-6"
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

              <h1 className="font-montserrat font-semibold text-white whitespace-nowrap tracking-[0.14em] sm:tracking-[0.18em] md:tracking-[0.25em] text-[2.2rem] sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.6rem]">
                NIK KARPOV
              </h1>

              <p className="text-[14px] text-shadow-[0_4px_2px_rgba(0,0,0,1)] text-white/75 whitespace-nowrap tracking-[0.22em] sm:tracking-[0.28em] md:tracking-[0.35em]">
                PHOTOGRAPHY • VIDEOGRAPHY • EDITING
              </p>
            </div>

            {/* Bottom buttons inside card */}
            <div className="absolute bottom-0 left-0 right-0 hidden md:flex justify-between z-10">
              {/* <button
                onClick={() => scrollToId("work")}
                className="btn border-t border-r border-white rounded-tr-4xl whitespace-nowrap cursor-pointer"
              >
                View Portfolio
              </button> */}
              <div className="relative inline-block group">
                {/* Camera (BEHIND) */}
                <span
                  className="
      pointer-events-none absolute left-2 -top-7
      z-0
      origin-bottom-left
      opacity-0 translate-y-3 rotate-0 scale-90
      transition duration-300 ease-out
      group-hover:opacity-100
      group-hover:-translate-y-9
      group-hover:-rotate-14
      group-hover:scale-100
    "
                >
                  <Image
                    src="/camera.png"
                    alt="Camera"
                    width={120}
                    height={120}
                    className="scale-x-[-1] drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] select-none opacity-80"
                  />
                </span>

                {/* Button (ABOVE camera) */}
                <button
                  onClick={() => scrollToId("work")}
                  className="relative z-10 btn rounded-tr-4xl border-t border-r border-white whitespace-nowrap cursor-pointer flex flex-row items-center gap-2"
                >
                  <IoBriefcase size={24} />
                  My Portfolio
                </button>
              </div>
              <div className="relative inline-block group">
                {/* Item (BEHIND) */}
                <span
                  className="
      pointer-events-none absolute right-2 -top-7
      z-0
      origin-bottom-right
      opacity-0 translate-y-3 rotate-0 scale-90
      transition duration-300 ease-out
      group-hover:opacity-100
      group-hover:-translate-y-8
      group-hover:rotate-12
      group-hover:scale-100
    "
                >
                  <Image
                    src="/mail5.png"
                    alt="Camera"
                    width={120}
                    height={120}
                    className="drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] select-none opacity-80"
                  />
                </span>

                {/* Button (ABOVE item) */}
                <button
                  onClick={() => scrollToId("contact")}
                  className="relative z-10 btn border-t border-l border-white rounded-tl-4xl whitespace-nowrap cursor-pointer flex flex-row gap-2 items-center"
                >
                  Contact Me
                  <LuSend size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const formatTime = (total: number) => {
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  return [hrs, mins, secs].map((n) => n.toString().padStart(2, "0")).join(":");
};
