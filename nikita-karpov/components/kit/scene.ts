/**
 * Renders the kit models into one transparent canvas laid over the gear bar.
 * Each item gets its own viewport, centred on its slot in the DOM, so every
 * piece is seen straight on (no wide-angle shear at the ends of the row) and
 * the layout stays plain CSS grid.
 */
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { buildKit, type KitId } from "./models";

export type KitHandle = {
  setActive(index: number | null): void;
  dispose(): void;
};

/** Resting turn (radians, front swung towards the viewer's right) and size trim per item. */
const POSE: Record<KitId, { yaw: number; zoom: number }> = {
  a6700: { yaw: -0.48, zoom: 1.12 },
  eos7d: { yaw: -0.48, zoom: 1 },
  sigma1850: { yaw: 0.72, zoom: 1.2 },
  sony50: { yaw: 0.72, zoom: 1.22 },
  sony70200: { yaw: 0.98, zoom: 0.98 },
  sony1650: { yaw: 0.6, zoom: 1.3 },
};

const FOV = 20;
const PITCH = 0.25; // camera elevation, radians
const VIEW = 1.5; // viewport size relative to the slot, so a lifted item is never clipped
const MM_PER_SLOT = 205; // how many millimetres span one slot width at zoom 1
const BASELINE = 0.17; // where items stand, as a fraction of the slot height above its bottom edge

function shadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(0,0,0,0.42)");
  g.addColorStop(0.5, "rgba(0,0,0,0.13)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function mountKit(
  canvas: HTMLCanvasElement,
  slots: HTMLElement[],
  ids: KitId[],
  opts: { reducedMotion: boolean },
): KitHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.85;
  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(-260, 360, 320);
  const rim = new THREE.DirectionalLight(0xffffff, 3);
  rim.position.set(240, 220, -320);
  scene.add(key, rim);

  const camera = new THREE.PerspectiveCamera(FOV, 1, 20, 6000);
  const models = buildKit();
  const shadowMap = shadowTexture();

  const items = ids.map((id) => {
    const model = models[id];
    const size = model.userData.size as THREE.Vector3;
    const spin = new THREE.Group();
    spin.add(model);
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(size.x * 1.3 + 16, size.z * 1.3 + 16),
      new THREE.MeshBasicMaterial({ map: shadowMap, transparent: true, depthWrite: false, toneMapped: false }),
    );
    shadow.rotation.x = -Math.PI / 2;
    // The shadow turns with the item but stays on the ground when it lifts.
    const ground = new THREE.Group();
    ground.position.y = -size.y / 2 - 2;
    ground.add(shadow);
    const root = new THREE.Group();
    root.add(spin, ground);
    root.visible = false;
    scene.add(root);
    const rest = POSE[id].yaw;
    return { id, root, spin, ground, shadow, rest, tall: size.y, yaw: rest, lift: 0, speed: 0, rect: { x: 0, y: 0, w: 0, h: 0 } };
  });

  let active: number | null = null;
  let width = 0;
  let height = 0;

  function measure() {
    const c = canvas.getBoundingClientRect();
    width = c.width;
    height = c.height;
    renderer.setSize(width, height, false);
    items.forEach((it, i) => {
      const r = slots[i].getBoundingClientRect();
      it.rect = { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height };
    });
  }

  let last = performance.now();

  /** Advance and draw one frame. Returns whether anything is still moving. */
  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    let moving = false;
    renderer.clear();

    items.forEach((it, i) => {
      const on = active === i;
      it.lift += ((on ? 1 : 0) - it.lift) * (1 - Math.exp(-dt * 9));

      // Hovered: a slow turntable spin. Otherwise: ease back to the resting pose and stay there.
      let target: number;
      if (opts.reducedMotion) {
        // No spin: a hovered item just turns to show its other side.
        target = it.rest + (on ? -Math.sign(it.rest) * 0.9 : 0);
        it.yaw += (target - it.yaw) * (1 - Math.exp(-dt * 8));
      } else {
        it.speed += ((on ? 1.5 : 0) - it.speed) * (1 - Math.exp(-dt * (on ? 3 : 5)));
        it.yaw += it.speed * dt;
        target = it.rest + Math.round((it.yaw - it.rest) / (Math.PI * 2)) * Math.PI * 2;
        if (!on) it.yaw += (target - it.yaw) * (1 - Math.exp(-dt * 3.2));
      }
      const arrived = Math.abs(target - it.yaw) < 0.0008;
      if (!on && arrived && it.lift < 0.001 && Math.abs(it.speed) < 0.001) {
        it.yaw = it.rest;
        it.lift = 0;
        it.speed = 0;
      } else if (!(on && opts.reducedMotion && arrived && it.lift > 0.999)) {
        moving = true;
      }

      const { w, h, x, y } = it.rect;
      if (w < 2 || h < 2) return;
      const vw = w * VIEW;
      const vh = h * VIEW;
      const worldH = (vh * MM_PER_SLOT) / (w * POSE[it.id].zoom);
      const dist = worldH / (2 * Math.tan((FOV * Math.PI) / 360));
      camera.aspect = vw / vh;
      camera.position.set(0, dist * Math.sin(PITCH), dist * Math.cos(PITCH));
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      it.spin.rotation.y = it.yaw;
      it.ground.rotation.y = it.yaw;
      it.spin.position.y = it.lift * 7;
      const grow = 1 + it.lift * 0.09;
      it.root.scale.setScalar(grow);
      // Stand every item on the same line, a little above the bottom of its slot.
      const slotH = worldH / VIEW;
      it.root.position.y = (it.tall * grow - slotH) / 2 + slotH * BASELINE;
      it.shadow.scale.setScalar(1 + it.lift * 0.08);
      (it.shadow.material as THREE.MeshBasicMaterial).opacity = 1 - it.lift * 0.35;

      it.root.visible = true;
      renderer.setViewport(x + w / 2 - vw / 2, height - (y + h / 2) - vh / 2, vw, vh);
      renderer.clearDepth();
      renderer.render(scene, camera);
      it.root.visible = false;
    });
    return moving;
  }

  // Nothing moves unless an item is hovered, so frames are only drawn while something is
  // animating (and only while the bar is on screen and the tab is visible).
  let raf = 0;
  let onScreen = false;
  const tick = (now: number) => {
    raf = 0;
    if (!onScreen || document.hidden) return;
    if (frame(now)) raf = requestAnimationFrame(tick);
  };
  const kick = () => {
    if (raf || !onScreen || document.hidden) return;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    kick();
  });
  io.observe(canvas);
  document.addEventListener("visibilitychange", kick);

  const ro = new ResizeObserver(() => {
    measure();
    if (!raf) frame((last = performance.now()));
  });
  ro.observe(canvas);
  slots.forEach((s) => ro.observe(s));
  measure();
  frame((last = performance.now()));

  return {
    setActive(index) {
      active = index;
      kick();
    },
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", kick);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry.dispose();
        for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
          for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
          mat.dispose();
        }
      });
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
