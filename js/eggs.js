import { matcher, KONAMI } from './lib/konami.js';
import { modes, draw, look } from './waves.js';

const SKIP = 'a, button, input, select, textarea, .card, .tune';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

export function init() {
  console.log(`%c
  ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿
   hi, nosy dev 👋
   the source is on GitHub. the secret toy is not.
   hint: when the lines become one, knock seven times.
  ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿`, 'color:#7ee0c3;font-family:monospace');

  const konami = matcher(KONAMI);
  addEventListener('keydown', e => {
    if (e.target.closest?.('input, textarea, [contenteditable]')) return;
    const was = modes.lissajous;
    if (e.key === 'Escape') modes.lissajous = false;
    else if (konami(e.key)) modes.lissajous = !modes.lissajous;
    if (reduced.matches && was !== modes.lissajous) draw(0);   // no rAF loop under reduced motion
  });

  let knocks = 0, timer = 0;
  document.addEventListener('click', e => {
    if (e.target.closest?.(SKIP)) return;
    if (look.merge < 0.98 || Math.abs(e.clientY - innerHeight / 2) > 24) return;   // the merged line sits mid-viewport, near the top
    clearTimeout(timer); timer = setTimeout(() => { knocks = 0; }, 2500);
    if (++knocks >= 7) location.href = '/toys/secret/';
  });
}
