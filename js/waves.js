import { state, onChange } from './state.js';
import { shade, LINE_COUNT, sineLine, progress, mergeAt, tiltAt, perspective, reachFor, rowWidth, lineY, blend, mixInto, windowAt, shiftInto, smoothInto, persistInto } from './lib/wavemath.js';

// live tuning: read every frame; the ?tune / "wave knobs" panel edits it, and its JSON pastes straight over this literal
export const TUNE = {
  amp: 0.4,          // half-amplitude as a fraction of lane spacing while spread (>0.5 overlaps)
  ampMerged: 0.15,   // half-amplitude as a fraction of height once the lines merge
  spread: 0.95,      // fraction of viewport height the 12 lines span
  timebase: 1728,     // band points across the screen width
  resolution: 2176,  // band points per scene loop (recomputed on change)
  scroll: 1.4,      // band loops scrolled per scene loop (1 = phase-locked to the audio)
  smooth: 3,         // moving-average radius in points
  persist: 0.57,      // 0..0.98, how much of the previous frame's shape each line keeps
  gain: true,        // live per-stem loudness gain
  gainRef: 0.1,      // live stem RMS that counts as full loudness
  attack: 0.1,      // seconds, loudness swell
  release: 0.85,      // seconds, loudness fall
  lineWidth: 0.5,      // multiplier on the per-band stroke width
  mergedWidth: 1.5,  // stroke width (px) of the merged line; lines blend toward it as they merge
  openAt: 0.34,       // scroll position (0..1) where the 12 lines are fully open; merged above it
  openWidth: 1.5,      // >1 keeps the lines open longer around openAt, <1 closes them sooner (bell exponent 1/openWidth)
  alpha: 0.9,          // multiplier on the per-band opacity
  fly: true,         // mid-page perspective flyover on/off
  flyFrom: 0.37,     // scroll position where the lanes start tilting into the landscape (kept > openAt)
  flyTo: 0.78,       // scroll position where the landscape is complete; it then stays to the bottom
  bandShade: 0.29,  // colour step between a stem's low/mid/high lines: low darker, high lighter (0 = same colour)
  camera: 0.69,      // camera distance for the landscape: larger = further back = flatter, more even rows, smaller front rows
  horizon: 0.59,     // horizon line as a fraction of viewport height
  backWidth: 1,     // landscape row width at the back (horizon), fraction of the viewport
  frontWidth: 1,  // landscape row width at the front; below backWidth = wider at the back
  depthFade: 0.15,    // 0..1, how much rows fade out toward the horizon
};
export const DEFAULTS = Object.freeze({ ...TUNE });
const GAIN_FLOOR = 0.55;     // line amplitude factor at silence

// stem hue per group of 3 lines; band sets weight/alpha (low thick+dim → high thin+bright)
const STEM_COLORS = ['#5b7cfa', '#7ee0c3', '#f08bb4', '#c9a6ff'];
const BAND_STYLE = [{ w: 3, a: 0.28 }, { w: 2, a: 0.45 }, { w: 1.2, a: 0.7 }];
export const palette = { stems: STEM_COLORS.slice(), merged: '#e8ecf2' };   // occasions may override

// low/mid/high shades per stem, rebuilt only when the palette or bandShade changes
const shades = []; let shadeKey = '';
function bandColor(i) {
  const key = palette.stems.join() + TUNE.bandShade;
  if (key !== shadeKey) {
    shadeKey = key;
    for (let j = 0; j < LINE_COUNT; j++) shades[j] = shade(palette.stems[Math.floor(j / 3)], ((j % 3) - 1) * TUNE.bandShade);
  }
  return shades[i];
}

export const modes = { lissajous: false };   // konami egg
export const overlays = [];   // occasions push fn(ctx, { w, h, t, p, m, lineY })
let canvas, ctx, w = 0, h = 0, dpr = 1, morph = 0, raf = 0, lastT = 0, lastBands = null, fresh = true;
const gains = [1, 1, 1, 1];
let bufN = 0, win, sm, per, mix, shp, mixPeak = 0, frac = 0, lastI0 = -1;   // reused per-line buffers, sized by TUNE.timebase
const bufs = n => Array.from({ length: LINE_COUNT }, () => new Float32Array(n));
let bg = '#0d0f14';
const ys = new Float32Array(LINE_COUNT + 1);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

