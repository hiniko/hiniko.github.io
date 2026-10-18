import { state, set } from './state.js';
import { MUSICBOX, pickRandom, loopSeconds, sceneOrder, nextScene } from './lib/music.js';
import { downsample } from './lib/wavemath.js';
import { TUNE } from './waves.js';

const BANDS = [['lowpass', 250], ['bandpass', 800], ['highpass', 2500]];   // bandpass centre ~ geometric mid of 250..2.5k
let Engine, engine, ctx, catalogue, current, queue = Promise.resolve(), token = 0;   // current = { setMeta, manifest, manifestUrl, scene, live }

async function bandSplit(buffer) {
  return Promise.all(BANDS.map(async ([type, freq]) => {
    const off = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
    const src = off.createBufferSource(); src.buffer = buffer;
    const f = off.createBiquadFilter(); f.type = type; f.frequency.value = freq;
    src.connect(f).connect(off.destination); src.start();
    const out = await off.startRendering();
    return downsample(out.getChannelData(0), TUNE.resolution);
  }));
}

const LOOPS_PER_SCENE = 2;   // musicbox app default
let Sequencer, seq, sceneTok = 0, timer = 0;

// serialize loads on the single engine; a newer request supersedes an in-flight one
function loadScene(setMeta) {
  const mine = ++token; sceneTok++;
  const run = queue.then(() => doLoad(setMeta, mine));
  queue = run.catch(() => {});
  return run;
}

async function sceneBands(i) {
  const clips = engine.getClipsForScene(i);
  // first 4 tracks actually playing in this scene (scenes rarely use tracks 0-3)
  const tracks = [...new Set(clips.map(c => c.track))].sort((a, b) => a - b).slice(0, 4);
  const stems = [0, 1, 2, 3].map(s => clips.find(c => c.track === tracks[s]));
  const bands = (await Promise.all(stems.map(c => c ? bandSplit(engine.getBuffer(c)) : BANDS.map(() => new Float32Array(TUNE.resolution))))).flat();
  return { bands, tracks, dur: loopSeconds(clips) || 8 };
}

// recompute bands for scene i; a stale scene (or set) never overwrites a newer one
async function enterScene(i, extra = {}) {
  const my = ++sceneTok, cur = current;
  const { bands, tracks, dur } = await sceneBands(i);
  if (my !== sceneTok || cur !== current) return;
  cur.scene = i;
  cur.tracks = tracks;
  set({ ...extra, bands, loopStart: performance.now(), loopDuration: dur });
  if (state.muted) scheduleAdvance(LOOPS_PER_SCENE * dur * 1000);
}

// silent clock: mirrors the sequencer (which needs the engine transport) until unmute
function scheduleAdvance(ms) {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (!current || !state.muted) return;
    const next = nextScene(current.order, current.scene);
    next === null ? skip() : enterScene(next);
  }, ms);
}

async function doLoad(setMeta, mine) {
  if (mine !== token) return;
  clearTimeout(timer); seq?.stop();
  const manifestUrl = `${MUSICBOX}/${setMeta.manifest}`;
  const manifest = await (await fetch(manifestUrl)).json();
  // ponytail: engine needs an AudioContext even for decode; a suspended one is fine before any gesture
  ctx ??= new AudioContext();
  engine ??= new Engine(ctx);
  await engine.loadSet(manifest, manifestUrl);
  if (mine !== token) return;
  const order = sceneOrder(manifest);
  current = { setMeta, manifest, manifestUrl, order, scene: order[0], live: null };
  if (seq) { seq.setManifest(manifest); seq.configure({ loopsPerScene: LOOPS_PER_SCENE, startScene: order[0] }); }
  await enterScene(order[0], {
    mode: state.muted ? 'silent' : 'live',
    set: { id: setMeta.id, title: setMeta.title, tempo: setMeta.tempo, scale: setMeta.scale, root_note: setMeta.root_note },
  });
  if (mine === token && !state.muted) startPlayback();
}

function startPlayback() {
  clearTimeout(timer);
  if (seq) { seq.configure({ startScene: current.scene }); seq.start(); }   // launches startScene, then advances every loopsPerScene
  else engine.launchScene(current.scene);
  // ponytail: engine has no start-offset API, so re-anchor the visual clock to the audible start (one visual jump on unmute)
  current.live ??= liveReader();   // taps are recreated per loadSet, so build once per set
  set({ loopStart: performance.now(), mode: 'live', live: current.live });
}

function liveReader() {
  // raw per-stem RMS from the engine's own analyser taps; waves.js smooths it
  const taps = new Map(), cur = current;
  let buf = new Float32Array(2048);
  return stem => {
    const t = cur.tracks?.[stem]; if (t == null) return 0;
    if (!taps.has(t)) taps.set(t, engine.getTrackAnalyser?.(t));
    const an = taps.get(t); if (!an) return 0;
    an.getFloatTimeDomainData(buf.length >= an.fftSize ? buf : (buf = new Float32Array(an.fftSize)));
    let sum = 0; for (let j = 0; j < an.fftSize; j++) sum += buf[j] * buf[j];
    return Math.sqrt(sum / an.fftSize);
  };
}

function wireSequencer() {
  seq = new Sequencer(engine ??= new Engine(ctx ??= new AudioContext()));
  seq.onSceneChange(i => { if (i !== current?.scene) enterScene(i); else set({ loopStart: performance.now() }); });
  seq.onSetFinished(() => skip());
}

async function boot() {
  try {
    ({ AudioEngine: Engine } = await import(`${MUSICBOX}/engine.js`));
    try {
      ({ SceneSequencer: Sequencer } = await import(`${MUSICBOX}/experience/scene-sequencer.js`));
    } catch { /* ponytail: no sequencer, loop the first scene; upgrade path is a local scene timer */ }
    catalogue = await (await fetch(`${MUSICBOX}/bundles/catalogue.json`)).json();
    if (Sequencer) wireSequencer();
    await loadScene(pickRandom(catalogue.sets));
  } catch (err) {
    console.info('music box napping:', err.message);
    set({ mode: 'napping' });
  }
}

// tune toy: recompute the current scene's bands at the new resolution
export function rebuildBands() { if (current) enterScene(current.scene); }

export async function skip() {
  if (!catalogue) return;
  seq?.stop(); engine?.stopAll();
  set({ live: null });
  const others = catalogue.sets.filter(s => s.id !== current?.setMeta.id);
  await loadScene(pickRandom(others.length ? others : catalogue.sets)).catch(() => set({ mode: 'napping' }));
}

export async function loadSetById(id) {
  const meta = catalogue?.sets.find(s => s.id === id);
  if (!meta) return;
  seq?.stop(); engine?.stopAll(); set({ live: null });
  await loadScene(meta).catch(() => set({ mode: 'napping' }));
}

export async function toggleMute() {
  if (!engine || state.mode === 'napping') return;
  if (state.muted) {
    try { await ctx.resume(); } catch { return; }
    set({ muted: false });
    startPlayback();
  } else {
    seq?.stop(); engine.stopAll();
    set({ muted: true, mode: 'silent', live: null });
    const left = LOOPS_PER_SCENE * state.loopDuration * 1000 - (performance.now() - state.loopStart);
    scheduleAdvance(Math.max(1000, left));   // silent clock resumes where the audible one stopped
  }
}

export function init() {
  // after first paint, never blocking
  (window.requestIdleCallback ?? (f => setTimeout(f, 300)))(boot);
}
