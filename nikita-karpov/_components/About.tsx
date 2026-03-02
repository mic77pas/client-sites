"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import FlowingMenu from "../components/FlowingMenu"; // adjust path

type Props = {
  bgSrc?: string;
  overlayPngSrc?: string;
};

const body = `I’m Nik, a Toronto-based photographer and videographer specializing in creating clean, cinematic visuals that help brands elevate their presence and stand out with intention.
With over five years of freelance experience, I bring expertise in both production and post-production: crafting engaging, visually compelling content that feels refined and purposeful.
From content creation to visual strategy, I focus on delivering work that meets the highest creative standards and exceeds client expectations.`;

const demoItems = [
  {
    link: "",
    text: "Toronto",
    image: "/torontob.jpg",
  },
  {
    link: "",
    text: "Aurora",
    image: "/aurora.webp",
  },
  {
    link: "",
    text: "Newmarket",
    image: "/newmarket.jpg",
  },
];

export default function AboutCinematic({}: Props) {
  return (
    <section className="w-full">
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        className="relative w-full overflow-hidden rounded-b-2xl border border-white"
        style={{
          backgroundImage: `url('/toronto.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "50% 60%",
        }}
      >
        {/* overlays */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0 bg-black/40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

        {/* content */}
        <div className="relative mx-auto w-full px-6 py-10 md:py-0 md:min-h-[460px] flex items-end ">
          <div className="grid w-full items-center md:grid-cols-[0.8fr_1.2fr]">
            {/* LEFT: PNG */}
            <motion.div
              variants={{
                hidden: { x: 130, opacity: 0 },
                show: { x: 0, opacity: 1 },
              }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <Image
                src={"/nickusa.png"}
                alt=""
                width={400}
                height={400}
                className="pointer-events-none w-full max-w-[360px] select-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)] translate-x-15 md:translate-x-0"
              />
            </motion.div>

            {/* RIGHT: Menu on top, text below */}
            <motion.div
              variants={{
                hidden: { y: 18, opacity: 0 },
                show: { y: 0, opacity: 1 },
              }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="md:pl-6 flex flex-col gap-6 w-full"
            >
              {/* Menu block (shrinks on small screens) */}
              <div className="w-full overflow-hidden rounded-xl border border-white/15 bg-white/5">
                <div className="h-[150px] sm:h-[170px] md:h-[140px]">
                  <FlowingMenu
                    items={demoItems}
                    bgColor="transparent"
                    textColor="rgba(255, 255, 255, 1)"
                    marqueeBgColor="rgba(255,255,255,1)"
                    marqueeTextColor="#060010"
                    borderColor="rgba(255,255,255,0.18)"
                    speed={10}
                  />
                </div>
              </div>

              {/* About text */}
              <p className="w-full text-white/90 leading-relaxed [text-shadow:0_2px_4px_rgba(0,0,0,1)]">
                {body}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
