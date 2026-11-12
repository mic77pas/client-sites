import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
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
        <h1 className="t-display">Let&apos;s talk.</h1>
        <p className="t-lede mt-8 max-w-md text-ink-2">
          Tell me a little about the project: what it is, when, and where. I&apos;ll come back with ideas and availability.
        </p>

        <a href={`mailto:${site.email}`} className="group mt-14 inline-flex items-center gap-3">
          <SocialIcon name="email" className="h-6 w-6 text-mute transition-colors group-hover:text-ink" />
          <span className="link-line t-wide break-all text-[1.35rem] leading-tight md:text-[1.6rem]">{site.email}</span>
        </a>

        <ul className="mt-8 space-y-1 text-[17px]">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${s.label}: ${s.handle}`}
                className="group inline-flex items-center gap-3 py-1.5"
              >
                <SocialIcon name={s.icon} className="h-5 w-5 text-mute transition-colors group-hover:text-ink" />
                <span className="link-line">{s.handle}</span>
                <ArrowUpRight
                  aria-hidden="true"
                  strokeWidth={1.5}
                  className="size-4 text-mute transition-[color,translate] duration-500 ease-out-quint group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-[15px] text-mute">Based in {site.location}, working across the GTA.</p>
      </div>

      <div className="md:col-span-6 md:col-start-7 md:pt-3">
        <h2 className="sr-only">Project inquiry</h2>
        <InquiryForm />
      </div>
    </section>
  );
}
