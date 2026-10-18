import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shade, LINE_COUNT, sineLine, progress, mergeAt, tiltAt, perspective, reachFor, rowWidth, lineY, blend, mixOf, mixInto, windowAt, shiftInto, downsample, smoothInto, persistInto } from '../js/lib/wavemath.js';

test('sineLine is bounded and distinct per line', () => {
  const a = sineLine(0, 256, 0), b = sineLine(1, 256, 0);
  assert.equal(a.length, 256);
  assert.ok(a.every(v => v >= -1 && v <= 1));
  assert.notDeepEqual(a, b);
});

test('progress: 0 at top, 1 at bottom, clamped', () => {
  assert.equal(progress(0, 4000, 800), 0);
  assert.equal(progress(3200, 4000, 800), 1);
  assert.equal(progress(4000, 4000, 800), 1);
  assert.ok(Math.abs(progress(1600, 4000, 800) - 0.5) < 1e-9);
  assert.equal(progress(0, 800, 800), 1);
});

test('lineY spreads at p=0 and converges on centre at p=1', () => {
  const ys0 = Array.from({ length: LINE_COUNT }, (_, i) => lineY(i, 0, 1000));
  assert.ok(Math.max(...ys0) - Math.min(...ys0) > 500);
  for (let i = 0; i < LINE_COUNT; i++) assert.ok(Math.abs(lineY(i, 1, 1000) - 500) < 1e-6);
});

test('blend endpoints', () => {
  const a = Float32Array.of(0, 1), b = Float32Array.of(1, -1);
  assert.deepEqual(blend(a, b, 0), a);
  assert.deepEqual(blend(a, b, 1), b);
});

test('mixOf normalises and tolerates silence', () => {
  const m = mixOf([Float32Array.of(0.5, 0), Float32Array.of(0.5, -0.25)]);
  assert.ok(Math.abs(m[0] - 1) < 1e-6);
  assert.deepEqual(mixOf([new Float32Array(3)]), new Float32Array(3));
});

test('mixInto sums into a reused buffer and returns the raw peak', () => {
  const out = new Float32Array(2);
  assert.equal(mixInto([Float32Array.of(0.5, 0), Float32Array.of(0.5, -0.25)], out), 1);
  assert.deepEqual(out, Float32Array.of(1, -0.25));
  mixInto([Float32Array.of(0, 0)], out);   // stale values cleared
  assert.deepEqual(out, new Float32Array(2));
});

test('windowAt wraps', () => {
  const band = Float32Array.of(0, 1, 2, 3);
  assert.deepEqual(windowAt(band, 0.75, 3), Float32Array.of(3, 0, 1));
});

test('downsample keeps peaks with sign and normalises', () => {
  const d = downsample(Float32Array.of(0.1, -0.5, 0.2, 0.25), 2);
  assert.deepEqual(Array.from(d), [-1, 0.5]);
});

test('windowAt takes exact samples from the integer start (peaks never shrink)', () => {
  assert.deepEqual(windowAt(Float32Array.of(0, 2, 4, 6), 0.125, 2), Float32Array.of(0, 2));
  assert.deepEqual(windowAt(Float32Array.of(0, 9, 0, 0), 0.24, 2), Float32Array.of(0, 9));
});

test('shiftInto scrolls a buffer left in place', () => {
  assert.deepEqual(shiftInto(Float32Array.of(1, 2, 3, 4), 1), Float32Array.of(2, 3, 4, 4));
  assert.deepEqual(shiftInto(Float32Array.of(1, 2, 3, 4), 0), Float32Array.of(1, 2, 3, 4));
});

test('smoothInto averages with clamped edges and radius 0 is identity', () => {
  const d = Float32Array.of(0, 0, 3, 0, 0);
  assert.deepEqual(Array.from(smoothInto(d, 1, new Float32Array(5))), [0, 1, 1, 1, 0]);
  assert.deepEqual(smoothInto(d, 0, new Float32Array(5)), d);
});

test('persistInto blends in place', () => {
  const prev = Float32Array.of(1, 0);
  assert.equal(persistInto(prev, Float32Array.of(0, 1), 0.75), prev);
  assert.deepEqual(Array.from(prev), [0.75, 0.25]);
  assert.deepEqual(Array.from(persistInto(Float32Array.of(5), Float32Array.of(2), 0)), [2]);
});

test('lineY takes a spread parameter', () => {
  const span = span => { const ys = Array.from({ length: LINE_COUNT }, (_, i) => lineY(i, 0, 1000, span)); return Math.max(...ys) - Math.min(...ys); };
  assert.ok(span(0.5) < span(0.9));
  assert.equal(lineY(0, 0, 1000), lineY(0, 0, 1000, 0.84));
});

test('mergeAt: merged at top, open from openAt on and stays open', () => {
  assert.ok(Math.abs(mergeAt(0) - 1) < 1e-9 && Math.abs(mergeAt(0.5)) < 1e-9 && mergeAt(1) === 0);
  assert.ok(Math.abs(mergeAt(0.3, 0.3)) < 1e-9 && mergeAt(0.9, 0.3) === 0);
  assert.ok(mergeAt(0.25) < 1 && mergeAt(0.25) > 0);
});

test('tiltAt: 0 until from, eases to 1 at to, stays 1', () => {
  assert.equal(tiltAt(0, 0.55, 0.85), 0);
  assert.equal(tiltAt(0.55, 0.55, 0.85), 0);
  assert.equal(tiltAt(0.85, 0.55, 0.85), 1);
  assert.equal(tiltAt(1, 0.55, 0.85), 1);
  assert.ok(tiltAt(0.7, 0.55, 0.85) > 0 && tiltAt(0.7, 0.55, 0.85) < 1);
});

test('perspective: 0 at horizon, 1 at viewer, rows spread out as they near', () => {
  assert.ok(Math.abs(perspective(0)) < 1e-9 && Math.abs(perspective(1) - 1) < 1e-9);
  assert.ok(perspective(0.5) < 0.2);
  assert.ok(perspective(0.9) - perspective(0.8) > perspective(0.2) - perspective(0.1));
});

test('landscape fit: bottom row with amplitude clear, depth monotonic, trapezoid widths', () => {
  for (const h of [800, 1080, 740]) for (const cam of [0.1, 0.5, 0.9]) for (const fa of [0.02, 0.05, 0.1]) {
    const hy = h * 0.3, reach = reachFor(h, hy, fa);
    assert.ok(hy + reach * perspective(1, cam) + fa * h <= h - 0.02 * h);
    let py = -1;
    for (let i = 0; i < LINE_COUNT; i++) { const y = hy + reach * perspective(i / (LINE_COUNT - 1), cam); assert.ok(y > py); py = y; }
  }
  assert.equal(rowWidth(0, 1, 0.7), 1);
  assert.equal(rowWidth(1, 1, 0.7), 0.7);
  assert.ok(rowWidth(0.5, 1, 0.7) < 1 && rowWidth(0.5, 1, 0.7) > 0.7);
});

test('shade steps a colour toward white or black', () => {
  assert.equal(shade('#808080', 0), '#808080');
  assert.equal(shade('#808080', 1), '#ffffff');
  assert.equal(shade('#808080', -1), '#000000');
  assert.equal(shade('#000000', 0.5), '#808080');
});
