import { Fragment } from "react";
import Image from "next/image";
import { ArrowLink } from "@/components/ArrowLink";
import { ContactBand } from "@/components/ContactBand";
import { LightboxProvider, PhotoTrigger } from "@/components/Lightbox";
import { Photo } from "@/components/Photo";
import { SectionHead } from "@/components/SectionHead";
import { SeriesIndex } from "@/components/SeriesIndex";
import { SmoothScroll } from "@/components/SmoothScroll";
import { VideoPlayer } from "@/components/VideoPlayer";
import { featured } from "@/content/portfolio";
import { services, site } from "@/content/site";
import { getCategories, getPhotos, getVideo, type Photo as PhotoData } from "@/lib/media";

/**
 * Placement for each selected photo, in the order of `featured.selected`.
 * 6-column grid on phones, 12 on desktop. Change freely when the selection changes.
 *
 * `speed` is the parallax rate (see SmoothScroll): the large anchor frames hold
 * still while the smaller ones float past them at different rates. All negative
 * (running ahead of the scroll) so neighbours never drift into each other.
 */
const SELECTED_LAYOUT = [
  { cls: "col-span-6 md:col-span-8", sizes: "(max-width: 768px) 100vw, 64vw", speed: 0 },
  { cls: "col-span-4 col-start-3 md:col-span-3 md:col-start-10 md:self-end", sizes: "(max-width: 768px) 66vw, 24vw", speed: -0.1 },
  { cls: "col-span-4 md:col-span-4 md:col-start-2 md:mt-16", sizes: "(max-width: 768px) 66vw, 32vw", speed: -0.04 },
  { cls: "col-span-4 col-start-3 md:col-span-4 md:col-start-8 md:mt-[12vw]", sizes: "(max-width: 768px) 66vw, 32vw", speed: -0.12 },
  { cls: "col-span-6 md:col-span-10 md:col-start-2", sizes: "(max-width: 768px) 100vw, 80vw", speed: 0 },
  { cls: "col-span-3 md:col-span-4", sizes: "(max-width: 768px) 50vw, 32vw", speed: -0.05 },
  { cls: "col-span-3 mt-16 md:col-span-4 md:mt-28", sizes: "(max-width: 768px) 50vw, 32vw", speed: -0.1 },
  { cls: "col-span-4 col-start-2 md:col-span-4 md:col-start-auto md:mt-56", sizes: "(max-width: 768px) 66vw, 32vw", speed: -0.14 },
];

/** Hero headline, word by word ("&" and "the" stay together so they never split across lines). */
const HEADLINE = ["Clean,", "cinematic", "images", "of", "people,", "places", "& the", "moments", "between."];

function Figure({
  photo,
  sizes,
  speed,
  className = "",
}: {
  photo: PhotoData;
  sizes: string;
  speed: number;
  className?: string;
}) {
  return (
    <figure className={className} data-speed={speed || undefined}>
      <PhotoTrigger id={photo.id} title={photo.title}>
        <Photo photo={photo} sizes={sizes} drift={0.06} />
      </PhotoTrigger>
      <figcaption className="mt-3 text-[15px] text-ink-2">{photo.title}</figcaption>
    </figure>
  );
}

