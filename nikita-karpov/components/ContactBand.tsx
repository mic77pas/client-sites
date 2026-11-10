import { site } from "@/content/site";
import { ArrowLink } from "./ArrowLink";

export function ContactBand() {
  return (
    <section aria-labelledby="contact-band" className="border-t border-night-rule bg-night text-night-fg">
      <div className="wrap grid gap-10 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-7">
          <p className="t-label mb-5 text-night-mute">Inquiries</p>
          <h2 id="contact-band" className="t-display">
            Have something <em className="italic">in mind?</em>
          </h2>
        </div>
        <div className="flex flex-col justify-end gap-6 md:col-span-5">
          <p className="t-lede max-w-md text-night-mute">
            Portraits, an event, a product launch or footage that needs an edit — tell me about it and we&apos;ll work out the rest.
          </p>
          <div className="flex flex-col gap-3 text-[17px]">
            <ArrowLink href="/contact">Start an inquiry</ArrowLink>
            <a href={`mailto:${site.email}`} className="link-line w-fit text-night-mute hover:text-night-fg">
              {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
