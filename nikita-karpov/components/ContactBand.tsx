import { site } from "@/content/site";
import { ArrowLink } from "./ArrowLink";

export function ContactBand() {
  return (
    <section aria-labelledby="contact-band" className="bg-night text-night-fg">
      <div className="wrap grid gap-10 py-20 md:grid-cols-12 md:py-28">
        <h2 id="contact-band" className="t-display md:col-span-7">
          Have something in mind?
        </h2>
        <div className="flex flex-col justify-end gap-6 md:col-span-5">
          <p className="t-lede max-w-md text-night-mute">
            Portraits, an event, a product launch or footage that needs an edit. Tell me about it and we&apos;ll work out the
            rest.
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
