"use client";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import scrollToId from "./idScroll";

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
          <Link
            href="/"
            className="relative block w-[60px] h-[60px] mr-8 group hover:scale-105 duration-300"
          >
            <Image
              src="/kf.png"
              alt="Logo"
              fill
              unoptimized
              className="object-contain transition-opacity duration-300 group-hover:opacity-0"
            />
            <Image
              src="/kfswitch.png"
              alt="Logo hover"
              fill
              unoptimized
              className="object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          </Link>

          <nav>
            <ul className="text-white flex gap-8 font-bold font-sans ">
              <li>
                <button
                  onClick={() => scrollToId("about")}
                  className="nav-link"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToId("services")}
                  className="nav-link"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToId("portfolio")}
                  className="nav-link"
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToId("about")}
                  className="nav-link"
                >
                  Contact
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToId("about")}
                  className="nav-link"
                >
                  Blog
                </button>
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
