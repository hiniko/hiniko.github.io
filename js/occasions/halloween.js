export default function start({ palette, overlays }) {
  palette.stems = ['#ff7a1a', '#9b5cff', '#ffb347', '#6b2fd6'];
  palette.merged = '#ffb347';
  let next = 4, ghost = null;
  overlays.push((ctx, { w, t, lineY }) => {
    if (!ghost && t > next) ghost = { i: Math.floor(Math.random() * 12), x: -40 };
    if (!ghost) return;
    ghost.x += 3;
    const y = lineY(ghost.i) - 18 + Math.sin(t * 6) * 4;
    ctx.save(); ctx.font = '28px system-ui'; ctx.globalAlpha = 0.85; ctx.fillText('👻', ghost.x, y); ctx.restore();
    if (ghost.x > w + 40) { ghost = null; next = t + 8 + Math.random() * 10; }
  });
}
