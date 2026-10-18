export const MUSICBOX = 'https://musicbox.sherms.uk';
export const pickRandom = (arr, rng = Math.random) => arr[Math.min(arr.length - 1, Math.floor(rng() * arr.length))];
export const loopSeconds = clips => Math.max(0, ...clips.map(c => c.loop_duration_s || 0));
export const sceneOrder = m => m.scenes?.map(s => s.index) ?? [...new Set(m.clips.map(c => c.scene))].sort((a, b) => a - b);
export const nextScene = (order, scene) => order[order.indexOf(scene) + 1] ?? null;
