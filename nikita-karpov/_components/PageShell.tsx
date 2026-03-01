"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PageShell({
  heroRef,
  children,
}: {
  heroRef: React.MutableRefObject<HTMLElement | null>;
  children: React.ReactNode;
}) {
  const STOP = 0.35;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // wrapper anims: full-bleed -> padded card
  const pad = useTransform(scrollYProgress, [0, STOP], [0, 24]); // px-6
  const radius = useTransform(scrollYProgress, [0, STOP], [0, 22]);
  const borderAlpha = useTransform(scrollYProgress, [0.05, STOP], [0, 0.6]);
  const shadowAlpha = useTransform(scrollYProgress, [0.05, STOP], [0, 0.35]);

  const borderColor = useTransform(
    borderAlpha,
    (a) => `rgba(255,255,255,${a})`,
  );
  const boxShadow = useTransform(
    shadowAlpha,
    (a) => `0 18px 60px rgba(0,0,0,${a})`,
  );

  return (
    <motion.div
      style={{
        paddingLeft: pad,
        paddingRight: pad,
        paddingTop: pad,
        paddingBottom: pad,
      }}
      className="w-full"
    >
      <motion.div
        style={{ borderRadius: radius, borderColor, boxShadow }}
        className="w-full overflow-hidden border border-transparent bg-white/5"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
