import { useId, type CSSProperties } from "react";
import { NK_DOT, NK_DOT_AT, NK_INK_END, NK_LETTERS, NK_STROKES, NK_VIEWBOX } from "./nk-mark.data";

/**
 * The handwritten "nk." mark as a vector, filled with the current text colour.
 *
 * With `draw`, it writes itself in on page load: a pen-shaped mask follows the
 * strokes in writing order and uncovers the real letterforms, then the dot taps
 * down. Pure CSS (see .nk-* in globals.css), so it starts with the first paint;
 * client-side navigation keeps the header mounted, so it plays once per load.
 *
 * Shape and timing data are generated from public/brand/nk-mark.png by
 * scripts/nk-mark (README there covers re-running and tuning).
 */
export function Mark({ className = "", label, draw = false }: { className?: string; label?: string; draw?: boolean }) {
  const maskId = `nk${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true as const };

  return (
    <svg
      viewBox={NK_VIEWBOX}
      fill="currentColor"
      overflow="visible"
      className={`nk ${draw ? "nk-draw" : ""} ${className}`}
      {...a11y}
    >
      {draw ? (
        <>
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="-40" y="-40" width="560" height="525">
              {NK_STROKES.map((s, i) => (
                <path
                  key={i}
                  d={s.d}
                  pathLength={1}
                  className="nk-ink"
                  fill="none"
                  stroke="#fff"
                  strokeWidth={s.w}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ "--delay": `${s.delay}s`, "--dur": `${s.dur}s`, "--ease": s.ease } as CSSProperties}
                />
              ))}
              {/* Once the pen is done, reveal everything so the final shape is exact. */}
              <rect
                x="-40"
                y="-40"
                width="560"
                height="525"
                fill="#fff"
                className="nk-done"
                style={{ "--end": `${NK_INK_END}s` } as CSSProperties}
              />
            </mask>
          </defs>
          <path d={NK_LETTERS} mask={`url(#${maskId})`} />
        </>
      ) : (
        <path d={NK_LETTERS} />
      )}
      <path d={NK_DOT} className="nk-dot" style={{ "--at": `${NK_DOT_AT}s` } as CSSProperties} />
    </svg>
  );
}
