import Image from "next/image";
import Intro from "../_components/Intro";
import About from "../_components/About";

export default function Home() {
  return (
    <>
      <Intro />
      <section id="about"><About /></section>
      <section id="portfolio">Portfolio</section>
      <section id="contact">Contact</section>
    </>
  );
}
