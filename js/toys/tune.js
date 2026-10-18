import { TUNE, DEFAULTS, draw, view } from '../waves.js';
import { rebuildBands } from '../audio.js';

// key, label, min, max, step, tooltip
const KNOBS = [
  ['amp', 'amplitude', 0.1, 1.5, 0.05, 'line height as a fraction of its lane; above 0.5 lines overlap'],
  ['ampMerged', 'merged amplitude', 0.01, 0.3, 0.01, 'line height once the lines have merged into one'],
  ['spread', 'spread', 0.4, 0.95, 0.01, 'how much of the page height the 12 lines span'],
  ['timebase', 'timebase', 64, 2048, 16, 'points of music shown across the screen'],
  ['resolution', 'resolution', 128, 8192, 128, 'detail captured per loop; recomputes the bands'],
  ['scroll', 'scroll', 0, 2, 0.05, 'scroll speed; 1 is one full pass per scene loop, in step with the audio'],
  ['smooth', 'smoothing', 0, 16, 1, 'moving-average radius in points; 0 is off'],
  ['persist', 'persistence', 0, 0.98, 0.01, 'how much of the previous frame each line keeps; calms the jitter'],
  ['gainRef', 'gain reference', 0.01, 0.4, 0.01, 'stem loudness that counts as full height'],
  ['attack', 'gain attack', 0.01, 1, 0.01, 'seconds for a line to swell with its stem'],
  ['release', 'gain release', 0.05, 3, 0.05, 'seconds for a line to fall back'],
  ['lineWidth', 'line width', 0.3, 3, 0.1, 'stroke width multiplier'],
  ['mergedWidth', 'merged width', 0.3, 6, 0.1, 'stroke width of the merged line in px'],
  ['alpha', 'opacity', 0.1, 1, 0.05, 'line opacity multiplier'],
  ['bandShade', 'band shade', 0, 0.8, 0.01, 'colour step between a stem\'s low, mid and high lines'],
  ['camera', 'camera', 0.1, 0.9, 0.01, 'camera distance: further back is flatter with smaller front rows'],
  ['horizon', 'horizon', 0.1, 0.7, 0.01, 'horizon height as a fraction of the page'],
  ['backWidth', 'back width', 0.3, 1, 0.01, 'landscape row width at the horizon'],
  ['frontWidth', 'front width', 0.3, 1, 0.01, 'landscape row width nearest you; less than back width makes the trapezoid wider at the back'],
  ['depthFade', 'depth fade', 0, 1, 0.05, 'how much rows fade toward the horizon'],
];
const BOOLS = ['gain'];
const LOOK = ['merge', 'tilt'];   // the per-tab look sliders; they edit view.goal, the active TAB_LOOKS entry
const RANGE = Object.fromEntries(KNOBS.map(([k, , min, max]) => [k, [min, max]]));
const dev = /[?&]tune\b/.test(location.search);   // localStorage only under ?tune, so a visitor's mangled page never sticks
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let root, box, inputs = {}, timer = 0, last = TUNE.resolution;

// merge known keys only, clamped to slider range
function apply(patch) {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) return false;
  for (const [k, v] of Object.entries(patch)) {
    if (BOOLS.includes(k)) { if (typeof v === 'boolean') TUNE[k] = v; }
    else if (RANGE[k] && typeof v === 'number' && isFinite(v)) TUNE[k] = Math.min(RANGE[k][1], Math.max(RANGE[k][0], v));
  }
  return true;
}

function syncLook() {   // the current tab's look: sliders and the copyable TAB_LOOKS line
  for (const k of LOOK) { const el = root.querySelector(`[data-l=${k}]`); el.value = view.goal[k]; el.parentNode.querySelector('output').textContent = view.goal[k]; }
  root.querySelector('[data-a=tab]').textContent = view.name;
  root.querySelector('[data-a=lookjson]').value = `${view.name}: ${JSON.stringify(view.goal)}`;
}

function sync(fromBox) {
  for (const [k] of KNOBS) { inputs[k].value = TUNE[k]; inputs[k].parentNode.querySelector('output').textContent = TUNE[k]; }
  for (const k of BOOLS) inputs[k].checked = TUNE[k];
  if (!fromBox) { box.value = JSON.stringify(TUNE, null, 2); box.classList.remove('bad'); }
  if (dev) try { localStorage.setItem('tune', JSON.stringify(TUNE)); } catch { /* optional */ }
  if (TUNE.resolution !== last) { last = TUNE.resolution; clearTimeout(timer); timer = setTimeout(rebuildBands, 300); }
  if (reduced.matches) draw(0);   // no rAF loop under reduced motion
}

