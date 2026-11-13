import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLink } from "@/components/ArrowLink";
import { ContactBand } from "@/components/ContactBand";
import { KitShowcase } from "@/components/KitShowcase";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/SectionHead";
import { services, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Nik Karpov is a Toronto-based photographer, videographer and editor working across production and post.",
};

export default function AboutPage() {
  return (
    <>
      <section className="wrap grid gap-x-(--gutter) gap-y-14 pb-24 pt-10 md:grid-cols-12 md:pb-36 md:pt-16">
        <div className="md:col-span-6">
          <h1 className="intro-left t-display [--d:80ms]">Hi, I&apos;m Nik.</h1>
          <div className="t-lede mt-10 max-w-xl space-y-5 text-ink-2">
            <p className="intro-left [--d:220ms]">
              I&apos;m a photographer, videographer and editor based in Toronto. For more than five years I&apos;ve worked
              freelance, making clean, cinematic images for people and brands who want to look like themselves, only more
              considered.
            </p>
            <p className="intro-left [--d:310ms]">
              I work across production and post-production. The person planning the shoot is the same one who edits, grades
              and delivers it, so what we talk about at the start is what you get at the end.
            </p>
            <p className="intro-left [--d:400ms]">
              My work covers portraits, events, sport and product, along with video for brands and social. Most of it happens in
              Toronto and across the GTA, including Aurora and Newmarket.
            </p>
          </div>
          <div className="intro-left mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[17px] [--d:500ms]">
            <ArrowLink href="/contact">Work with me</ArrowLink>
            <ArrowLink href="/work">See the work</ArrowLink>
          </div>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <figure className="intro-right md:sticky md:top-[calc(var(--header-h)+32px)] [--d:180ms]">
            <div className="relative mt-20 aspect-[4/5] bg-paper-2 md:mt-28">
              <Image
                src="/brand/nik-cutout.webp"
                alt="Nik Karpov crouching with a camera and telephoto lens"
                width={760}
                height={1201}
                unoptimized
                preload
                className="absolute bottom-0 left-1/2 h-[118%] w-auto max-w-none -translate-x-1/2"
              />
            </div>
            <figcaption className="t-label mt-3 flex justify-between text-mute">
              <span>{site.name}</span>
              <span>{site.location}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section aria-labelledby="services" className="wrap pb-24 md:pb-36">
        <Reveal>
          <SectionHead id="services" title="What I can help with" />
        </Reveal>
        <div className="mt-4">
          {services.map((s) => (
            <Reveal key={s.title} className="grid gap-4 py-8 md:grid-cols-12 md:gap-(--gutter) md:py-10">
              <h3 className="t-h3 md:col-span-5">{s.title}</h3>
              <p className="text-ink-2 md:col-span-4">{s.text}</p>
              <ul className="text-[15px] text-mute md:col-span-3">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="kit" className="wrap pb-24 md:pb-36">
        <Reveal>
          <div className="well px-6 pb-8 pt-6 sm:px-8 md:px-12 md:pb-12 md:pt-10">
            <h2 id="kit" className="t-label text-mute">
              In the bag
            </h2>
            <div className="mt-6 md:mt-8">
              <KitShowcase />
            </div>
          </div>
        </Reveal>
      </section>

      <ContactBand />
    </>
  );
}
