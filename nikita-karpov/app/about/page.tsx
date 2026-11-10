import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLink } from "@/components/ArrowLink";
import { ContactBand } from "@/components/ContactBand";
import { SectionHead } from "@/components/SectionHead";
import { services, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Nik Karpov is a Toronto-based photographer, videographer and editor working across production and post.",
};

/** Cameras and lenses, as recorded in the portfolio's own EXIF data. */
const kit = [
  "Sony α6700",
  "Canon EOS 7D",
  "Sigma 18–50mm F2.8",
  "Sony 50mm F1.8",
  "Sony 70–200mm F4",
  "Sony 16–50mm",
];

export default function AboutPage() {
  return (
    <>
      <section className="wrap grid gap-x-(--gutter) gap-y-14 pb-24 pt-10 md:grid-cols-12 md:pb-36 md:pt-16">
        <div className="md:col-span-6">
          <p className="t-label text-mute">About</p>
          <h1 className="t-display mt-5">
            Hi, I&apos;m Nik<em className="italic">.</em>
          </h1>
          <div className="t-lede mt-10 max-w-xl space-y-5 text-ink-2">
            <p>
              I&apos;m a photographer, videographer and editor based in Toronto. For more than five years I&apos;ve worked
              freelance, making clean, cinematic images for people and brands who want to look like themselves — only more
              considered.
            </p>
            <p>
              I work across production and post-production. The person planning the shoot is the same one who edits, grades
              and delivers it, so what we talk about at the start is what you get at the end.
            </p>
            <p>
              My work covers portraits, events, sport and product, along with video for brands and social. Most of it happens in
              Toronto and across the GTA, including Aurora and Newmarket.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[17px]">
            <ArrowLink href="/contact">Work with me</ArrowLink>
            <ArrowLink href="/work">See the work</ArrowLink>
          </div>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          <figure className="md:sticky md:top-[calc(var(--header-h)+32px)]">
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
        <SectionHead id="services" label="Services" title="What I can help with" />
        <div className="mt-4">
          {services.map((s) => (
            <div key={s.n} className="grid gap-4 border-b border-rule py-8 md:grid-cols-12 md:gap-(--gutter) md:py-10">
              <p className="t-label text-mute md:col-span-1 md:pt-2">{s.n}</p>
              <h3 className="t-h3 md:col-span-4">{s.title}</h3>
              <p className="text-ink-2 md:col-span-4">{s.text}</p>
              <ul className="text-[15px] text-mute md:col-span-3">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="kit" className="wrap pb-24 md:pb-36">
        <div className="grid gap-6 border-t border-rule pt-5 md:grid-cols-12 md:gap-(--gutter)">
          <h2 id="kit" className="t-label text-mute md:col-span-4">
            In the bag
          </h2>
          <ul className="flex flex-wrap gap-x-8 gap-y-2 font-serif text-[1.6rem] leading-snug md:col-span-8">
            {kit.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
      </section>

      <ContactBand />
    </>
  );
}
