/**
 * Procedural models of the gear listed on the About page. No model files: every
 * part is built from revolved profiles, extruded outlines and rounded boxes.
 *
 * Conventions: units are millimetres, +Y is up, +Z is the front of the item
 * (towards the subject), +X is the viewer's right when looking at the front.
 * Lenses are built along +Y (mount at y = 0, front element at the top) and
 * tipped forward at the end.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { LOGOS, type Brand } from "./logos";

export type KitId = "a6700" | "eos7d" | "sigma1850" | "sony50" | "sony70200" | "sony1650";

/* ---------------------------------------------------------------- textures */

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

/** Fine blotchy noise, used as a bump map for leatherette and rubber. */
function grainTexture() {
  const [small, sctx] = canvas(96, 96);
  const img = sctx.createImageData(96, 96);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 90 + Math.random() * 165;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  sctx.putImageData(img, 0, 0);
  const [c, ctx] = canvas(256, 256);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(small, 0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(0.09, 0.09);
  return t;
}

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

type TextOpts = { weight?: number; color?: string; italic?: boolean; family?: string; spacing?: number };

/** Flat printed/engraved text on a transparent plane, `h` mm tall. */
function textPlane(text: string, h: number, o: TextOpts = {}) {
  const px = 96;
  const font = `${o.italic ? "italic " : ""}${o.weight ?? 700} ${px}px ${o.family ?? FONT}`;
  const pctx = canvas(8, 8)[1];
  pctx.font = font;
  const spacing = (o.spacing ?? 0) * px;
  const width = [...text].reduce((s, ch) => s + pctx.measureText(ch).width + spacing, 0);
  const [c, ctx] = canvas(Math.ceil(width) + 24, Math.round(px * 1.3));
  ctx.font = font;
  ctx.fillStyle = o.color ?? "#e9e9e6";
  ctx.textBaseline = "middle";
  let x = 12;
  for (const ch of text) {
    ctx.fillText(ch, x, c.height / 2);
    x += ctx.measureText(ch).width + spacing;
  }
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry((h * 1.3 * c.width) / c.height, h * 1.3),
    new THREE.MeshStandardMaterial({ map, transparent: true, depthWrite: false, roughness: 0.45, metalness: 0.1 }),
  );
  mesh.renderOrder = 2;
  return mesh;
}

/** A brand wordmark as a flat print, `h` mm tall. */
function logoPlane(brand: Brand, h: number, color = "#e9e9e6") {
  const { box, d, evenOdd } = LOGOS[brand];
  const H = 160;
  const pad = 8;
  const s = H / box[3];
  const [c, ctx] = canvas(Math.ceil(box[2] * s) + pad * 2, H + pad * 2);
  ctx.translate(pad, pad);
  ctx.scale(s, s);
  ctx.translate(-box[0], -box[1]);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(d), evenOdd ? "evenodd" : "nonzero");
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry((h * c.width) / H, (h * c.height) / H),
    new THREE.MeshStandardMaterial({ map, transparent: true, depthWrite: false, roughness: 0.45, metalness: 0.1 }),
  );
  mesh.renderOrder = 2;
  return mesh;
}

