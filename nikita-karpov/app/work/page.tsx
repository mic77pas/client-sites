import type { Metadata } from "next";
import { ArrowLink } from "@/components/ArrowLink";
import { ContactBand } from "@/components/ContactBand";
import { JustifiedGallery } from "@/components/JustifiedGallery";
import { LightboxProvider } from "@/components/Lightbox";
import { getAllPhotos, getCategories } from "@/lib/media";

export const metadata: Metadata = {
  title: "Work",
  description: "Photography by Nik Karpov: portraits, events, sport, product, street and animals.",
};

export default function WorkPage() {
  const categories = getCategories();
  const all = getAllPhotos();

  return (
    <LightboxProvider photos={all} syncUrl>
      <div className="wrap space-y-20 pb-24 pt-6 md:space-y-28 md:pb-36">
        {categories.map((c, i) => (
          <section key={c.slug} aria-labelledby={`s-${c.slug}`}>
            <div className="mb-6 flex items-end justify-between gap-6">
              <h2 id={`s-${c.slug}`} className="t-h3">
                {c.title}
              </h2>
              <ArrowLink href={`/work/${c.slug}`} className="text-[15px] text-mute hover:text-ink">
                View series
              </ArrowLink>
            </div>
            <JustifiedGallery photos={c.photos} eager={i === 0 ? 3 : 0} />
          </section>
        ))}
      </div>
      <ContactBand />
    </LightboxProvider>
  );
}
