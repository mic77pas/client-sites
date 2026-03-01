"use client";

import { useEffect, useMemo, useState } from "react";
import Intro from "../_components/Intro";
import About from "../_components/About";
import Gallery from "../_components/Gallery";
import ConnectClient from "../_components/ConnectClient";

function useWindowWidth() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const onResize = () => setW(window.innerWidth);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return w;
}

export default function Home() {
  const w = useWindowWidth();

  // Match your Intro STOP values:
  const STOP_INSET = 28; // your inset at STOP
  const STOP_SCALE = 0.85; // your scale at STOP

  const zoomedOutWidth = useMemo(() => {
    if (!w) return "100%";
    const base = w - STOP_INSET * 2;
    const scaled = base * STOP_SCALE;
    return `${Math.max(0, Math.floor(scaled))}px`;
  }, [w]);

  return (
    <main className="text-white">
      <Intro />

      {/* below content uses SAME width as intro at STOP */}
      <div
        className="w-full flex flex-col gap-8 justify-center mx-auto bg-black/40 backdrop-blur-md border-white border p-8 rounded-xl"
        style={{ width: zoomedOutWidth }}
      >
        <section id="about" className="w-full scroll-mt-24 md:scroll-mt-32">
          <About />
        </section>

        <section id="work" className="scroll-mt-24 md:scroll-mt-32">
          {/* <Gallery /> */}
        </section>

        <section id="contact" className="scroll-mt-24 md:scroll-mt-32">
          <ConnectClient />
        </section>
      </div>
    </main>
  );
}