/** Text set around a circle (lens name rings). Each entry is centred on `at` degrees, clockwise from the top. */
function ringText(rIn: number, rOut: number, entries: { text: string; at: number }[], color = "#d9d9d6") {
  const S = 1024;
  const [c, ctx] = canvas(S, S);
  const R = (((rIn + rOut) / 2) / rOut) * (S / 2);
  const size = ((rOut - rIn) / rOut) * (S / 2) * 0.62;
  ctx.font = `600 ${size}px ${FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const e of entries) {
    const widths = [...e.text].map((ch) => ctx.measureText(ch).width + size * 0.1);
    const total = widths.reduce((a, b) => a + b, 0);
    let a = (e.at * Math.PI) / 180 - total / (2 * R);
    [...e.text].forEach((ch, i) => {
      a += widths[i] / 2 / R;
      ctx.save();
      ctx.translate(S / 2 + R * Math.sin(a), S / 2 - R * Math.cos(a));
      ctx.rotate(a);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
      a += widths[i] / 2 / R;
    });
  }
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const mesh = new THREE.Mesh(
    new THREE.RingGeometry(rIn, rOut, 96),
    new THREE.MeshStandardMaterial({ map, transparent: true, depthWrite: false, roughness: 0.5, metalness: 0.1 }),
  );
  mesh.rotation.x = -Math.PI / 2; // face +Y, top of the text towards -Z (up once the lens is tipped forward)
  mesh.renderOrder = 2;
  return mesh;
}

/* --------------------------------------------------------------- materials */

function makeMaterials() {
  const grain = grainTexture();
  const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p);
  return {
    /** Painted magnesium / polycarbonate shell. */
    body: std({ color: 0x1b1b1d, roughness: 0.5, metalness: 0.15 }),
    /** Satin lens barrel. */
    barrel: std({ color: 0x171719, roughness: 0.42, metalness: 0.25 }),
    leather: std({ color: 0x131314, roughness: 0.82, metalness: 0, bumpMap: grain, bumpScale: 1.6 }),
    rubber: std({ color: 0x0f0f10, roughness: 0.78, metalness: 0 }),
    inner: std({ color: 0x050506, roughness: 0.55, metalness: 0.1 }),
    /** Matte plate that closes a lens throat down to the sensor or mirror opening. */
    baffle: std({ color: 0x0e0e0f, roughness: 0.72, metalness: 0.05 }),
    /** Inside faces of the box behind that opening. */
    cavity: std({ color: 0x060607, roughness: 0.8, metalness: 0, side: THREE.BackSide }),
    focusScreen: std({ color: 0x33373b, roughness: 0.9, metalness: 0 }),
    button: std({ color: 0x232325, roughness: 0.4, metalness: 0.2 }),
    steel: std({ color: 0xc8c9cc, roughness: 0.28, metalness: 1 }),
    darkSteel: std({ color: 0x55565a, roughness: 0.35, metalness: 1 }),
    orange: std({ color: 0xd4601c, roughness: 0.32, metalness: 0.85 }),
    gold: std({ color: 0xd8b25a, roughness: 0.3, metalness: 1 }),
    red: std({ color: 0xc8261c, roughness: 0.4, metalness: 0.1 }),
    white: std({ color: 0xdcdad3, roughness: 0.46, metalness: 0.05 }),
    whiteTrim: std({ color: 0xc4c2bb, roughness: 0.4, metalness: 0.2 }),
    screen: new THREE.MeshPhysicalMaterial({ color: 0x050607, roughness: 0.08, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05 }),
    lcd: std({ color: 0x3d463f, roughness: 0.25, metalness: 0.1 }),
    frosted: std({ color: 0x7d7a74, roughness: 0.3, metalness: 0 }),
    mirror: std({ color: 0x41454b, roughness: 0.08, metalness: 1, envMapIntensity: 0.65 }),
    sensor: new THREE.MeshPhysicalMaterial({
      color: 0x3f606c,
      roughness: 0.25,
      metalness: 0.65,
      iridescence: 1,
      iridescenceIOR: 1.9,
      iridescenceThicknessMaximum: 420,
    }),
    /** Rear/inner lens element: dark, glossy, with a coating tint. */
    coated: new THREE.MeshPhysicalMaterial({
      color: 0x07080d,
      roughness: 0.06,
      metalness: 0.2,
      iridescence: 0.6,
      iridescenceIOR: 1.5,
      iridescenceThicknessMaximum: 520,
    }),
    /** Front element: only its reflections are drawn, added over whatever sits behind it. */
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x000000,
      roughness: 0.02,
      metalness: 0,
      ior: 1.7,
      iridescence: 0.45,
      iridescenceIOR: 1.3,
      iridescenceThicknessMaximum: 430,
      envMapIntensity: 2.2,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  };
}
type Mats = ReturnType<typeof makeMaterials>;

/* ---------------------------------------------------------------- geometry */

type Pt = [r: number, y: number, ribbed?: 1];

/**
 * Revolve a profile around the Y axis. Unlike LatheGeometry, each profile
 * segment keeps its own normal, so steps and chamfers stay crisp while the
 * surface is still smooth around the circumference.
 *
 * Draw the profile anticlockwise in the (r, y) half-plane for outward faces:
 * out along the bottom, up the outside, in across the top, down an inner wall.
 *
 * `ribs` cuts `n` grooves of depth `d` into every point flagged as ribbed.
 */
function revolve(profile: Pt[], o: { seg?: number; smooth?: boolean; ribs?: { n: number; d: number } } = {}) {
  const ribs = o.ribs;
  const seg = ribs ? ribs.n * 4 : (o.seg ?? 72);
  const pos: number[] = [];
  const nor: number[] = [];
  const segN = profile.slice(0, -1).map((p, i) => {
    const q = profile[i + 1];
    const dr = q[0] - p[0];
    const dy = q[1] - p[1];
    const l = Math.hypot(dr, dy) || 1;
    return [dy / l, -dr / l] as const;
  });
  const vertN = (i: number, end: 0 | 1) => {
    if (!o.smooth) return segN[i];
    const a = segN[Math.max(0, Math.min(segN.length - 1, i - 1 + end))];
    const b = segN[Math.max(0, Math.min(segN.length - 1, i + end))];
    const x = a[0] + b[0];
    const y = a[1] + b[1];
    const l = Math.hypot(x, y) || 1;
    return [x / l, y / l] as const;
  };
  const rad = (p: Pt, j: number) => (ribs && p[2] && j % 4 >= 2 ? p[0] - ribs.d : p[0]);
  const push = (p: Pt, j: number, n: readonly [number, number]) => {
    const a = (j / seg) * Math.PI * 2;
    const r = rad(p, j % seg);
    pos.push(r * Math.cos(a), p[1], r * Math.sin(a));
    nor.push(n[0] * Math.cos(a), n[1], n[0] * Math.sin(a));
  };
  for (let i = 0; i < profile.length - 1; i++) {
    const p = profile[i];
    const q = profile[i + 1];
    if (p[0] === 0 && q[0] === 0) continue;
    const np = vertN(i, 0);
    const nq = vertN(i, 1);
    for (let j = 0; j < seg; j++) {
      // A=(p,j) B=(p,j+1) C=(q,j+1) D=(q,j)
      push(p, j, np);
      push(q, j, nq);
      push(p, j + 1, np);
      push(p, j + 1, np);
      push(q, j, nq);
      push(q, j + 1, nq);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  if (ribs) g.computeVertexNormals(); // non-indexed, so this gives faceted ribs
  return g;
}

/** A solid-looking ring from y0 to y1 with chamfered edges; `r` may taper. */
function band(y0: number, y1: number, r: number | [number, number], o: { c?: number; ribs?: { n: number; d: number } } = {}) {
  const [r0, r1] = typeof r === "number" ? [r, r] : r;
  const c = o.c ?? 0.5;
  const rin = Math.min(r0, r1) - 5;
  return revolve(
    [
      [rin, y0],
      [r0 - c, y0],
      [r0, y0 + c, 1],
      [r1, y1 - c, 1],
      [r1 - c, y1],
      [rin, y1],
    ],
    { ribs: o.ribs, seg: 96 },
  );
}

/** Spherical cap of aperture radius `ra`, bulging `sag` mm towards +Y. */
function dome(ra: number, sag: number) {
  const R = (ra * ra + sag * sag) / (2 * sag);
  const a0 = Math.asin(ra / R);
  const pts: Pt[] = [];
  for (let i = 0; i <= 14; i++) {
    const a = a0 * (1 - i / 14);
    pts.push([R * Math.sin(a), R * Math.cos(a) - (R - sag)]);
  }
  pts[pts.length - 1][0] = 0;
  return revolve(pts, { smooth: true, seg: 64 });
}

function roundRect(x0: number, y0: number, x1: number, y1: number, r: number) {
  const s = new THREE.Shape();
  s.moveTo(x0 + r, y0);
  s.lineTo(x1 - r, y0);
  s.absarc(x1 - r, y0 + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x1, y1 - r);
  s.absarc(x1 - r, y1 - r, r, 0, Math.PI / 2, false);
  s.lineTo(x0 + r, y1);
  s.absarc(x0 + r, y1 - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x0, y0 + r);
  s.absarc(x0 + r, y0 + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

/** Extrude a top-view outline (x, z) upwards from y0 to y1 with rounded edges of radius `b`. */
function extrudeUp(shape: THREE.Shape, y0: number, y1: number, b: number) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: y1 - y0 - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelOffset: -b,
    bevelSegments: 5,
    curveSegments: 20,
  });
  g.rotateX(Math.PI / 2);
  g.translate(0, y1 - b, 0);
  return toCreasedNormals(g, 0.6);
}

/** Extrude a front-view outline (x, y) from z0 to z1. */
function extrudeZ(shape: THREE.Shape, z0: number, z1: number, b: number) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: z1 - z0 - 2 * b,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelOffset: -b,
    bevelSegments: 5,
    curveSegments: 20,
  });
  g.translate(0, 0, z0 + b);
  return toCreasedNormals(g, 0.6);
}

function mesh(g: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) {
  const o = new THREE.Mesh(g, m);
  o.position.set(x, y, z);
  return o;
}

const box = (w: number, h: number, d: number, r = Math.min(w, h, d) * 0.25) => new RoundedBoxGeometry(w, h, d, 3, r);

/** Short cylinder standing on y = 0, optionally knurled. */
function knob(r: number, h: number, ribs?: { n: number; d: number }, c = 0.5) {
  return revolve(
    [
      [0, 0],
      [r, 0],
      [r, h - c, 1],
      [r - c, h],
      [0, h],
    ],
    { ribs, seg: 48 },
  );
}

/** Disc of radius r facing +Z with a centred rounded-rectangular window w x h. */
function throatPlate(r: number, w: number, h: number, corner: number) {
  const s = new THREE.Shape().absarc(0, 0, r, 0, Math.PI * 2, false);
  s.holes.push(roundRect(-w / 2, -h / 2, w / 2, h / 2, corner));
  return new THREE.ShapeGeometry(s, 40);
}

/** Disc facing -Z that closes the back of a throat cut through a shell; UVs in mm to match the shell. */
function rearPlug(r: number) {
  const g = new THREE.CircleGeometry(r, 48);
  g.rotateY(Math.PI);
  const p = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i), p.getY(i));
  return g;
}

/** A group whose local +Y points along world +Z: for parts that sit on a front face. */
function facing(dir: "front" | "back", x: number, y: number, z: number) {
  const g = new THREE.Group();
  g.rotation.x = dir === "front" ? Math.PI / 2 : -Math.PI / 2;
  g.position.set(x, y, z);
  return g;
}

/* ------------------------------------------------------------------ lenses */

type Band = { y: [number, number]; r: number | [number, number]; mat: THREE.Material; ribs?: { n: number; d: number }; c?: number };

type LensSpec = {
  bands: Band[];
  front: {
    /** Outer radius of the front rim. */
    r: number;
    /** Filter thread radius and how far the name ring sits below the rim. */
    thread: number;
    depth: number;
    glass: number;
    /** Name ring text, and whether it sits on the outer rim face or the recessed ring. */
    text: { text: string; at: number }[];
    textOn?: "rim" | "recess";
  };
};

function lens(m: Mats, spec: LensSpec) {
  const g = new THREE.Group();
  for (const b of spec.bands) g.add(mesh(band(b.y[0], b.y[1], b.r, { ribs: b.ribs, c: b.c }), b.mat));

  const top = Math.max(...spec.bands.map((b) => b.y[1]));
  const f = spec.front;

  // Rim face, filter thread, name ring, then a stepped tunnel behind the front element.
  const yRing = top - f.depth;
  const yGlass = yRing - 0.8;
  const rAp = f.glass * 0.46;
  const tunnel = f.glass * 0.85;
  const profile: Pt[] = [
    [f.r - 0.6, top],
    [f.thread, top],
    [f.thread, yRing],
    [f.glass, yGlass],
  ];
  const steps = 4;
  for (let k = 1; k <= steps; k++) {
    const y = yGlass - (tunnel * k) / steps;
    profile.push([f.glass + ((rAp - f.glass) * (k - 1)) / steps, y]);
    profile.push([f.glass + ((rAp - f.glass) * k) / steps, y]);
  }
  profile.push([0, yGlass - tunnel]);
  g.add(mesh(revolve(profile, { seg: 96 }), m.inner));

  g.add(mesh(dome(rAp * 1.25, rAp * 0.3), m.coated, 0, yGlass - tunnel * 0.82, 0));
  const frontGlass = mesh(dome(f.glass, f.glass * 0.14), m.glass, 0, yGlass, 0);
  frontGlass.renderOrder = 3;
  g.add(frontGlass);

  const onRim = f.textOn === "rim";
  const label = ringText(onRim ? f.thread + 1 : f.glass + 0.6, onRim ? f.r - 1.6 : f.thread - 0.6, f.text);
  // The recessed ring slopes slightly towards the glass; a flat label just above it reads the same.
  label.position.y = (onRim ? top : yRing) + 0.08;
  g.add(label);

  // E-mount bayonet and rear element.
  g.add(
    mesh(
      revolve([
        [19.5, -1.2],
        [19.5, -4],
        [23, -4],
        [23, 0.5],
      ]),
      m.steel,
    ),
  );
  g.add(mesh(revolve([[0, -1.2], [19.5, -1.2]]), m.inner));
  const rear = mesh(dome(12, 2.2), m.coated, 0, -1.2, 0);
  rear.rotation.x = Math.PI;
  g.add(rear);

  return g;
}

/** Tip a Y-built lens forward so the front element faces +Z, and centre it. */
function finishLens(g: THREE.Group) {
  g.rotation.x = Math.PI / 2;
  return centred(g);
}

function centred(inner: THREE.Object3D) {
  const outer = new THREE.Group();
  outer.add(inner);
  outer.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(outer);
  const c = b.getCenter(new THREE.Vector3());
  inner.position.sub(c);
  outer.userData.size = b.getSize(new THREE.Vector3());
  return outer;
}

function sigma1850(m: Mats) {
  const g = lens(m, {
    bands: [
      { y: [0, 9], r: [29.4, 30.6], mat: m.barrel },
      { y: [9, 20], r: 31.6, mat: m.barrel },
      { y: [20, 48], r: 32.7, mat: m.rubber, ribs: { n: 46, d: 0.75 } },
      { y: [48, 53.5], r: 31.9, mat: m.barrel },
      { y: [53.5, 66], r: 32.5, mat: m.rubber, ribs: { n: 96, d: 0.4 } },
      { y: [66, 74.5], r: [32.3, 31.6], mat: m.barrel },
    ],
    front: {
      r: 31.6,
      thread: 27.5,
      depth: 3.2,
      glass: 21,
      text: [
        { text: "SIGMA 18-50mm 1:2.8 DC DN", at: 0 },
        { text: "ø55   MADE IN JAPAN", at: 180 },
      ],
    },
  });
  // Focal length scale on the fixed barrel, and the silver "C" line badge.
  const scale = textPlane("18   24   28   35   50", 2.3, { weight: 600 });
  g.add(wrapOnto(scale, 31.6, 14.5));
  const badge = mesh(new THREE.CircleGeometry(2.6, 32), m.steel);
  badge.position.set(Math.sin(FLANK) * 30.25, 4.6, Math.cos(FLANK) * 30.25);
  badge.rotation.y = FLANK;
  g.add(badge);
  return finishLens(g);
}

function sony50(m: Mats) {
  const g = lens(m, {
    bands: [
      { y: [0, 9.5], r: [29.6, 31], mat: m.barrel },
      { y: [9.5, 11], r: 30.4, mat: m.darkSteel, c: 0.2 },
      { y: [11, 45], r: 31, mat: m.barrel, ribs: { n: 120, d: 0.32 } },
      { y: [45, 46.2], r: 30.4, mat: m.inner, c: 0.2 },
      { y: [46.2, 62], r: [31, 30.4], mat: m.barrel },
    ],
    front: {
      r: 30.4,
      thread: 24.5,
      depth: 3,
      glass: 17.5,
      text: [
        { text: "E 1.8/50 OSS", at: 0 },
        { text: "ø49   0.39m/1.28ft", at: 180 },
      ],
    },
  });
  const name = logoPlane("sony", 2.5);
  g.add(wrapOnto(name, 30.75, 54));
  return finishLens(g);
}

function sony1650(m: Mats) {
  const g = lens(m, {
    bands: [
      { y: [0, 7.5], r: [30.6, 32.3], mat: m.barrel },
      { y: [7.5, 21], r: 32.35, mat: m.barrel, ribs: { n: 130, d: 0.28 } },
      { y: [21, 22], r: 31.7, mat: m.inner, c: 0.2 },
      { y: [22, 30], r: [32.3, 31.4], mat: m.barrel, c: 1 },
    ],
    front: {
      r: 31.4,
      thread: 20.25,
      depth: 2.4,
      glass: 11.5,
      textOn: "rim",
      text: [
        { text: "E 3.5-5.6/PZ 16-50 OSS", at: 0 },
        { text: "ø40.5   0.25m/0.82ft", at: 180 },
      ],
    },
  });
  // Power-zoom lever on the side of the mount ring.
  const lever = mesh(box(4.5, 5.5, 15, 1.6), m.button, -32.2, 3.8, 0);
  g.add(lever);
  return finishLens(g);
}

function sony70200(m: Mats) {
  const ribs = { n: 44, d: 0.95 };
  const g = lens(m, {
    bands: [
      { y: [0, 6], r: 30, mat: m.barrel },
      { y: [6, 30], r: [31, 36.5], mat: m.white },
      { y: [30, 53], r: 39.2, mat: m.whiteTrim, c: 1.2 },
      { y: [53, 73], r: 37.6, mat: m.white },
      { y: [73, 105], r: 39.6, mat: m.rubber, ribs },
      { y: [105, 119], r: 38.3, mat: m.white },
      { y: [119, 151], r: 39.6, mat: m.rubber, ribs },
      { y: [151, 171.5], r: [39.4, 40], mat: m.white },
      { y: [171.5, 175], r: 39.6, mat: m.barrel },
    ],
    front: {
      r: 39.6,
      thread: 36,
      depth: 4,
      glass: 29.5,
      text: [
        { text: "FE 4/70-200 G OSS", at: 0 },
        { text: "ø72   1-1.5m/3.28-4.93ft", at: 180 },
      ],
    },
  });
  // Tripod collar foot (hangs below once the lens is tipped forward) and its lock knob.
  g.add(mesh(box(15, 20, 20, 3), m.whiteTrim, 0, 41.5, 46));
  g.add(mesh(box(34, 52, 7, 2.5), m.whiteTrim, 0, 46, 58));
  const lock = mesh(knob(5.5, 9, { n: 16, d: 0.6 }), m.rubber, 38.5, 41.5, 0);
  lock.rotation.z = -Math.PI / 2;
  g.add(lock);
  // Switch panel.
  g.add(mesh(box(4, 16, 24, 1.4), m.button, -36.6, 63, 0));
  for (const z of [-6.5, 6.5]) g.add(mesh(box(2, 4.5, 3.4, 0.8), m.white, -38.6, 63, z));
  // Focal length scale and G badge.
  const scale = textPlane("70    100    135    200", 2.8, { weight: 600, color: "#1c1c1c" });
  g.add(wrapOnto(scale, 38.3, 112));
  const badge = textPlane("G", 5.5, { weight: 700, color: "#1c1c1c" });
  g.add(wrapOnto(badge, 39.75, 161));
  return finishLens(g);
}

/**
 * Where barrel markings sit, as an angle around the lens axis: the upper flank
 * that faces the viewer in the resting pose.
 */
const FLANK = -1.92;

/** Wrap a flat label around a barrel of radius r at height y, reading around the circumference. */
function wrapOnto(label: THREE.Mesh, r: number, y: number, angle = FLANK) {
  const { width, height } = (label.geometry as THREE.PlaneGeometry).parameters;
  const g = new THREE.PlaneGeometry(width, height, 24, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const a = p.getX(i) / r;
    p.setXYZ(i, Math.sin(a) * (r + 0.1), p.getY(i), Math.cos(a) * (r + 0.1));
  }
  g.computeVertexNormals();
  label.geometry.dispose();
  label.geometry = g;
  label.position.set(0, y, 0);
  label.rotation.y = angle;
  return label;
}

/* ------------------------------------------------------------------ bodies */

function strapLug(m: Mats, x: number, y: number, z: number) {
  return mesh(box(4, 9, 6, 1.4), m.darkSteel, x, y, z);
}

function hotShoe(m: Mats) {
  const g = new THREE.Group();
  g.add(mesh(box(21, 1.2, 19, 0.5), m.darkSteel, 0, 0.5, 0));
  for (const x of [-8.6, 8.6]) g.add(mesh(box(3.6, 2.6, 19, 0.6), m.darkSteel, x, 2, 0));
  for (const x of [-7.6, 7.6]) g.add(mesh(box(5.2, 0.9, 19, 0.3), m.darkSteel, x, 3.4, 0));
  return g;
}

function sonyA6700(m: Mats) {
  const g = new THREE.Group();
  const yB = -34.5;
  const yT = 34.5;
  const zF = 16;
  const zR = -22;
  const mx = 10; // lens axis
  const my = -4;
  const yP = 23; // where the top plate starts

  // Lower shell is drawn from the front so the lens throat can be a real hole.
  // The bevel widens the hole on the faces, so it has to stay clear of the top edge.
  const shell = roundRect(-61, yB, 61, yP, 2.4);
  shell.holes.push(new THREE.Path().absarc(mx, my, 22, 0, Math.PI * 2, true));
  g.add(mesh(extrudeZ(shell, zR, zF, 2.2), m.leather));
  g.add(mesh(rearPlug(24.4), m.leather, mx, my, zR - 0.05));
  g.add(mesh(extrudeUp(roundRect(-61, zR, 61, zF, 2.8), yP, yT, 1.8), m.body));
  g.add(mesh(extrudeUp(roundRect(-61, 2, -32, 41, 12), yB, 25, 5.5), m.leather));

  // Shutter release in its power-switch collar, and the front dial below it.
  const shutter = new THREE.Group();
  shutter.add(mesh(knob(8.6, 3, { n: 24, d: 0.5 }), m.button));
  shutter.add(mesh(knob(5.6, 4.6, undefined, 1), m.darkSteel));
  shutter.position.set(-47, 23.6, 28);
  shutter.rotation.x = 0.3;
  g.add(shutter);
  const dial = mesh(knob(5.2, 9, { n: 22, d: 0.5 }), m.button, -51.5, 17.5, 38.6);
  dial.rotation.z = -Math.PI / 2;
  g.add(dial);

  // Mount: boss, orange ring, bayonet, a short throat, then a plate with a window onto the sensor.
  const mount = facing("front", mx, my, zF);
  mount.add(mesh(band(-3, 3.4, 30.2, { c: 1 }), m.body));
  mount.add(mesh(band(3.2, 4.1, 29.6, { c: 0.25 }), m.orange));
  mount.add(
    mesh(
      revolve([
        [28.2, 3.4],
        [28.2, 5],
        [23.4, 5],
        [23.4, 3],
      ]),
      m.steel,
    ),
  );
  mount.add(
    mesh(
      revolve([
        [23.4, 3.2],
        [21.6, 3.2],
        [21.6, -6.5],
      ]),
      m.inner,
    ),
  );
  // Contacts along the bottom of the throat (local +Z is down once the group faces forward).
  for (let i = 0; i < 10; i++) {
    const a = (i - 4.5) * 0.105;
    const pin = mesh(new THREE.BoxGeometry(1.5, 1.2, 2.6), m.gold, Math.sin(a) * 20.4, 2.4, Math.cos(a) * 20.4);
    pin.rotation.y = a;
    mount.add(pin);
  }
  g.add(mount);
  g.add(mesh(throatPlate(21.7, 26.8, 18.8, 1.4), m.baffle, mx, my, zF - 6.5));
  g.add(mesh(new THREE.BoxGeometry(29, 21, 4.4), m.cavity, mx, my, zF - 8.7));
  g.add(mesh(box(27.6, 19.6, 0.8, 0.3), m.button, mx, my, zF - 9.9));
  g.add(mesh(new THREE.PlaneGeometry(23.5, 15.6), m.sensor, mx, my, zF - 9.4));

  // Lens release, AF illuminator.
  const release = facing("front", 45.5, -22, zF - 0.4);
  release.add(mesh(knob(4.3, 2.6, undefined, 0.8), m.button));
  g.add(release);
  const lamp = facing("front", -27.5, 28.8, zF - 0.5);
  lamp.add(mesh(knob(2.2, 0.9, undefined, 0.3), m.frosted));
  g.add(lamp);

  // Top plate: hot shoe, mode dial over its stills/movie switch, rear dial, C1.
  const shoe = hotShoe(m);
  shoe.position.set(10, yT, -8);
  g.add(shoe);
  g.add(mesh(knob(11.4, 2.4, { n: 30, d: 0.5 }), m.button, -20, yT, -6));
  g.add(mesh(knob(9.4, 7.4, { n: 34, d: 0.45 }), m.button, -20, yT, -6));
  g.add(mesh(knob(9.2, 4.4, { n: 34, d: 0.45 }), m.button, -45, yT, -11));
  g.add(mesh(knob(2.6, 1.2, undefined, 0.4), m.button, -34, yT, 8));

  // Viewfinder eyecup, rear screen, thumb rest, control wheel and buttons.
  g.add(mesh(box(32, 23, 9, 3), m.rubber, 44, 21, zR - 3.5));
  g.add(mesh(box(16, 11, 1, 0.4), m.screen, 44, 21, zR - 7.7));
  g.add(mesh(box(77, 51, 2.4, 1), m.screen, 8, -6, zR - 0.6));
  g.add(mesh(box(15, 24, 5, 2.2), m.leather, -51, 15, zR - 1.2));
  const wheel = facing("back", -47, -13, zR + 0.4);
  wheel.add(mesh(knob(9.4, 2.2, { n: 40, d: 0.3 }), m.button));
  wheel.add(mesh(knob(4.6, 2.8, undefined, 0.6), m.button));
  g.add(wheel);
  for (const [x, y] of [
    [-38, 6],
    [-56, -29],
    [-40, -29],
  ]) {
    const b = facing("back", x, y, zR + 0.4);
    b.add(mesh(knob(2.7, 1.6, undefined, 0.5), m.button));
    g.add(b);
  }

  g.add(strapLug(m, -61.5, 24, -6), strapLug(m, 61.5, 24, -6));

  const sony = logoPlane("sony", 4.1);
  sony.position.set(-10, 28.8, zF + 0.1);
  g.add(sony);
  const alpha = textPlane("α", 6.4, { weight: 500, italic: true, family: "Georgia, serif", color: "#d9d9d6" });
  alpha.position.set(49, 28.8, zF + 0.1);
  g.add(alpha);
  const model = textPlane("6700", 3.2, { weight: 500, color: "#bdbdba" });
  model.rotation.x = -Math.PI / 2;
  model.position.set(40, yT + 0.08, 9);
  g.add(model);

  return centred(g);
}

function canonEos7d(m: Mats) {
  const g = new THREE.Group();
  const yB = -55;
  const yS = 32; // shoulder height
  const zF = 16;
  const zR = -30;
  const cx = 6; // lens axis sits right of centre, away from the grip
  const cy = -8;

  // Drawn from the front so the mirror box can be a real hole.
  const shell = roundRect(-74, yB, 74, yS, 9);
  shell.holes.push(new THREE.Path().absarc(cx, cy, 26.4, 0, Math.PI * 2, true));
  g.add(mesh(extrudeZ(shell, zR, zF, 6), m.body));
  g.add(mesh(rearPlug(32.7), m.body, cx, cy, zR - 0.05));
  g.add(mesh(extrudeUp(roundRect(-74, 0, -35, 45, 16), yB, 25, 8), m.leather));

  // Pentaprism housing with the flash nose leaning over the mount.
  const hump = new THREE.Shape();
  hump.moveTo(-34, 22);
  hump.lineTo(-27, 46);
  hump.quadraticCurveTo(-24, 56.5, -11, 56.5);
  hump.lineTo(11, 56.5);
  hump.quadraticCurveTo(24, 56.5, 27, 46);
  hump.lineTo(34, 22);
  hump.closePath();
  g.add(mesh(extrudeZ(hump, zR - 1, zF - 2, 4), m.body, cx));
  const nose = mesh(box(50, 22, 26, 6), m.body, cx, 37, zF - 1);
  nose.rotation.x = -0.42;
  g.add(nose);
  const canon = logoPlane("canon", 7);
  canon.position.set(0, -1.2, 13.12);
  nose.add(canon);

  const shoe = hotShoe(m);
  shoe.position.set(cx, 56.3, -14);
  g.add(shoe);

  // Mount: boss, bayonet ring and a short throat. Behind it a plate with a window onto the
  // mirror box, where the reflex mirror fills the window and the focusing screen sits above.
  const mount = facing("front", cx, cy, zF);
  mount.add(mesh(band(-3, 5, 37.5, { c: 1.4 }), m.body));
  mount.add(
    mesh(
      revolve([
        [33.4, 4.6],
        [33.4, 6.4],
        [27, 6.4],
        [27, 4],
      ]),
      m.steel,
    ),
  );
  mount.add(
    mesh(
      revolve([
        [27, 4.2],
        [25.6, 4.2],
        [25.6, -2.5],
      ]),
      m.inner,
    ),
  );
  mount.add(mesh(knob(1.4, 0.5, undefined, 0.1), m.red, 0, 6.2, -30.4));
  mount.add(mesh(box(2.4, 0.6, 2.4, 0.1), m.white, 12, 6.3, -27.6));
  for (let i = 0; i < 8; i++) {
    const a = (i - 3.5) * 0.11;
    const pin = mesh(new THREE.BoxGeometry(1.7, 1.4, 2.6), m.gold, Math.sin(a) * 24.4, 2.6, Math.cos(a) * 24.4);
    pin.rotation.y = a;
    mount.add(pin);
  }
  g.add(mount);
  const zBox = zF - 2.5;
  g.add(mesh(throatPlate(25.7, 34, 25, 3.5), m.baffle, cx, cy, zBox));
  g.add(mesh(new THREE.BoxGeometry(35.5, 26.5, 30), m.cavity, cx, cy, zBox - 15));
  const screen = mesh(new THREE.PlaneGeometry(30, 22), m.focusScreen, cx, cy + 13.2, zBox - 15);
  screen.rotation.x = Math.PI / 2;
  g.add(screen);
  const mirror = mesh(new THREE.PlaneGeometry(35.4, 36), m.mirror, cx, cy - 0.3, zBox - 14.7);
  mirror.rotation.x = -Math.PI / 4;
  g.add(mirror);

  // Lens release, depth-of-field preview, self-timer lamp.
  const release = facing("front", cx + 43.5, -6, zF - 1);
  release.add(mesh(knob(6.6, 4.6, undefined, 1.4), m.button));
  g.add(release);
  const dof = facing("front", cx - 33, -38, zF - 1);
  dof.add(mesh(knob(4, 3, undefined, 1), m.button));
  g.add(dof);
  const lamp = facing("front", -29, 19, zF - 0.6);
  lamp.add(mesh(knob(2.8, 1, undefined, 0.3), m.frosted));
  g.add(lamp);

  // Grip top: shutter release and main dial.
  const shutter = new THREE.Group();
  shutter.add(mesh(knob(7.6, 2, undefined, 0.8), m.body));
  shutter.add(mesh(knob(5.6, 3.4, undefined, 1.2), m.button));
  shutter.position.set(-55, 22.6, 33);
  shutter.rotation.x = 0.45;
  g.add(shutter);
  const dial = mesh(knob(6.6, 11, { n: 26, d: 0.6 }), m.rubber, -60.5, 26.5, 19);
  dial.rotation.z = -Math.PI / 2;
  g.add(dial);

  // Shoulders: top LCD with its button row, mode dial over the power switch.
  g.add(mesh(box(38, 1.4, 21, 0.5), m.lcd, -50, yS + 0.3, -13));
  for (const x of [-62, -52, -42, -32]) g.add(mesh(knob(2.5, 1.3, undefined, 0.4), m.button, x, yS - 0.2, 3.5));
  g.add(mesh(knob(15, 2.4, undefined, 0.6), m.button, 54, yS - 0.4, -9));
  g.add(mesh(knob(12.6, 10.4, { n: 40, d: 0.55 }), m.button, 54, yS, -9));
  g.add(mesh(knob(9, 10.9, undefined, 0.3), m.darkSteel, 54, yS, -9));

  // Back: eyecup, screen, quick-control dial, joystick, button column.
  g.add(mesh(box(36, 25, 10, 4), m.rubber, cx, 41, zR - 5));
  g.add(mesh(box(18, 12, 1, 0.4), m.screen, cx, 41, zR - 9.7));
  g.add(mesh(box(68, 52, 2, 0.8), m.screen, 8, -14, zR - 0.4));
  const qcd = facing("back", -47, -24, zR + 0.6);
  qcd.add(mesh(knob(17, 3, { n: 60, d: 0.35 }), m.button));
  qcd.add(mesh(knob(7, 3.8, undefined, 0.8), m.button));
  g.add(qcd);
  const stick = facing("back", -45, 6, zR + 0.6);
  stick.add(mesh(knob(4.4, 3.2, { n: 14, d: 0.4 }), m.rubber));
  g.add(stick);
  for (const y of [22, 8, -6, -20, -34]) {
    const b = facing("back", 62, y, zR + 0.6);
    b.add(mesh(knob(3, 1.6, undefined, 0.5), m.button));
    g.add(b);
  }
  for (const x of [-64, -52, -40]) {
    const b = facing("back", x, 25, zR + 0.6);
    b.add(mesh(knob(3.3, 1.8, undefined, 0.5), m.button));
    g.add(b);
  }

  g.add(strapLug(m, -74.6, 24, -8), strapLug(m, 74.6, 24, -8));

  const eos = textPlane("EOS", 4.6, { weight: 700, italic: true, color: "#cfcfcc" });
  eos.position.set(46, 22.5, zF + 0.1);
  g.add(eos);
  const seven = textPlane("7D", 7.4, { weight: 700, color: "#dededb" });
  seven.position.set(60, 22.5, zF + 0.1);
  g.add(seven);

  return centred(g);
}

/* ----------------------------------------------------------------- exports */

export function buildKit(): Record<KitId, THREE.Group> {
  const m = makeMaterials();
  return {
    a6700: sonyA6700(m),
    eos7d: canonEos7d(m),
    sigma1850: sigma1850(m),
    sony50: sony50(m),
    sony70200: sony70200(m),
    sony1650: sony1650(m),
  };
}
