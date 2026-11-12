"use client";

import { useId, useState } from "react";
import { ArrowRight } from "lucide-react";
import { projectTypes, site } from "@/content/site";

/**
 * Project inquiry form. There's no backend yet, so submitting opens the
 * visitor's email app with everything pre-filled and addressed to Nik.
 * (Swap the submit handler for an API route if a mail service is added later.)
 */
export function InquiryForm() {
  const uid = useId();
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const field =
    "w-full border-0 border-b border-ink/25 bg-transparent px-0 py-3 text-[17px] text-ink placeholder:text-mute/70 focus:border-ink focus:ring-0 focus:outline-none transition-colors";
  const label = "t-label text-mute";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const subject = `${get("type") || "Project"} inquiry from ${get("name")}`;
    const body = [
      `Name: ${get("name")}`,
      `Email: ${get("email")}`,
      `Project: ${get("type")}`,
      get("when") ? `Date / timing: ${get("when")}` : null,
      "",
      get("message"),
    ]
      .filter((l) => l !== null)
      .join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the address is visible anyway */
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate={false}>
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className={label}>
            Name
          </label>
          <input id={`${uid}-name`} name="name" required autoComplete="name" className={field} />
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className={label}>
            Email
          </label>
          <input id={`${uid}-email`} name="email" type="email" required autoComplete="email" className={field} />
        </div>
      </div>

      <fieldset>
        <legend className={label}>What do you need?</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {projectTypes.map((t, i) => (
            <label key={t} className="cursor-pointer">
              <input type="radio" name="type" value={t} defaultChecked={i === 0} className="peer sr-only" />
              <span className="block border border-ink/25 px-3.5 py-2 text-[15px] transition-colors hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-safelight">
                {t}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor={`${uid}-when`} className={label}>
          Date or timing <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input id={`${uid}-when`} name="when" placeholder="e.g. 14 June, or “sometime this spring”" className={field} />
      </div>

      <div>
        <label htmlFor={`${uid}-message`} className={label}>
          About the project
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          required
          rows={5}
          placeholder="What it is, where, and anything you already have in mind."
          className={`${field} resize-y`}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          className="group inline-flex items-center justify-between gap-6 bg-ink px-6 py-4 text-[15px] text-paper transition-colors hover:bg-ink-2"
        >
          Send inquiry
          <ArrowRight
            aria-hidden="true"
            strokeWidth={1.5}
            className="size-[18px] transition-transform duration-500 ease-out-quint group-hover:translate-x-1"
          />
        </button>
        <p className="text-[13px] leading-snug text-mute sm:max-w-[16rem]">Opens your email app with the details filled in.</p>
      </div>

      <div aria-live="polite" className="text-[15px]">
        {sent ? (
          <p className="border-l-2 border-safelight pl-4">
            If your email app didn&apos;t open, write to{" "}
            <a href={`mailto:${site.email}`} className="underline underline-offset-4">
              {site.email}
            </a>{" "}
            <button type="button" onClick={copyEmail} className="t-label ml-1 text-mute underline underline-offset-4 hover:text-ink">
              {copied ? "Copied" : "Copy"}
            </button>
          </p>
        ) : null}
      </div>
    </form>
  );
}
