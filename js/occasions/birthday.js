export default function start({ overlays, banner, state }) {
  banner.textContent = "it's Sherman's birthday 🎂";
  banner.hidden = false;
  const bits = [];
  const burst = (x, y, n = 40) => { for (let k = 0; k < n; k++) bits.push({ x, y, vx: (Math.random() - .5) * 6, vy: -Math.random() * 6, c: `hsl(${Math.random() * 360} 90% 65%)`, life: 1 }); };
  banner.addEventListener('click', () => burst(innerWidth / 2, 120, 160));
  let lastBeat = -1;
  overlays.push((ctx, { w, h, t, lineY }) => {
    const beat = state.set ? Math.floor(t * state.set.tempo / 60) : Math.floor(t / 2);
    if (beat !== lastBeat) {   // on each beat, burst where two neighbouring lines are closest
      lastBeat = beat;
      const i = Math.floor(Math.random() * 11);
      burst(Math.random() * w, (lineY(i) + lineY(i + 1)) / 2, 18);
    }
    for (let k = bits.length - 1; k >= 0; k--) {
      const b = bits[k]; b.x += b.vx; b.y += b.vy; b.vy += 0.2; b.life -= 0.015;
      if (b.life <= 0) { bits.splice(k, 1); continue; }
      ctx.globalAlpha = b.life; ctx.fillStyle = b.c; ctx.fillRect(b.x, b.y, 4, 4);
    }
    ctx.globalAlpha = 1;
  });
}
