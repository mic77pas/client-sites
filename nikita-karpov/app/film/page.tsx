import type { Metadata } from "next";
import { ArrowLink } from "@/components/ArrowLink";
import { VideoPlayer, type VideoSource } from "@/components/VideoPlayer";
import { films, type Film } from "@/content/films";
import { getVideo } from "@/lib/media";

export const metadata: Metadata = {
  title: "Film",
  description: "Video and editing work by Nik Karpov — brand content, events and short-form.",
};

type Resolved = {
  source: VideoSource;
  poster: string;
  posterBlur?: string;
  ratio: number;
  duration?: number | null;
};

function resolve(film: Film): Resolved | null {
  if (film.kind === "file") {
    const v = getVideo(film.video);
    if (!v) return null;
    return {
      source: { kind: "file", hd: v.hd, sd: v.sd },
      poster: v.poster,
      posterBlur: v.posterBlur,
      ratio: v.width / v.height,
      duration: v.duration,
    };
  }
  if (film.kind === "youtube") {
    return {
      source: { kind: "youtube", id: film.youtubeId },
      poster: film.poster ?? `https://i.ytimg.com/vi/${film.youtubeId}/maxresdefault.jpg`,
      ratio: 16 / 9,
    };
  }
  return {
    source: { kind: "vimeo", id: film.vimeoId },
    poster: film.poster,
    ratio: 16 / 9,
  };
}

export default function FilmPage() {
  const items = films.flatMap((film) => {
    const media = resolve(film);
    return media ? [{ film, media }] : [];
  });
  const [lead, ...rest] = items;

  return (
    <>
      <div className="bg-night text-paper">
        <header className="wrap pb-12 pt-10 md:pb-16 md:pt-16">
          <p className="t-label text-night-mute">Film &amp; edit</p>
          <h1 className="t-display mt-5">Film</h1>
          <p className="t-lede mt-6 max-w-xl text-night-mute">
            Video for brands, events and social, plus editing and colour for footage you already have.
          </p>
        </header>

        {lead ? (
          <section className="wrap pb-20 md:pb-28" aria-labelledby={`f-${lead.film.id}`}>
            <VideoPlayer title={lead.film.title} {...lead.media} sizes="100vw" />
            <div className="mt-5 grid gap-3 md:grid-cols-12 md:gap-(--gutter)">
              <h2 id={`f-${lead.film.id}`} className="t-h3 md:col-span-4">
                {lead.film.title}
                {lead.film.year ? <span className="text-night-mute"> — {lead.film.year}</span> : null}
              </h2>
              {lead.film.summary ? <p className="text-night-mute md:col-span-5">{lead.film.summary}</p> : null}
              {lead.film.credits?.length ? (
                <p className="t-label text-night-mute md:col-span-3 md:text-right">{lead.film.credits.join(" · ")}</p>
              ) : null}
            </div>
          </section>
        ) : null}

        {rest.length ? (
          <section className="wrap grid gap-x-(--gutter) gap-y-16 pb-24 md:grid-cols-2" aria-label="More films">
            {rest.map(({ film, media }) => (
              <article key={film.id}>
                <VideoPlayer title={film.title} {...media} sizes="(max-width: 768px) 100vw, 50vw" />
                <h2 className="t-h3 mt-5">{film.title}</h2>
                {film.summary ? <p className="mt-2 text-night-mute">{film.summary}</p> : null}
                {film.credits?.length ? <p className="t-label mt-3 text-night-mute">{film.credits.join(" · ")}</p> : null}
              </article>
            ))}
          </section>
        ) : null}

        <div className="wrap pb-20 md:pb-28">
          <div className="flex flex-col gap-4 border-t border-night-rule pt-6 md:flex-row md:items-baseline md:justify-between">
            <p className="max-w-lg text-night-mute">
              Have a video project in mind? Tell me what you&apos;re making and where it will live.
            </p>
            <ArrowLink href="/contact">Ask about video</ArrowLink>
          </div>
        </div>
      </div>
    </>
  );
}
