// js/state.js
export const state = {
  p: 0,              // scroll convergence progress 0..1
  mode: 'sines',     // 'sines' | 'silent' | 'live' | 'napping'
  set: null,         // { id, title, tempo, scale, root_note } of the loaded set, or null
  bands: null,       // Array(12) of Float32Array(TUNE.resolution), each normalised to -1..1, order: stem0 low,mid,high, stem1 low,... ; null until loaded
  loopStart: 0,      // performance.now() ms when the current loop position 0 was anchored
  loopDuration: 0,   // seconds for one loop of the scene
  live: null,        // null, or function(stem 0-3) -> raw RMS of that stem's live audio
  muted: true,
};
const subs = new Set();
export function onChange(fn) { subs.add(fn); return () => subs.delete(fn); }
export function set(patch) { Object.assign(state, patch); subs.forEach(fn => fn(state)); }
