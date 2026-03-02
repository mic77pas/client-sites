import Intro from "../_components/Intro";
import About from "../_components/About";
import ConnectClient from "../_components/ConnectClient";
import GalleryServer from "@/_components/GalleryServer";
import WidthClient from "./widthClient";

export default function Home() {
  return (
    <main className="text-white">
      <Intro />

      <WidthClient>
        <section
          id="about"
          className="w-full scroll-mt-24 md:scroll-mt-32 border-white bg-black/50 border-[1] rounded-2xl flex flex-col items-center"
        >
          <p className="font-bold text-xl py-3">About</p>
          <About />
        </section>

        <section
          id="work"
          className="w-full scroll-mt-24 md:scroll-mt-32 border-white bg-black/50 border-[1] rounded-2xl flex flex-col items-center"
        >
          <p className="font-bold text-xl py-3">Gallery</p>
          <GalleryServer />
        </section>

        <section id="contact" className="scroll-mt-24 md:scroll-mt-32">
          <ConnectClient />
        </section>
      </WidthClient>
    </main>
  );
}
