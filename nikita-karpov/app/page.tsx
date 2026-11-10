import Image from "next/image";
import { ArrowLink } from "@/components/ArrowLink";
import { ContactBand } from "@/components/ContactBand";
import { LightboxProvider, PhotoTrigger } from "@/components/Lightbox";
import { Photo } from "@/components/Photo";
import { SectionHead } from "@/components/SectionHead";
import { SeriesIndex } from "@/components/SeriesIndex";
import { VideoPlayer } from "@/components/VideoPlayer";
import { featured } from "@/content/portfolio";
import { services, site } from "@/content/site";
import { pad2 } from "@/lib/format";
import { getCategories, getPhotos, getVideo, photoCount, type Photo as PhotoData } from "@/lib/media";

/**
 * Placement for each selected photo, in the order of `featured.selected`.
 * 6-column grid on phones, 12 on desktop. Change freely when the selection changes.
 */
const SELECTED_LAYOUT = [
  { cls: "col-span-6 md:col-span-8", sizes: "(max-width: 768px) 100vw, 64vw" },
  { cls: "col-span-4 col-start-3 md:col-span-3 md:col-start-10 md:self-end", sizes: "(max-width: 768px) 66vw, 24vw" },
  { cls: "col-span-4 md:col-span-4 md:col-start-2 md:mt-16", sizes: "(max-width: 768px) 66vw, 32vw" },
  { cls: "col-span-4 col-start-3 md:col-span-4 md:col-start-8 md:mt-[12vw]", sizes: "(max-width: 768px) 66vw, 32vw" },
  { cls: "col-span-6 md:col-span-10 md:col-start-2", sizes: "(max-width: 768px) 100vw, 80vw" },
  { cls: "col-span-3 md:col-span-4", sizes: "(max-width: 768px) 50vw, 32vw" },
  { cls: "col-span-3 mt-16 md:col-span-4 md:mt-28", sizes: "(max-width: 768px) 50vw, 32vw" },
  { cls: "col-span-4 col-start-2 md:col-span-4 md:col-start-auto md:mt-56", sizes: "(max-width: 768px) 66vw, 32vw" },
];

