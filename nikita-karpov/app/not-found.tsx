import { ArrowLink } from "@/components/ArrowLink";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[60vh] flex-col justify-center py-24">
      <h1 className="t-display">Out of frame.</h1>
      <p className="t-lede mt-6 max-w-md text-ink-2">That page doesn&apos;t exist, or it has moved (error 404).</p>
      <div className="mt-8 flex gap-8 text-[17px]">
        <ArrowLink href="/">Home</ArrowLink>
        <ArrowLink href="/work">Work</ArrowLink>
      </div>
    </section>
  );
}
