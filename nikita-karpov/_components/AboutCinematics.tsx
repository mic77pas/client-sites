"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  /** full-width background image (put in /public) */
  bgSrc?: string; // e.g. "/toronto-skyline.jpg"
  /** foreground PNG that slides in (put in /public) */
  overlayPngSrc?: string; // e.g. "/subject.png"
  eyebrow?: string;
  title?: string;
  body?: string;
};

export default function AboutCinematic({
  bgSrc = "/toronto-skyline.jpg",
  overlayPngSrc = "/subject.png",
  eyebrow = "ABOUT",
  title = "Cinematic, minimal, story-first.",
  body = "Multi-disciplinary creator focused on emotion, movement, and clean composition.",
}: Props) {
  return (
    <section className="w-full">
      <motion.div
        // trigger when scrolled into view
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        className="relative w-full overflow-hidden rounded-2xl"
        style={{
          backgroundImage: `url('${bgSrc}')`,
          backgroundSize: "cover",
          backgroundPosition: "50% 60%",
        }}
      >
        {/* height */}
        <div className="h-[420px] md:h-[460px]" />

        {/* darkening background overlay */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1 },
          }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0 bg-black/50"
        />

        {/* subtle gradient so bottom reads nicer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

        {/* content layer */}
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full w-full max-w-6xl items-end px-6 pb-10">
            <div className="grid w-full items-end gap-8 md:grid-cols-2">
              {/* PNG slides in from right to left (left side) */}
              <motion.div
                variants={{
                  hidden: { x: 130, opacity: 0 },
                  show: { x: 0, opacity: 1 },
                }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative order-2 md:order-1"
              >
                <Image
                  src={overlayPngSrc}
                  alt=""
                  width={400}
                  height={400}
                  className="pointer-events-none w-full max-w-[360px] translate-y-15 select-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
                />
              </motion.div>

              {/* Text appears on the right */}
              <motion.div
                variants={{
                  hidden: { y: 18, opacity: 0 },
                  show: { y: 0, opacity: 1 },
                }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="order-1 md:order-2 md:pl-6"
              >
                <div className="text-xs tracking-[0.35em] text-white/65">
                  {eyebrow}
                </div>

                <h2 className="mt-3 font-montserrat text-3xl leading-tight tracking-tight text-white md:text-4xl">
                  {title}
                </h2>

                <p className="mt-4 max-w-md text-white/70 leading-relaxed">
                  {body}
                </p>

                <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80">
                  Available for projects + collaborations
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
