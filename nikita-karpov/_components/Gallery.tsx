import Image from "next/image";

type MediaItem =
  | { type: "photo"; src: string; alt: string; tag?: string }
  | {
      type: "video";
      poster: string;
      title: string;
      href: string;
      tag?: string;
    };

const items: MediaItem[] = [
  { type: "photo", src: "/work/p1.jpg", alt: "Portrait 1", tag: "Portrait" },
  { type: "photo", src: "/work/p2.jpg", alt: "Street 1", tag: "Street" },
  {
    type: "video",
    poster: "/work/v1.jpg",
    title: "Reel — Night City",
    href: "https://example.com",
    tag: "Video",
  },
  { type: "photo", src: "/work/p3.jpg", alt: "Event 1", tag: "Event" },
  { type: "photo", src: "/work/p4.jpg", alt: "Portrait 2", tag: "Portrait" },
  {
    type: "video",
    poster: "/work/v2.jpg",
    title: "Brand — Studio Cut",
    href: "https://example.com",
    tag: "Video",
  },
];

function MediaCard({ item }: { item: MediaItem }) {
  const base =
    "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition will-change-transform hover:-translate-y-1 hover:rotate-[0.1deg] hover:border-white/20";

  if (item.type === "photo") {
    return (
      <div className={base}>
        <div className="relative aspect-[4/5]">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs tracking-[0.25em] text-white/70">
              {item.tag ?? "PHOTO"}
            </span>
            <span className="text-xs text-white/60 opacity-0 translate-y-1 transition group-hover:opacity-100 group-hover:translate-y-0">
              View
            </span>
          </div>
        </div>
      </div>
    );
  }

  // video card
  return (
    <a className={base} href={item.href} target="_blank" rel="noreferrer">
      <div className="relative aspect-[16/10]">
        <Image
          src={item.poster}
          alt={item.title}
          fill
          className="object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-85 group-hover:opacity-70 transition" />

        {/* play badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border border-white/25 bg-black/40 px-4 py-2 backdrop-blur-sm transition group-hover:bg-black/55">
            <span className="text-white/90">▶</span>
            <span className="text-sm text-white/85">Play</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs tracking-[0.25em] text-white/60">
              {item.tag ?? "VIDEO"}
            </div>
            <div className="mt-1 truncate text-white/90">{item.title}</div>
          </div>
          <div className="text-xs text-white/60 opacity-0 translate-y-1 transition group-hover:opacity-100 group-hover:translate-y-0">
            Open ↗
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Gallery() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="font-montserrat text-3xl tracking-tight">Work</h2>
          <p className="mt-2 text-white/70">A selection of recent projects.</p>
        </div>
        <div className="hidden sm:block text-xs tracking-[0.25em] text-white/50">
          PHOTO • VIDEO
        </div>
      </div>

      <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((item, idx) => (
          <div key={idx} className="mb-5 break-inside-avoid">
            <MediaCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
