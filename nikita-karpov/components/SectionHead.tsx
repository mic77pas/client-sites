/** Consistent section opener: mono index/label over a serif heading, optional aside. */
export function SectionHead({
  label,
  title,
  aside,
  id,
  as: Tag = "h2",
}: {
  label: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-col gap-6 border-t border-current/15 pt-5 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="t-label mb-4 opacity-70">{label}</p>
        <Tag id={id} className={Tag === "h1" ? "t-display" : "t-h2"}>
          {title}
        </Tag>
      </div>
      {aside ? <div className="shrink-0 md:pb-1">{aside}</div> : null}
    </div>
  );
}