function resize() {
  dpr = Math.min(2, devicePixelRatio || 1);
  w = innerWidth; h = innerHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (reduced.matches) draw(0);
}

function prep() {   // new bands: crossfade from sines again, restart persistence
  if (state.bands === lastBands) return;
  lastBands = state.bands; morph = 0; fresh = true;
}

function shapes(t, dt) {
  // timebase is tuned for wide screens; below 1200px scale it with width so phones keep the same point density
  const n = Math.max(64, Math.round(TUNE.timebase * Math.min(1, w / 1200)));
  if (n !== bufN) { bufN = n; win = bufs(n); sm = bufs(n); per = bufs(n); shp = bufs(n); mix = new Float32Array(n); fresh = true; }
  prep();
  const still = reduced.matches, k = still ? 0 : TUNE.persist;
  const bands = state.bands;
  const pos = bands && state.loopDuration ? ((performance.now() - state.loopStart) / 1000 / state.loopDuration * TUNE.scroll) % 1 : 0;
  // integer window start + fractional draw offset: peaks keep their exact height while scrolling smoothly
  const len = bands ? bands[0].length : 1, f = pos * len, i0 = Math.floor(f);
  frac = bands ? f - i0 : 0;
  const step = lastI0 < 0 ? 0 : (i0 - lastI0 + len) % len;   // points scrolled since last frame
  if (step > n / 2) fresh = true;   // jump (new scene/loop reset): restart persistence
  lastI0 = bands ? i0 : -1;
  morph = Math.min(1, morph + dt / 2);   // ~2s regardless of refresh rate
  for (let i = 0; i < LINE_COUNT; i++) {
    let shape = sineLine(i, n, still ? 0 : t);
    if (bands) {
      let b = windowAt(bands[i], pos, n, win[i]);
      if (TUNE.smooth > 0) b = smoothInto(b, Math.round(TUNE.smooth), sm[i]);
      shape = blend(shape, b, morph, win[i]);
    }
    if (fresh || k === 0) per[i].set(shape); else persistInto(shiftInto(per[i], step), shape, k);   // align last frame with the scroll before blending
  }
  fresh = false;
  return per;
}

function updateGains(dt) {
  for (let s = 0; s < 4; s++) {
    const target = TUNE.gain && state.live && !reduced.matches ? Math.min(1, state.live(s) / TUNE.gainRef) : 1;
    gains[s] += (target - gains[s]) * (1 - Math.exp(-dt / (target > gains[s] ? TUNE.attack : TUNE.release)));
  }
}

