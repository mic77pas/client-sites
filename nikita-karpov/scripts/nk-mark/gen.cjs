const fs = require("fs");
const [outFile] = process.argv.slice(2);
const strokes = JSON.parse(fs.readFileSync("strokes.json", "utf8"));
const fill = fs.readFileSync("fill.d.txt", "utf8").replace(/(\d+\.\d)\d+/g, "$1").replace(/, /g, " ").replace(/\s+/g, " ").trim();
// potrace emits the joined "nk" outline first, then the dot
const sub = fill.split(/(?=M )/);
if (sub.length !== 2) throw new Error("expected 2 subpaths, got " + sub.length);
const [letters, dot] = sub.map((s) => s.trim());

// Timing (seconds). The whole mark is one continuous motion on a single eased
// timeline (no pauses at pen lifts), sized to sit with the home intro: it starts
// with the headline words and the dot lands as the hero settles.
const START = 0.14, INK = 1.1, DOT_GAP = 0.04;
// Global ease over the whole drawing: quick off the mark, long soft settle.
const EASE = [0.3, 0, 0.15, 1];
const r1 = (n) => +n.toFixed(1), r3 = (n) => +n.toFixed(3);

const bez = (a, b, s) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
function easeInverse(y) { // time fraction at which the eased progress reaches y
  let lo = 0, hi = 1;
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; bez(EASE[1], EASE[3], m) < y ? (lo = m) : (hi = m); }
  return bez(EASE[0], EASE[2], (lo + hi) / 2);
}

const order = ["n", "k", "leg"];
const total = order.reduce((a, k) => a + strokes[k].T, 0);
let offset = 0;
const segs = [];
for (const key of order) {
  const { pts, w, t, T } = strokes[key];
  const at = (i) => START + INK * easeInverse((offset + t[i] * T) / total);
  let a = 0;
  while (a < pts.length - 1) {
    // grow the segment while the local stroke width stays within a band
    let b = a + 1, lo = w[a], hi = w[a];
    while (b < pts.length - 1) {
      const nlo = Math.min(lo, w[b + 1]), nhi = Math.max(hi, w[b + 1]);
      if (nhi - nlo > 9 && b - a >= 6) break;
      lo = nlo; hi = nhi; b++;
    }
    const idx = []; for (let i = a; i < b; i += 3) idx.push(i); idx.push(b);
    const seg = idx.map((i) => pts[i]);
    const d = "M" + seg.map(([x, y]) => `${Math.round(x)} ${Math.round(y)}`).join("L");
    const len = [0];
    for (let i = 1; i < seg.length; i++) len.push(len[i - 1] + Math.hypot(seg[i][0] - seg[i - 1][0], seg[i][1] - seg[i - 1][1]));
    const t0 = at(a), t1 = at(b), span = Math.max(t1 - t0, 1e-4);
    const step = Math.max(1, Math.round(seg.length / 6));
    const stops = [];
    for (let i = 0; i < seg.length; i += step) stops.push([len[i] / len.at(-1), (at(idx[i]) - t0) / span]);
    if (stops.at(-1)[0] < 1) stops.push([1, 1]);
    const ease = "linear(" + stops.map(([p, q], i) => (i === 0 ? "0" : i === stops.length - 1 ? "1" : `${r3(p)} ${r3(q * 100)}%`)).join(", ") + ")";
    segs.push({ d, w: r1(hi), delay: r3(t0), dur: r3(span), ease });
    a = b;
  }
  offset += T;
}
const leg = { end: START + INK };
const dotAt = r3(leg.end + DOT_GAP);

const ts = `// Generated from public/brand/nk-mark.png by scripts/nk-mark (see its README). Do not edit by hand.
// Outline: potrace of the mark. Strokes: centre lines in writing order, timed with the
// two-thirds power law of handwriting (the pen slows in tight curves, speeds up on sweeps).

export const NK_VIEWBOX = "0 0 480 445";

/** The joined "nk" letterforms, exact outline of the mark. */
export const NK_LETTERS = "${letters}";

/** The dot. */
export const NK_DOT = "${dot}";

/** Pen path, split where the stroke width changes. delay/dur in seconds. */
export const NK_STROKES: { d: string; w: number; delay: number; dur: number; ease: string }[] = ${JSON.stringify(segs, null, 0).replace(/},{/g, "},\n  {").replace(/^\[/, "[\n  ").replace(/\]$/, ",\n]")};

/** When the last stroke finishes (seconds); the mask then fills in completely. */
export const NK_INK_END = ${r3(leg.end)};

/** When the dot lands (seconds). */
export const NK_DOT_AT = ${dotAt};
`;
fs.writeFileSync(outFile, ts);
console.log("segments", segs.length, "ink ends", r3(leg.end), "dot at", dotAt, "file KB", (ts.length / 1024).toFixed(1));