const STYLE = `.tune{position:fixed;right:16px;bottom:16px;z-index:20;width:min(300px,calc(100vw - 32px));max-height:80vh;overflow:auto;border-radius:12px;padding:12px 14px;font-size:13px;color:var(--fg);background:var(--glass);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid var(--line)}
.tune label{display:grid;grid-template-columns:1fr 3.2em;gap:2px 6px;margin:6px 0}.tune label span{color:var(--dim)}.tune output{text-align:right;color:var(--dim)}.tune label input[type=range]{grid-column:1/-1;width:100%}
.tune .row{display:flex;gap:8px;margin:8px 0}.tune button{flex:1;font:inherit;color:var(--fg);background:transparent;border:1px solid var(--line);border-radius:8px;padding:5px;cursor:pointer}
.tune textarea{width:100%;height:9em;box-sizing:border-box;font:12px/1.35 ui-monospace,monospace;color:var(--fg);background:#0d0f14;border:1px solid var(--line);border-radius:8px;padding:6px;resize:vertical}.tune textarea.bad{border-color:var(--a3)}
.tune.min .body{display:none}`;

function build() {
  document.head.append(Object.assign(document.createElement('style'), { textContent: STYLE }));
  root = document.createElement('section');
  root.className = 'tune'; root.setAttribute('aria-label', 'Wave knobs');
  root.innerHTML = `<div class="row" style="margin:0"><b style="flex:2;align-self:center">wave knobs</b><button type="button" data-a="collapse" aria-expanded="true">collapse</button></div><div class="body">
    ${KNOBS.map(([k, label, min, max, step, tip]) => `<label title="${tip}"><span>${label}</span><output>${TUNE[k]}</output><input type="range" data-k="${k}" min="${min}" max="${max}" step="${step}"></label>`).join('')}
    <b title="the current tab's wave look; edits are live. Paste the line into TAB_LOOKS in waves.js">look: <span data-a="tab"></span></b>
    ${LOOK.map(k => `<label><span>${k}</span><output></output><input type="range" data-l="${k}" min="0" max="1" step="0.01"></label>`).join('')}
    <input data-a="lookjson" readonly aria-label="this tab's look as a TAB_LOOKS line" style="width:100%;box-sizing:border-box;font:12px ui-monospace,monospace;color:var(--fg);background:#0d0f14;border:1px solid var(--line);border-radius:8px;padding:5px">
    <label class="chk" style="display:flex;gap:8px"><input type="checkbox" data-k="gain"> <span>live loudness gain</span></label>
    <div class="row"><button type="button" data-a="copy">copy</button><button type="button" data-a="reset">reset</button></div>
    <textarea aria-label="settings JSON: edit or paste to apply" spellcheck="false"></textarea></div>`;
  box = root.querySelector('textarea');
  for (const el of root.querySelectorAll('[data-k]')) inputs[el.dataset.k] = el;
  root.addEventListener('input', e => {
    const k = e.target.dataset.k;
    if (e.target.dataset.l) { view.goal[e.target.dataset.l] = +e.target.value; syncLook(); if (reduced.matches) draw(0); }
    else if (k) { apply({ [k]: BOOLS.includes(k) ? e.target.checked : +e.target.value }); sync(); }
    else if (e.target === box) {
      let v; try { v = JSON.parse(box.value); } catch { v = null; }
      const ok = apply(v);
      box.classList.toggle('bad', !ok);
      if (ok) sync(true);
    }
  });
  root.addEventListener('click', async e => {
    const a = e.target.closest('[data-a]')?.dataset.a;
    if (a === 'collapse') { const m = root.classList.toggle('min'); e.target.textContent = m ? 'expand' : 'collapse'; e.target.setAttribute('aria-expanded', !m); }
    else if (a === 'reset') { apply(DEFAULTS); sync(); }
    else if (a === 'copy') {
      box.select();
      try { await navigator.clipboard.writeText(box.value); e.target.textContent = 'copied'; } catch { e.target.textContent = 'selected'; }
      setTimeout(() => { e.target.textContent = 'copy'; }, 1200);
    }
  });
  document.body.append(root);
  sync(); syncLook();
  for (const ev of ['click', 'keyup']) document.addEventListener(ev, () => setTimeout(syncLook));   // a tab switch changes which look the sliders edit
}

export function toggle() {
  if (!root) return build();
  root.hidden = !root.hidden;
}

if (dev) try { apply(JSON.parse(localStorage.getItem('tune'))); } catch { /* none stored */ }
