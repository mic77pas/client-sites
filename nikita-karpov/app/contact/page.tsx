import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Start a photography, video or editing project with Nik Karpov in Toronto.",
};

export default function ContactPage() {
  return (
    <section className="wrap grid gap-x-(--gutter) gap-y-16 pb-24 pt-10 md:grid-cols-12 md:pb-36 md:pt-16">
      <div className="md:col-span-5">
        <p className="t-label text-mute">Contact</p>
        <h1 className="t-display mt-5">
          Let&apos;s <em className="italic">talk.</em>
        </h1>
        <p className="t-lede mt-8 max-w-md text-ink-2">
          Tell me a little about the project — what it is, when, and where — and I&apos;ll come back with ideas and availability.
        </p>

        <dl className="mt-14 space-y-8">
          <div>
            <dt className="t-label text-mute">Email</dt>
            <dd className="mt-2">
              <a href={`mailto:${site.email}`} className="link-line font-serif text-[1.75rem] leading-tight break-all md:text-[2rem]">
                {site.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="t-label text-mute">Elsewhere</dt>
            <dd className="mt-2">
              <ul className="space-y-1.5 text-[17px]">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="link-line">
                      {s.label}
                    </a>{" "}
                    <span className="text-mute">{s.handle}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="t-label text-mute">Based in</dt>
            <dd className="mt-2 text-[17px]">{site.location} — working across the GTA</dd>
          </div>
        </dl>
      </div>

      <div className="md:col-span-6 md:col-start-7 md:pt-3">
        <h2 className="sr-only">Project inquiry</h2>
        <InquiryForm />
      </div>
    </section>
  );
}
