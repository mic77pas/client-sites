import { Mail } from "lucide-react";

/**
 * Icons for contact links. Email comes from Lucide; Lucide no longer ships brand
 * logos, so Instagram, LinkedIn and YouTube are drawn here on the same 24px grid
 * and 1.5 stroke so they sit alongside it.
 */
export type SocialIconName = "instagram" | "linkedin" | "youtube" | "email";

export function SocialIcon({ name, className = "h-[18px] w-[18px]" }: { name: SocialIconName; className?: string }) {
  if (name === "email") return <Mail aria-hidden="true" strokeWidth={1.5} className={`shrink-0 ${className}`} />;
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`shrink-0 fill-none stroke-current stroke-[1.5] ${className}`}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === "instagram" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.25" cy="6.75" r="0.6" className="fill-current" />
        </>
      ) : name === "linkedin" ? (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2.5" />
          <path d="M8 10.5V17M8 7.25v.01M11.75 17v-6.5M11.75 13.25c0-1.6 1.1-2.75 2.6-2.75s2.4 1.05 2.4 2.75V17" />
        </>
      ) : (
        <>
          <path d="M2.75 12c0-2.6.2-4.2.5-5 .3-.9 1-1.5 1.9-1.65C6.5 5.1 9 5 12 5s5.5.1 6.85.35c.9.15 1.6.75 1.9 1.65.3.8.5 2.4.5 5s-.2 4.2-.5 5c-.3.9-1 1.5-1.9 1.65C17.5 18.9 15 19 12 19s-5.5-.1-6.85-.35c-.9-.15-1.6-.75-1.9-1.65-.3-.8-.5-2.4-.5-5Z" />
          <path d="m10.25 9.25 4.5 2.75-4.5 2.75Z" />
        </>
      )}
    </svg>
  );
}
