import Intro from "../_components/Intro";
import About from "../_components/About";
import Gallery from "../_components/Gallery";
import ConnectClient from "../_components/ConnectClient";

export default function Home() {
  return (
    <main className=" text-white">
      <Intro />
      <section id="about" className="scroll-mt-24 md:scroll-mt-32">
        <About />
      </section>
      <section id="work" className="scroll-mt-24 md:scroll-mt-32">
        <Gallery />
      </section>
      <section id="contact" className="scroll-mt-...">
        <ConnectClient />
      </section>
      
    </main>
  );
}
