/**
 * Re-mounts on every series switch (templates are keyed by segment), so the
 * new gallery fades in under the persistent header instead of snapping in.
 */
export default function WorkTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
