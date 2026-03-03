"use client";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;

        // Ignore tiny scroll movements (prevents flicker)
        const THRESHOLD = 8;

        if (Math.abs(delta) > THRESHOLD) {
          // hide when scrolling down, show when scrolling up
          setHidden(delta > 0 && y > 60); // don't hide at very top
          lastY.current = y;
        }

        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={[
          "fixed top-0 w-full h-24 hidden sm:flex bg-linear-to-b from-black to-transparent",
          "z-100",
          "justify-center items-center",
          "transform-gpu transition-transform duration-300 ease-out",
          hidden ? "-translate-y-full" : "translate-y-0",
        ].join(" ")}
      >
        <div className="flex flex-row items-center justify-between w-full px-12">
          <Link href="/">
            <Image
              src="/K&F.png"
              alt="Logo"
              width={60}
              height={60}
              className="transition-transform duration-300 hover:scale-105 hover:brightness-120 mr-8"
            />
          </Link>

          <nav>
            <ul className="text-white flex gap-8 font-bold">
              <li>
                <Link href="/about" className="nav-link">
                  about
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="nav-link">
                  portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="https://drive.google.com/file/d/1K3GYf2A8-K891H3_0iJ5PybGPYWcMBg7/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link"
                >
                  resume
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* <div className="sm:hidden">
        <MobileHeader />
      </div> */}
    </>
  );
}
