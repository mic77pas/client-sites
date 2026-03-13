import About from "@/components/About";
import Intro from "@/components/Intro";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";

export default function Home() {
  return (
    <main className="text-black bg-black justify-center items-center text-4xl font-bold">
      <section id="intro" className="scroll-mt-24">
        <Intro />
      </section>
      <section id="about" className="scroll-mt-24">
        <About />
      </section>
      <section id="services" className="scroll-mt-24">
        <Services />
      </section>
      <section id="portfolio" className="scroll-mt-24">
        <Portfolio />
      </section>

      <section id="contact" className="scroll-mt-24"></section>
    </main>
  );
}