export function draw(t) {
  const p = state.p, m = mergeAt(p, TUNE.openAt, TUNE.openWidth);
  const dt = Math.min(0.1, Math.max(0, t - lastT));   // R10
  const lines = shapes(t, dt);
  updateGains(dt);
  lastT = t;
  const ty = TUNE.fly ? tiltAt(p, Math.max(TUNE.flyFrom, TUNE.openAt), Math.max(TUNE.flyTo, TUNE.flyFrom, TUNE.openAt) + 0.01) : 0;
  if (modes.lissajous) {
    ctx.clearRect(0, 0, w, h);
    const r = Math.min(w, h) * 0.35;
    for (let s = 0; s < 4; s++) {
      const xs = lines[s * 3], ys = lines[s * 3 + 2];
      ctx.beginPath();
      for (let j = 0; j < xs.length; j++) { const x = w / 2 + xs[j] * r, y = h / 2 + ys[j] * r; j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = palette.stems[s]; ctx.globalAlpha = 0.8; ctx.lineWidth = 1.5; ctx.stroke();
    }
    ctx.globalAlpha = 1;
    return;
  }
  // normalise by a smoothed peak (instant attack, ~1s release) so the merged line doesn't pump with the sliding window
  const raw = mixInto(lines, mix);
  mixPeak = raw > mixPeak ? raw : mixPeak + (raw - mixPeak) * (1 - Math.exp(-dt / 1));
  if (mixPeak > 0) for (let j = 0; j < mix.length; j++) mix[j] /= mixPeak;
  ctx.clearRect(0, 0, w, h);
  const hy = h * TUNE.horizon, spread = (h * TUNE.spread / LINE_COUNT) * TUNE.amp, reach = reachFor(h, hy, spread / h), merged = h * TUNE.ampMerged;
  const amp = spread + (merged - spread) * m;
  for (let i = 0; i < LINE_COUNT; i++) ys[i] = lineY(i, m, h, TUNE.spread) * (1 - ty) + (hy + reach * perspective(i / (LINE_COUNT - 1), TUNE.camera)) * ty;
  ys[LINE_COUNT] = h * 2;
  for (let i = 0; i < LINE_COUNT; i++) {   // back (top lane) to front
    const g = perspective(i / (LINE_COUNT - 1), TUNE.camera), st = BAND_STYLE[i % 3], gain = GAIN_FLOOR + (1 - GAIN_FLOOR) * gains[Math.floor(i / 3)];
    const shape = blend(lines[i], mix, m, shp[i]);
    const a = amp * gain;   // same wave height as the flat lanes; depth only changes position and width
    const sx = 1 + (rowWidth(i / (LINE_COUNT - 1), TUNE.backWidth, TUNE.frontWidth) - 1) * ty, x0 = w / 2 - w * sx / 2, y0 = ys[i];
    const alF = Math.min(1, (st.a + (1 - st.a) * m * 0.6) * TUNE.alpha), alL = 1 - TUNE.depthFade * (1 - g);
    ctx.beginPath();
    for (let j = 0; j < shape.length; j++) {
      const x = x0 + ((j - frac) / (shape.length - 1)) * w * sx, y = y0 + shape[j] * a;
      j ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    if (ty > 0.01) {   // occlusion grows with the tilt: page-colour fill from the line down toward the next row's baseline
      const bot = y0 + (ys[i + 1] - y0) * ty;
      ctx.lineTo(x0 + w * sx, bot); ctx.lineTo(x0, bot); ctx.closePath();
      ctx.globalAlpha = 1; ctx.fillStyle = bg; ctx.fill();
      ctx.beginPath();
      for (let j = 0; j < shape.length; j++) { const x = x0 + ((j - frac) / (shape.length - 1)) * w * sx, y = y0 + shape[j] * a; j ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    }
    ctx.strokeStyle = m > 0.98 ? palette.merged : bandColor(i);
    ctx.globalAlpha = alF + (alL - alF) * ty;
    ctx.lineWidth = st.w * TUNE.lineWidth + (TUNE.mergedWidth - st.w * TUNE.lineWidth) * m;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  if (ty > 0.5) return;   // ponytail: eggs sit on the flat lanes, so skip overlays while tilted (bottom of the page); the knock lives near the top where m is 1
  for (const fn of overlays) fn(ctx, { w, h, t, p, m, lineY: i => lineY(i, m, h, TUNE.spread) });
}

function frame(ms) {
  raf = 0;
  if (document.hidden) return;
  draw(ms / 1000);
  if (!reduced.matches) raf = requestAnimationFrame(frame);
}
const start = () => { if (!raf && !document.hidden) raf = requestAnimationFrame(frame); };

export function init() {
  canvas = document.getElementById('bg');
  bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || bg;
  ctx = canvas.getContext('2d');
  const onScroll = () => { state.p = progress(scrollY, document.documentElement.scrollHeight, innerHeight); if (reduced.matches) draw(0); };   // no rAF loop under reduced motion: repaint the one static frame
  addEventListener('resize', () => { resize(); onScroll(); }, { passive: true });
  addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', start);
  reduced.addEventListener('change', () => { resize(); start(); });
  onChange(() => {   // reduced motion has no rAF loop: skip the crossfade and paint one static frame
    if (reduced.matches && state.bands && state.bands !== lastBands) { prep(); morph = 1; draw(0); }
  });
  resize(); onScroll(); draw(0); start();
}
