/** Consistent section opener: heading with an optional aside. Spacing, not a rule, sets it apart. */
export function SectionHead({
  title,
  aside,
  id,
  as: Tag = "h2",
}: {
  title: React.ReactNode;
  aside?: React.ReactNode;
  id?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <Tag id={id} className={`max-w-3xl ${Tag === "h1" ? "t-display" : "t-h2"}`}>
        {title}
      </Tag>
      {aside ? <div className="shrink-0 md:pb-1">{aside}</div> : null}
    </div>
  );
}
