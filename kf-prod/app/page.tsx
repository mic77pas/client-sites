import About from "@/components/About";
import Intro from "@/components/Intro";

export default function Home() {
  return (
    <main className="text-black justify-center items-center text-4xl font-bold">
      <section id="intro" className="scroll-mt-24">
        <Intro />
      </section>
      <section id="about" className="scroll-mt-24 h-100 bg-black">
        <About />
      </section>
      <section id="portfolio" className="scroll-mt-24 h-100 bg-white"></section>
      <section id="services" className="scroll-mt-24 h-100 bg-orange"></section>
      <section id="contact" className="scroll-mt-24 h-100 bg-black"></section>
    </main>
  );
}
