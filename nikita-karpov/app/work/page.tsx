import type { Metadata } from "next";
import Link from "next/link";
import { CategoryNav } from "@/components/CategoryNav";
import { ContactBand } from "@/components/ContactBand";
import { JustifiedGallery } from "@/components/JustifiedGallery";
import { LightboxProvider } from "@/components/Lightbox";
import { pad2 } from "@/lib/format";
import { getAllPhotos, getCategories } from "@/lib/media";

export const metadata: Metadata = {
  title: "Work",
  description: "Photography by Nik Karpov — portraits, events, sport, product, street and animals.",
};

export default function WorkPage() {
  const categories = getCategories();
  const all = getAllPhotos();

  return (
    <LightboxProvider photos={all} syncUrl>
      <header className="wrap pb-8 pt-10 md:pt-16">
        <p className="t-label text-mute">Archive — {all.length} photographs</p>
        <h1 className="t-display mt-5">Work</h1>
        <p className="t-lede mt-6 max-w-xl text-ink-2">
          Photographs by series. Select any image to see it full screen, along with how it was made.
        </p>
        <div className="mt-10">
          <CategoryNav categories={categories} total={all.length} />
        </div>
      </header>

      <div className="wrap space-y-20 pb-24 pt-6 md:space-y-28 md:pb-36">
        {categories.map((c, i) => (
          <section key={c.slug} aria-labelledby={`s-${c.slug}`}>
            <div className="mb-6 flex items-baseline justify-between gap-6">
              <h2 id={`s-${c.slug}`} className="flex items-baseline gap-4">
                <span className="t-label text-mute">{pad2(i + 1)}</span>
                <span className="t-h3">{c.title}</span>
              </h2>
              <Link href={`/work/${c.slug}`} className="t-label link-line text-mute hover:text-ink">
                Open series →
              </Link>
            </div>
            <JustifiedGallery photos={c.photos} eager={i === 0 ? 3 : 0} />
          </section>
        ))}
      </div>
      <ContactBand />
    </LightboxProvider>
  );
}
