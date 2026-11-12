import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
};

/** Text link with a trailing arrow that nudges on hover (diagonal for links that leave the site). */
export function ArrowLink({ href, children, className = "", external }: Props) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  const inner = (
    <>
      <span className="link-line">{children}</span>
      <Icon
        aria-hidden="true"
        strokeWidth={1.5}
        className={`size-[1.05em] shrink-0 transition-transform duration-500 ease-out-quint ${
          external ? "group-hover:-translate-y-0.5 group-hover:translate-x-0.5" : "group-hover:translate-x-1"
        }`}
      />
    </>
  );
  const cls = `group inline-flex items-center gap-2 ${className}`;
  if (external || href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
