import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
};

/** Text link with a trailing arrow that nudges on hover. */
export function ArrowLink({ href, children, className = "", external }: Props) {
  const inner = (
    <>
      <span className="link-line">{children}</span>
      <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-quint group-hover:translate-x-1">
        →
      </span>
    </>
  );
  const cls = `group inline-flex items-baseline gap-2 ${className}`;
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