export default function Home() {
  const hero = getPhotos(featured.hero);
  const selected = getPhotos(featured.selected);
  const categories = getCategories();
  const reel = getVideo("showreel");
  const lightboxSet = [...hero, ...selected.filter((p) => !featured.hero.includes(p.id))];

  return (
    <LightboxProvider photos={lightboxSet}>
      <SmoothScroll />
      {/* ---------------------------------------------------------------- intro */}
      {/*
        Exactly one screen tall (minus the header + its 1px rule) at every size. The photo area is a
        size container, so each photo's width is the smaller of "its share of the
        column" and "available height × its aspect ratio": never cropped, never
        pushed below the fold. Phones/portrait tablets stack: text, then photos
        filling whatever height is left.
      */}
      <section className="wrap grid h-[calc(100svh-var(--header-h)-1px)] min-h-[520px] grid-rows-[auto_minmax(190px,1fr)] gap-6 pb-6 pt-6 sm:gap-8 sm:pb-8 sm:pt-10 lg:min-h-[560px] lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)] lg:items-center lg:gap-x-(--gutter) lg:py-[clamp(24px,6vh,72px)]">
        <div className="lg:col-span-5" data-speed="0.18">
          <h1 className="t-wide text-[clamp(1.9rem,min(3.3vw,6vh),3.6rem)] leading-[1.02]">
            <span className="sr-only">
              {site.name}: {HEADLINE.join(" ")}
            </span>
            {/* Visual copy: each word rises out of its own mask on load (see .intro-* in globals.css). */}
            <span aria-hidden="true">
              {HEADLINE.map((word, i) => (
                <Fragment key={i}>
                  <span className="intro-mask">
                    <span className="intro-word" style={{ "--i": i } as React.CSSProperties}>
                      {word}
                    </span>
                  </span>
                  {i < HEADLINE.length - 1 ? " " : null}
                </Fragment>
              ))}
            </span>
          </h1>
          <p className="intro-rise [--d:650ms] mt-6 max-w-[34rem] text-[clamp(1rem,min(1.25vw,2.2vh),1.2rem)] leading-[1.55] text-ink-2 lg:mt-[clamp(16px,3.2vh,32px)]">
            I&apos;m Nik Karpov, a photographer, videographer and editor in Toronto. Five-plus years of freelance work across
            portraits, events, sport and brand content, from planning the shoot to the final edit.
          </p>
          <div className="intro-rise [--d:780ms] mt-7 flex flex-wrap gap-x-8 gap-y-3 text-[17px] lg:mt-[clamp(20px,3.6vh,36px)]">
            <ArrowLink href="/work">See the work</ArrowLink>
            <ArrowLink href="/contact">Start a project</ArrowLink>
          </div>
        </div>

        <div className="h-full [container-type:size] lg:col-span-7">
          <div className="flex h-full items-end justify-center gap-x-3 sm:gap-x-(--gutter) lg:justify-end">
            <figure data-speed="0.06" style={{ width: `min(58cqw, calc((100cqh - 2rem) * ${(hero[0].width / hero[0].height).toFixed(4)}))` }}>
              <PhotoTrigger id={hero[0].id} title={hero[0].title}>
                <Photo
                  photo={hero[0]}
                  preload
                  drift={0.05}
                  sizes="(max-width: 1024px) 60vw, 32vw"
                  className="intro-photo [--d:200ms]"
                />
              </PhotoTrigger>
              <figcaption className="intro-rise [--d:1250ms] mt-3 truncate text-[15px] text-ink-2">{hero[0].title}</figcaption>
            </figure>
            <figure
              className="mb-[12cqh]"
              data-speed="-0.1"
              style={{ width: `min(38cqw, calc((72cqh - 2rem) * ${(hero[1].width / hero[1].height).toFixed(4)}))` }}
            >
              <PhotoTrigger id={hero[1].id} title={hero[1].title}>
                <Photo
                  photo={hero[1]}
                  preload
                  drift={0.05}
                  sizes="(max-width: 1024px) 40vw, 22vw"
                  className="intro-photo [--d:420ms]"
                />
              </PhotoTrigger>
              <figcaption className="intro-rise [--d:1400ms] mt-3 truncate text-[15px] text-ink-2">{hero[1].title}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- selected work */}
      <section aria-labelledby="selected" className="wrap pb-24 pt-16 md:pb-36 md:pt-24">
        <SectionHead id="selected" title="Selected work" aside={<ArrowLink href="/work">Full archive</ArrowLink>} />
        <div className="mt-12 grid grid-cols-6 gap-x-3 gap-y-14 md:mt-16 md:grid-cols-12 md:gap-x-(--gutter) md:gap-y-24">
          {selected.map((p, i) => (
            <Figure
              key={p.id}
              photo={p}
              sizes={SELECTED_LAYOUT[i % SELECTED_LAYOUT.length].sizes}
              speed={SELECTED_LAYOUT[i % SELECTED_LAYOUT.length].speed}
              className={SELECTED_LAYOUT[i % SELECTED_LAYOUT.length].cls}
            />
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- series */}
      <section aria-labelledby="series" className="wrap pb-24 md:pb-36">
        <SectionHead id="series" title="Browse by subject" />
        <div className="mt-10">
          <SeriesIndex categories={categories} />
        </div>
      </section>

      {/* ----------------------------------------------------------------- film */}
      {reel ? (
        <section aria-labelledby="film" className="bg-night text-night-fg">
          <div className="wrap grid gap-10 py-20 md:grid-cols-12 md:gap-x-(--gutter) md:py-28">
            <div className="flex flex-col justify-between gap-8 md:col-span-4" data-speed="0.06">
              <h2 id="film" className="t-h2">
                Motion, cut and coloured in-house.
              </h2>
              <div className="space-y-6">
                <p className="max-w-sm text-night-mute">
                  Video for brands, events and social. Shot, edited and graded by the same person, so the look holds together
                  from first frame to last.
                </p>
                <ArrowLink href="/film">Film work</ArrowLink>
              </div>
            </div>
            <div className="md:col-span-8" data-speed="-0.04">
              <VideoPlayer
                title="Showreel"
                source={{ kind: "file", hd: reel.hd, sd: reel.sd }}
                poster={reel.poster}
                posterBlur={reel.posterBlur}
                ratio={reel.width / reel.height}
                duration={reel.duration}
                sizes="(max-width: 768px) 100vw, 66vw"
                preview
                previewStart={4}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* ------------------------------------------------------------- services */}
      <section aria-labelledby="services" className="wrap py-24 md:py-36">
        <SectionHead id="services" title="From the shoot to the final cut." />
        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-(--gutter)">
          {services.map((s) => (
            <div key={s.title}>
              <h3 className="t-h3">{s.title}</h3>
              <p className="mt-4 max-w-sm text-ink-2">{s.text}</p>
              <ul className="mt-6 space-y-1 text-[15px] text-mute">
                {s.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- about */}
      <section aria-labelledby="about" className="wrap grid items-end gap-x-(--gutter) gap-y-12 pb-24 md:grid-cols-12 md:pb-36">
        <div className="relative md:col-span-5" data-speed="-0.1">
          <div className="relative mt-24 aspect-[5/4] bg-paper-2">
            <Image
              src="/brand/nik-cutout.webp"
              alt="Nik Karpov crouching with a camera and telephoto lens"
              width={760}
              height={1202}
              unoptimized
              className="absolute bottom-0 left-1/2 h-[128%] w-auto max-w-none -translate-x-1/2"
            />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <h2 id="about" className="t-h2">
            Hi, I&apos;m Nik.
          </h2>
          <div className="t-lede mt-6 max-w-xl space-y-4 text-ink-2">
            <p>
              I work on both sides of the camera, production and post, so the person planning your shoot is the one who edits,
              grades and delivers it.
            </p>
            <p>Most of my work happens in Toronto and across the GTA, including Aurora and Newmarket.</p>
          </div>
          <div className="mt-8 text-[17px]">
            <ArrowLink href="/about">More about me</ArrowLink>
          </div>
        </div>
      </section>

      <ContactBand />
    </LightboxProvider>
  );
}
