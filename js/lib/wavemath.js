export const LINE_COUNT = 12;

export function sineLine(i, n, t) {
  const out = new Float32Array(n);
  const freq = 2 + (i % 3) * 2 + Math.floor(i / 3) * 0.7;   // cycles across the width
  const speed = 0.15 + (i % 4) * 0.07;                      // drift, cycles per second
  const amp = 0.55 + 0.35 * Math.sin(i * 1.7);
  for (let k = 0; k < n; k++) out[k] = amp * Math.sin(2 * Math.PI * (freq * k / n + speed * t) + i);
  return out;
}

export function progress(scrollY, docHeight, viewH) {
  const mid = docHeight - viewH;   // full scroll range: 0 at top, 1 at the very bottom
  if (mid <= 0) return 1;
  return Math.min(1, Math.max(0, scrollY / mid));
}

const ease = x => x * x * (3 - 2 * x);   // smoothstep

// merge amount from scroll progress: 1 (merged) at the top, easing to 0 (open) at p = openAt, then 0 for good; width > 1 keeps the lines open longer
export function mergeAt(p, openAt = 0.5, width = 1) {
  const u = Math.min(1, Math.max(0, p / openAt));
  return 1 - Math.sin(Math.PI / 2 * u) ** (1 / width);
}

// flyover tilt from scroll progress: 0 until `from`, easing to 1 at `to`, then 1 for good
export function tiltAt(p, from = 0.55, to = 0.85) {
  return ease(Math.min(1, Math.max(0, (p - from) / (to - from))));
}

// row depth d (0 = horizon, 1 = at the viewer) -> screen spread 0..1, spaced like 1/z so rows bunch near the horizon
export function perspective(d, near = 0.08) {
  const z = near + (1 - near) * (1 - Math.min(1, Math.max(0, d)));
  return (1 / z - 1) / (1 / near - 1);
}

// landscape fit: baseline reach below the horizon so the nearest row's baseline plus its full amplitude stays `margin` (fraction of h) above the bottom edge
export function reachFor(h, horizonY, ampFrac, margin = 0.03) {
  return Math.max(0, h - horizonY - h * (ampFrac + margin));
}

// trapezoid: row width as a fraction of the viewport, linear from back (d=0) to front (d=1)
export function rowWidth(d, back, front) {
  return back + (front - back) * Math.min(1, Math.max(0, d));
}

// m: merge amount, 0 = spread, 1 = merged
export function lineY(i, m, height, span = 0.84) {
  const spread = (i + 0.5) / LINE_COUNT;              // 0..1 down the viewport
  const start = height * ((1 - span) / 2 + span * spread);
  const stagger = (i % 4) * 0.06;                      // stems arrive at slightly different times
  const k = ease(Math.min(1, Math.max(0, (m - stagger) / (1 - stagger))));
  return start + (height / 2 - start) * k;
}

export function blend(a, b, k, out = new Float32Array(a.length)) {
  for (let j = 0; j < a.length; j++) out[j] = a[j] * (1 - k) + b[j] * k;
  return out;
}

// sum of lines into out (unnormalised); returns the raw peak
export function mixInto(lines, out) {
  out.fill(0);
  for (const l of lines) for (let j = 0; j < out.length; j++) out[j] += l[j];
  let peak = 0; for (const v of out) peak = Math.max(peak, Math.abs(v));
  return peak;
}

export function mixOf(lines) {
  const out = new Float32Array(lines[0].length), peak = mixInto(lines, out);
  if (peak > 0) for (let j = 0; j < out.length; j++) out[j] /= peak;
  return out;
}

// exact samples from an integer start (no interpolation, so peaks keep their height); the caller
// slides the drawn line by the fractional remainder for smooth scrolling
export function windowAt(band, pos01, n, out = new Float32Array(n)) {
  const len = band.length, i0 = Math.floor(pos01 * len);
  for (let j = 0; j < n; j++) out[j] = band[(i0 + j) % len];
  return out;
}
// shift a buffer left by s points in place (content scrolled), keeping the tail as-is
export function shiftInto(buf, s) {
  const n = buf.length;
  if (s <= 0) return buf;
  if (s >= n) return buf;
  buf.copyWithin(0, s);
  return buf;
}

// moving average of radius r into out (edges clamp); no allocation
export function smoothInto(src, r, out) {
  const n = src.length;
  for (let i = 0; i < n; i++) {
    const lo = Math.max(0, i - r), hi = Math.min(n - 1, i + r);
    let sum = 0; for (let d = lo; d <= hi; d++) sum += src[d];
    out[i] = sum / (hi - lo + 1);
  }
  return out;
}

// persistence: prev = prev * k + next * (1 - k), in place
export function persistInto(prev, next, k) {
  for (let j = 0; j < prev.length; j++) prev[j] = prev[j] * k + next[j] * (1 - k);
  return prev;
}

export function downsample(data, n) {
  const out = new Float32Array(n), size = data.length / n;
  let peak = 0;
  for (let b = 0; b < n; b++) {
    let best = 0;
    for (let j = Math.floor(b * size); j < Math.floor((b + 1) * size); j++) if (Math.abs(data[j]) > Math.abs(best)) best = data[j];
    out[b] = best; peak = Math.max(peak, Math.abs(best));
  }
  if (peak > 0) for (let b = 0; b < n; b++) out[b] /= peak;
  return out;
}

// mix a #rrggbb colour toward white (k > 0) or black (k < 0), |k| <= 1
export function shade(hex, k) {
  const t = k < 0 ? 0 : 255, a = Math.min(1, Math.abs(k));
  return '#' + [1, 3, 5].map(o => {
    const c = parseInt(hex.slice(o, o + 2), 16);
    return Math.round(c + (t - c) * a).toString(16).padStart(2, '0');
  }).join('');
}
