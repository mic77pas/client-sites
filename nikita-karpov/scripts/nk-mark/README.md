# nk-mark generator

Builds `components/nk-mark.data.ts` (logo outline + timed pen strokes for the
write-on animation) from `public/brand/nk-mark.png`. Run from this folder:

```sh
npm i --no-save potrace@2.1.8          # sharp is already a project dependency
node trace.cjs ../../public/brand/nk-mark.png   # outline  -> fill.d.txt
python skel.py ../../public/brand/nk-mark.png   # skeleton -> skel.npy, dist.npy, skel.png (needs numpy, scipy, pillow)
python strokes.py                               # ordered pen paths + timing -> strokes.json
node gen.cjs ../../components/nk-mark.data.ts
```

Tuning:
- Stroke order and pen lifts: `STROKES` in strokes.py (points in the PNG's 480x445 space; skel.png shows the grid).
- Overall pace and pauses: `START`, `INK`, `LIFT`, `DOT_PAUSE` in gen.cjs.
- Dot tap: `@keyframes nk-dot` in app/globals.css.
