/**
 * Re-mounts on every top-level navigation, so each page fades in rather than
 * swapping in a single frame. Opacity only: a transform here would become the
 * containing block for the lightbox and other fixed-position children.
 */
export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
