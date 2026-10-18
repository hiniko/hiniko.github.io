import { state, onChange } from './state.js';
import { toggleMute, skip } from './audio.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let el, bars, raf = 0;

function render(s) {
  el.classList.toggle('napping', s.mode === 'napping');
  el.querySelector('.title').textContent =
    s.mode === 'napping' ? "music's napping" : s.set ? `${s.set.title.toLowerCase()} · ${Math.round(s.set.tempo)}` : 'tuning…';
  el.querySelector('.mute').textContent = s.muted ? '🔇' : '🔊';
  el.querySelector('.mute').setAttribute('aria-label', s.muted ? 'Unmute music' : 'Mute music');
  el.querySelector('.mute').disabled = el.querySelector('.skip').disabled = !s.set;
}

function tick() {
  raf = 0;
  if (document.hidden || reduced.matches) return;
  if (state.bands) {
    const pos = state.loopDuration ? ((performance.now() - state.loopStart) / 1000 / state.loopDuration) % 1 : 0;
    bars.forEach((b, t) => {
      const band = state.bands[t * 3 + 1], v = Math.abs(band[Math.floor(pos * band.length)]);
      b.style.transform = `scaleY(${0.2 + 0.8 * v})`;
    });
  }
  raf = requestAnimationFrame(tick);
}
const start = () => { if (!raf && !document.hidden && !reduced.matches) raf = requestAnimationFrame(tick); };

export function init() {
  el = document.getElementById('jukebox');
  el.innerHTML = `
    <button class="meter" type="button" aria-label="Show track name" aria-expanded="false"><i></i><i></i><i></i><i></i></button>
    <button class="title" type="button" aria-expanded="false" aria-live="polite">tuning…</button>
    <button class="mute" type="button">🔇</button>
    <button class="skip" type="button" aria-label="Another track">⏭</button>
    <button class="knobs" type="button" data-action="tune" aria-label="wave knobs" title="wave knobs">🎛</button>
    <a class="sc" href="https://soundcloud.com/hiniko" aria-label="SoundCloud">☁</a>`;
  bars = el.querySelectorAll('.meter i');
  el.querySelector('.mute').addEventListener('click', () => toggleMute());
  el.querySelector('.skip').addEventListener('click', () => skip());
  for (const b of el.querySelectorAll('.meter, .title'))
    b.addEventListener('click', () => {
      const open = el.classList.toggle('open');
      el.querySelectorAll('.meter, .title').forEach(x => x.setAttribute('aria-expanded', open));
    });
  onChange(render); render(state);
  document.addEventListener('visibilitychange', start);
  reduced.addEventListener('change', start);
  start();
}
