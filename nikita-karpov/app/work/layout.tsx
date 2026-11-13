import { WorkHeader } from "@/components/WorkHeader";
import { getCategories } from "@/lib/media";

/** Shared header for every work view, kept mounted across series switches (see WorkHeader). */
export default function WorkLayout({ children }: { children: React.ReactNode }) {
  const categories = getCategories().map(({ slug, title, blurb }) => ({ slug, title, blurb }));
  return (
    <>
      <WorkHeader categories={categories} />
      {children}
    </>
  );
}
