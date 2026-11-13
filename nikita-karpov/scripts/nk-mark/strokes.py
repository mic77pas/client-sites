# Ordered centre-line strokes along the skeleton + human pen timing (2/3 power law).
import numpy as np, json
from collections import deque
from scipy import ndimage as ndi
sk = np.load("skel.npy"); dist = np.load("dist.npy"); K = 2
pts = np.argwhere(sk == 1)
def snap(x, y):  # nearest skeleton pixel to a 1x coordinate
    d = ((pts[:, 1] - x * K) ** 2 + (pts[:, 0] - y * K) ** 2)
    return tuple(pts[d.argmin()])
def bfs(a, b):
    prev = {a: None}; q = deque([a])
    while q:
        c = q.popleft()
        if c == b: break
        for dy in (-1, 0, 1):
            for dx in (-1, 0, 1):
                n = (c[0] + dy, c[1] + dx)
                if (dy or dx) and 0 <= n[0] < sk.shape[0] and 0 <= n[1] < sk.shape[1] and sk[n] and n not in prev:
                    prev[n] = c; q.append(n)
    path = []; c = b
    while c is not None: path.append(c); c = prev[c]
    return path[::-1]
def route(waypoints):
    out = []
    for a, b in zip(waypoints, waypoints[1:]):
        seg = bfs(snap(*a), snap(*b)); out += seg if not out else seg[1:]
    return np.array([[x / K, y / K, dist[y, x] / K] for y, x in out], float)

STROKES = {
  # n: first leg down and back up, over the hump to its tip, down the second leg, sweep into the k
  "n":   [(114,193),(18,354),(230,210),(148,369),(266,306)],
  # k: ascender top-down into the heavy base, up through the waist, out along the arm to the hook
  "k":   [(454,20),(287,344),(459,221)],
  # k leg, a separate flick
  "leg": [(350,284),(417,433)],
}
def smooth(p, r):
    if r == 0: return p
    k = np.ones(2 * r + 1) / (2 * r + 1); q = p.copy()
    for c in range(p.shape[1]):
        pad = np.concatenate([np.repeat(p[:1, c], r), p[:, c], np.repeat(p[-1:, c], r)])
        q[:, c] = np.convolve(pad, k, mode="valid")
    q[0], q[-1] = p[0], p[-1]
    return q
def resample(p, step):
    seg = np.hypot(*np.diff(p[:, :2], axis=0).T); s = np.concatenate([[0], np.cumsum(seg)])
    t = np.arange(0, s[-1], step); t = np.append(t, s[-1])
    return np.stack([np.interp(t, s, p[:, i]) for i in range(p.shape[1])], 1), s[-1]

def extend(p, cuspIdx):
    # skeleton stops ~half a stroke-width short of each rounded end; push the ends out
    for i, j in ((0, 3), (-1, -4)):
        d = p[i, :2] - p[j, :2]; d /= np.hypot(*d) or 1
        p[i, :2] += d * p[i, 2] * 0.55
    return p

out = {}
for name, wp in STROKES.items():
    raw = route(wp)
    # locate reversal points (waypoints in the middle) so smoothing doesn't round them off
    p = smooth(raw, 4)
    p, L = resample(p, 2.0)
    p = extend(p, None)
    # curvature
    v = np.gradient(p[:, :2], axis=0); a = np.gradient(v, axis=0)
    kappa = np.abs(v[:, 0] * a[:, 1] - v[:, 1] * a[:, 0]) / np.maximum(np.hypot(*v.T) ** 3, 1e-6)
    kappa = ndi.gaussian_filter1d(np.minimum(kappa, 1 / 3), 2)
    speed = (kappa + 0.004) ** (-1 / 3)            # two-thirds power law
    speed = np.minimum(speed, np.percentile(speed, 95))
    # reversals: heading turns > 110 deg within ~6 units
    hd = np.arctan2(*np.gradient(p[:, :2], axis=0)[:, ::-1].T)
    s_ = np.concatenate([[0], np.cumsum(np.hypot(*np.diff(p[:, :2], axis=0).T))])
    turn = np.abs((np.roll(hd, -3) - np.roll(hd, 3) + np.pi) % (2 * np.pi) - np.pi); turn[:3] = turn[-3:] = 0
    cusps = []
    for i in np.argsort(-turn):
        if turn[i] < np.radians(110): break
        if all(abs(s_[i] - s_[j]) > 30 for j in cusps): cusps.append(i)
    for i in cusps:
        u = np.clip(np.abs(s_ - s_[i]) / 22, 0, 1)
        speed *= 0.55 + 0.45 * (u * u * (3 - 2 * u))
    print("  cusps at", [tuple(p[i, :2].round()) for i in cusps])
    speed = speed ** 0.6  # keep the power-law shape, soften the contrast: one fluid motion
    n = len(p); ramp = np.minimum(1, np.minimum(np.arange(n) + 1, n - np.arange(n)) / 12)
    speed *= 0.7 + 0.3 * np.sin(ramp * np.pi / 2)  # pen accelerates off the page, settles at the end
    ds = np.hypot(*np.diff(p[:, :2], axis=0).T)
    t = np.concatenate([[0], np.cumsum(ds / ((speed[1:] + speed[:-1]) / 2))])
    out[name] = {"pts": p[:, :2].round(1).tolist(), "w": (2 * p[:, 2] + 7).round(1).tolist(), "t": (t / t[-1]).round(4).tolist(), "T": float(t[-1]), "L": float(L)}
    print(name, "len", round(L), "samples", n, "rel duration", round(t[-1], 1), "w range", round(min(out[name]["w"]),1), round(max(out[name]["w"]),1))
json.dump(out, open("strokes.json", "w"))
