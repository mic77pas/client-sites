import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLink } from "@/components/ArrowLink";
import { CategoryNav } from "@/components/CategoryNav";
import { ContactBand } from "@/components/ContactBand";
import { JustifiedGallery } from "@/components/JustifiedGallery";
import { LightboxProvider } from "@/components/Lightbox";
import { getCategories, getCategory } from "@/lib/media";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCategory((await params).category);
  if (!c) return {};
  return {
    title: `${c.title} photography`,
    description: c.blurb || `${c.title} photography by Nik Karpov.`,
    openGraph: { images: [{ url: `${c.coverPhoto.src}-1440.webp` }] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const slug = (await params).category;
  const categories = getCategories();
  const index = categories.findIndex((c) => c.slug === slug);
  if (index < 0) notFound();
  const c = categories[index];
  const nextCat = categories[(index + 1) % categories.length];

  return (
    <LightboxProvider photos={c.photos} syncUrl>
      <header className="wrap pb-8 pt-10 md:pt-16">
        <h1 className="t-display">{c.title}</h1>
        {c.blurb ? <p className="t-lede mt-6 max-w-xl text-ink-2">{c.blurb}</p> : null}
        <div className="mt-10">
          <CategoryNav categories={categories} active={c.slug} />
        </div>
      </header>

      <div className="wrap pb-20 pt-6">
        <JustifiedGallery photos={c.photos} eager={3} />
      </div>

      {nextCat.slug !== c.slug ? (
        <div className="wrap pb-24 md:pb-32">
          <div className="flex items-baseline justify-between gap-6">
            <p className="t-label text-mute">Next series</p>
            <ArrowLink href={`/work/${nextCat.slug}`} className="t-wide text-[1.75rem] leading-none md:text-[2.25rem]">
              {nextCat.title}
            </ArrowLink>
          </div>
        </div>
      ) : null}
      <ContactBand />
    </LightboxProvider>
  );
}
