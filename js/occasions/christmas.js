export default function start({ palette, overlays }) {
  palette.stems = ['#bfe3ff', '#e8f6ff', '#ff4d5e', '#9cc9ff'];
  const flakes = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random(), v: 0.02 + Math.random() * 0.04, r: 1 + Math.random() * 2, rest: -1 }));
  let last = 0;
  overlays.push((ctx, { w, h, t, lineY }) => {
    const dt = last ? Math.min(0.05, t - last) : 0; last = t;
    ctx.fillStyle = '#ffffffcc';
    for (const f of flakes) {
      if (f.rest < 0) {
        f.y += f.v * dt * 3; f.x = (f.x + Math.sin(t + f.r) * 0.0005 + 1) % 1;
        const ly = lineY(Math.min(11, Math.floor(f.x * 12))) / h;
        if (Math.abs(f.y - ly) < 0.004 && Math.random() < 0.02) f.rest = 3 + Math.random() * 4;   // settle on a line briefly
        if (f.y > 1) { f.y = -0.02; f.x = Math.random(); }
      } else if ((f.rest -= dt) <= 0) f.rest = -1;
      ctx.beginPath(); ctx.arc(f.x * w, f.y * h, f.r, 0, 7); ctx.fill();
    }
  });
}
