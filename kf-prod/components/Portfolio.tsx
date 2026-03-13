"use client";

import { useRef } from "react";

type PortfolioItem = {
  title: string;
  category: string;
  thumbnail: string;
};

type PortfolioRowProps = {
  title: string;
  items: PortfolioItem[];
};

const portfolioData: PortfolioRowProps[] = [
  {
    title: "Brand Commercials",
    items: [
      {
        title: "Luxury Promo",
        category: "Commercial",
        thumbnail: "/portfolio/commercial-1.jpg",
      },
      {
        title: "Product Campaign",
        category: "Commercial",
        thumbnail: "/portfolio/commercial-2.jpg",
      },
      {
        title: "Restaurant Ad",
        category: "Commercial",
        thumbnail: "/portfolio/commercial-3.jpg",
      },
      {
        title: "Fashion Reel",
        category: "Commercial",
        thumbnail: "/portfolio/commercial-4.jpg",
      },
    ],
  },
  {
    title: "Events",
    items: [
      {
        title: "Wedding Highlights",
        category: "Event",
        thumbnail: "/portfolio/event-1.jpg",
      },
      {
        title: "Corporate Gala",
        category: "Event",
        thumbnail: "/portfolio/event-2.jpg",
      },
      {
        title: "Live Performance",
        category: "Event",
        thumbnail: "/portfolio/event-3.jpg",
      },
      {
        title: "Private Celebration",
        category: "Event",
        thumbnail: "/portfolio/event-4.jpg",
      },
    ],
  },
  {
    title: "Creative & Music",
    items: [
      {
        title: "Artist Visualizer",
        category: "Music",
        thumbnail: "/portfolio/music-1.jpg",
      },
      {
        title: "Studio Session",
        category: "Music",
        thumbnail: "/portfolio/music-2.jpg",
      },
      {
        title: "Creative Reel",
        category: "Creative",
        thumbnail: "/portfolio/music-3.jpg",
      },
      {
        title: "Performance Cut",
        category: "Music",
        thumbnail: "/portfolio/music-4.jpg",
      },
    ],
  },
];

function PortfolioRow({ title, items }: PortfolioRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;

    const amount = rowRef.current.clientWidth * 0.9;
    rowRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>

        <div className="flex gap-3">
          <button
            onClick={() => scroll("left")}
            className="h-11 w-11 rounded-full border border-white/20 bg-white/10 text-white hover:bg-orange hover:text-black transition"
            aria-label={`Scroll ${title} left`}
          >
            ←
          </button>
          <button
            onClick={() => scroll("right")}
            className="h-11 w-11 rounded-full border border-white/20 bg-white/10 text-white hover:bg-orange hover:text-black transition"
            aria-label={`Scroll ${title} right`}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
      >
        {items.map((item) => (
          <div
            key={item.title}
            className="min-w-[85%] sm:min-w-[60%] md:min-w-[40%] lg:min-w-[28%] xl:min-w-[24%] group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10"
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="p-5">
              <p className="text-orange text-sm uppercase tracking-wider mb-2">
                {item.category}
              </p>
              <h4 className="text-white text-xl font-semibold">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <section className="w-full bg-black px-6 md:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        <p className="text-orange uppercase tracking-[0.25em] text-sm mb-4">
          Portfolio
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Featured work across different styles and stories
        </h2>

        <p className="text-white/70 max-w-3xl text-lg leading-relaxed mb-12">
          Explore our work by category — from commercial visuals and event
          coverage to creative storytelling and music-focused productions.
        </p>

        {portfolioData.map((row) => (
          <PortfolioRow key={row.title} title={row.title} items={row.items} />
        ))}
      </div>
    </section>
  );
}
