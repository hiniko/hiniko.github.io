import { loadSetById } from '../audio.js';

const HIDDEN_SET = 'gravity-s-embrace';   // ponytail: "hidden" = a specific set; swap for a real hidden set when musicbox has one
const CLICKABLE = 'a, button, input, select, textarea, .card';
const clear = (x, y, sel) => !document.elementFromPoint(x, y)?.closest(sel);
export default function start({ overlays, banner, state }) {
  const eggs = Array.from({ length: 5 }, (_, k) => ({ i: k * 2 + 1, fx: 0.12 + k * 0.18, px: 0, found: false, hue: k * 70 }));
  let found = 0, hitboxes = [], dirty = true, timer = 0;
  // nudge each egg along its line until it is off links/cards (prefer off glass panels too); lazily, not per frame
  const place = (w, h, lineY) => {
    dirty = false;
    for (const e of eggs) {
      const y = lineY(e.i) - 14, x0 = e.fx * w;
      e.px = x0;
      for (const sel of [CLICKABLE + ', .glass', CLICKABLE]) {
        let hit = false;
        for (let n = 0; n < Math.ceil(w / 24); n++) {
          const x = 12 + (x0 + n * 24) % (w - 24);
          if (clear(x, y, sel)) { e.px = x; hit = true; break; }
        }
        if (hit) break;
      }
    }
  };
  const redo = () => { clearTimeout(timer); timer = setTimeout(() => { dirty = true; }, 150); };
  addEventListener('resize', redo, { passive: true });
  addEventListener('scroll', redo, { passive: true });
  overlays.push((ctx, { w, h, t, lineY }) => {
    if (dirty) place(w, h, lineY);
    hitboxes = [];
    for (const e of eggs) {
      if (e.found) continue;
      const x = e.px, y = lineY(e.i) - 14 + Math.sin(t * 2 + e.i) * 5;
      ctx.fillStyle = `hsl(${e.hue} 80% 70%)`;
      ctx.beginPath(); ctx.ellipse(x, y, 9, 12, 0, 0, 7); ctx.fill();
      hitboxes.push({ e, x, y });
    }
  });
  document.addEventListener('click', ev => {   // content column covers #bg, so listen on document
    if (ev.target.closest('a, button, input, select, textarea')) return;
    const hit = hitboxes.find(b => Math.hypot(b.x - ev.clientX, b.y - ev.clientY) < 18);
    if (!hit) return;
    hit.e.found = true;
    if (++found < eggs.length) return;
    banner.textContent = '🥚 you found them all — here\'s one I made';
    banner.hidden = false;
    if (state.set?.id !== HIDDEN_SET) loadSetById(HIDDEN_SET);
  });
}
