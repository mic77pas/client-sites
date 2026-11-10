/** The handwritten "nk." mark, recoloured via CSS mask (inherits text colour). */
export function Mark({ className = "", label }: { className?: string; label?: string }) {
  return label ? (
    <span role="img" aria-label={label} className={`mark ${className}`} />
  ) : (
    <span aria-hidden="true" className={`mark ${className}`} />
  );
}