function Figure({ photo, n, sizes, className = "" }: { photo: PhotoData; n: number; sizes: string; className?: string }) {
  return (
    <figure className={`reveal ${className}`}>
      <PhotoTrigger id={photo.id} title={photo.title}>
        <Photo photo={photo} sizes={sizes} />
      </PhotoTrigger>
      <figcaption className="mt-3 flex items-baseline justify-between gap-4">
        <span className="flex items-baseline gap-3">
          <span className="t-label text-mute">{pad2(n)}</span>
          <span className="text-[15px]">{photo.title}</span>
        </span>
        <span className="t-label text-mute">{photo.category.title}</span>
      </figcaption>
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
      {/* ---------------------------------------------------------------- intro */}
      {/*
        Exactly one screen tall (minus the header + its 1px rule) at every size. The photo area is a
        size container, so each photo's width is the smaller of "its share of the
        column" and "available height × its aspect ratio" — never cropped, never
        pushed below the fold. Phones/portrait tablets stack: text, then photos
        filling whatever height is left.
      */}
      <section className="wrap grid h-[calc(100svh-var(--header-h)-1px)] min-h-[520px] grid-rows-[auto_minmax(190px,1fr)] gap-6 pb-6 pt-6 sm:gap-8 sm:pb-8 sm:pt-10 lg:min-h-[560px] lg:grid-cols-12 lg:grid-rows-[minmax(0,1fr)] lg:items-center lg:gap-x-(--gutter) lg:py-[clamp(24px,6vh,72px)]">
        <div className="lg:col-span-5">
          <p className="t-label text-mute">
            Photography <span aria-hidden="true">/</span> Film <span aria-hidden="true">/</span> Edit
          </p>
          <h1 className="mt-5 font-serif text-[clamp(2.25rem,min(4.3vw,7.2vh),4.6rem)] leading-[1.0] tracking-[-0.015em] lg:mt-[clamp(16px,3vh,32px)]">
            <span className="sr-only">{site.name} — </span>
            Clean, cinematic images of people, places <em className="italic">&amp;&nbsp;the moments between.</em>
          </h1>
          <p className="mt-6 max-w-[34rem] text-[clamp(1rem,min(1.25vw,2.2vh),1.25rem)] leading-[1.55] text-ink-2 lg:mt-[clamp(16px,3.2vh,32px)]">
            I&apos;m Nik Karpov, a photographer, videographer and editor in Toronto. Five-plus years of freelance work across
            portraits, events, sport and brand content — from planning the shoot to the final edit.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-[17px] lg:mt-[clamp(20px,3.6vh,36px)]">
            <ArrowLink href="/work">See the work</ArrowLink>
            <ArrowLink href="/contact">Start a project</ArrowLink>
          </div>
        </div>

        <div className="h-full [container-type:size] lg:col-span-7">
          <div className="flex h-full items-end justify-center gap-x-3 sm:gap-x-(--gutter) lg:justify-end">
            <figure style={{ width: `min(58cqw, calc((100cqh - 2rem) * ${(hero[0].width / hero[0].height).toFixed(4)}))` }}>
              <PhotoTrigger id={hero[0].id} title={hero[0].title}>
                <Photo photo={hero[0]} preload sizes="(max-width: 1024px) 60vw, 32vw" />
              </PhotoTrigger>
              <figcaption className="t-label mt-3 truncate text-mute">01 — {hero[0].title}</figcaption>
            </figure>
            <figure
              className="mb-[12cqh]"
              style={{ width: `min(38cqw, calc((72cqh - 2rem) * ${(hero[1].width / hero[1].height).toFixed(4)}))` }}
            >
              <PhotoTrigger id={hero[1].id} title={hero[1].title}>
                <Photo photo={hero[1]} preload sizes="(max-width: 1024px) 40vw, 22vw" />
              </PhotoTrigger>
              <figcaption className="t-label mt-3 truncate text-mute">02 — {hero[1].title}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- selected work */}
      <section aria-labelledby="selected" className="wrap pb-24 pt-16 md:pb-36 md:pt-24">
        <SectionHead
          id="selected"
          label="Selected work"
          title={
            <>
              A few frames <em className="italic">worth a closer look.</em>
            </>
          }
          aside={<ArrowLink href="/work">Full archive — {photoCount} photographs</ArrowLink>}
        />
        <div className="mt-12 grid grid-cols-6 gap-x-3 gap-y-14 md:mt-16 md:grid-cols-12 md:gap-x-(--gutter) md:gap-y-24">
          {selected.map((p, i) => (
            <Figure
              key={p.id}
              photo={p}
              n={i + 3}
              sizes={SELECTED_LAYOUT[i % SELECTED_LAYOUT.length].sizes}
              className={SELECTED_LAYOUT[i % SELECTED_LAYOUT.length].cls}
            />
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- series */}
      <section aria-labelledby="series" className="wrap pb-24 md:pb-36">
        <SectionHead id="series" label="Series" title="Browse by subject" />
        <div className="mt-10">
          <SeriesIndex categories={categories} />
        </div>
      </section>

      {/* ----------------------------------------------------------------- film */}
      {reel ? (
        <section aria-labelledby="film" className="border-y border-night-rule bg-night text-night-fg">
          <div className="wrap grid gap-10 py-20 md:grid-cols-12 md:gap-x-(--gutter) md:py-28">
            <div className="flex flex-col justify-between gap-8 md:col-span-4">
              <div>
                <p className="t-label mb-5 text-night-mute">Film</p>
                <h2 id="film" className="t-h2">
                  Motion, <em className="italic">cut and coloured</em> in-house.
                </h2>
              </div>
              <div className="space-y-6">
                <p className="max-w-sm text-night-mute">
                  Video for brands, events and social — shot, edited and graded by the same person, so the look holds together from
                  first frame to last.
                </p>
                <ArrowLink href="/film">Film work</ArrowLink>
              </div>
            </div>
            <div className="md:col-span-8">
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
        <SectionHead
          id="services"
          label="Services"
          title={
            <>
              From the shoot <em className="italic">to the final cut.</em>
            </>
          }
        />
        <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-(--gutter)">
          {services.map((s) => (
            <div key={s.n} className="border-t border-rule pt-6">
              <p className="t-label text-mute">{s.n}</p>
              <h3 className="t-h3 mt-6">{s.title}</h3>
              <p className="mt-4 max-w-sm text-ink-2">{s.text}</p>
              <ul className="mt-6 space-y-1 text-[15px] text-mute">
                {s.items.map((it) => (
                  <li key={it}>— {it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- about */}
      <section aria-labelledby="about" className="wrap grid items-end gap-x-(--gutter) gap-y-12 pb-24 md:grid-cols-12 md:pb-36">
        <div className="relative md:col-span-5">
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
          <p className="t-label mb-5 text-mute">About</p>
          <h2 id="about" className="t-h2">Hi, I&apos;m Nik.</h2>
          <div className="t-lede mt-6 max-w-xl space-y-4 text-ink-2">
            <p>
              I work on both sides of the camera — production and post — so the person planning your shoot is the one who edits,
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
