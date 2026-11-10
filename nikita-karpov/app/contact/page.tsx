import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { SocialIcon } from "@/components/SocialIcon";
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
              <a href={`mailto:${site.email}`} className="group inline-flex items-center gap-3">
                <SocialIcon name="email" className="h-6 w-6 text-mute transition-colors group-hover:text-ink" />
                <span className="link-line break-all font-serif text-[1.75rem] leading-tight md:text-[2rem]">{site.email}</span>
              </a>
            </dd>
          </div>
          <div>
            <dt className="t-label text-mute">Elsewhere</dt>
            <dd className="mt-2">
              <ul className="mt-1 border-t border-rule text-[17px]">
                {site.socials.map((s) => (
                  <li key={s.label} className="border-b border-rule">
                    <a href={s.href} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-3">
                      <SocialIcon name={s.icon} className="h-5 w-5" />
                      <span>{s.label}</span>
                      <span className="text-mute">{s.handle}</span>
                      <span
                        aria-hidden="true"
                        className="ml-auto text-mute transition-transform duration-500 ease-out-quint group-hover:translate-x-1 group-hover:text-ink"
                      >
                        ↗
                      </span>
                    </a>
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
