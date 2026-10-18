import { MUSICBOX } from '/js/lib/music.js';

const $ = id => document.getElementById(id);
let engine, ctx, manifest, scenes = [], active = [];   // active[t] = scene value playing on track t

async function boot() {
  try {
    const { AudioEngine } = await import(`${MUSICBOX}/engine.js`);
    const cat = await (await fetch(`${MUSICBOX}/bundles/catalogue.json`)).json();
    for (const s of cat.sets) $('set').append(new Option(s.title, s.manifest));
    $('start').onclick = async () => {
      $('start').disabled = true;   // no double-start while loading
      $('status').textContent = 'loading…';
      try {
        ctx ??= new AudioContext(); await ctx.resume();
        engine ??= new AudioEngine(ctx);
        const url = `${MUSICBOX}/${$('set').value}`;
        manifest = await (await fetch(url)).json();
        await engine.loadSet(manifest, url);   // stops + unloads any previous set
        scenes = [...new Set(manifest.clips.map(c => c.scene))].sort((a, b) => a - b);
        renderGrid();
        engine.launchScene(scenes[0]); active = manifest.tracks.map(() => scenes[0]); paint();
        $('status').textContent = `${manifest.title ?? ''} · ${Math.round(manifest.tempo)} bpm`;
      } catch { $('status').textContent = 'that set would not load. try another.'; }
      $('start').disabled = false;
    };
    $('stop').onclick = () => { engine?.stopAll(); active = []; paint(); };
  } catch {
    $('status').textContent = 'the music box is napping. try again later.';
    $('start').disabled = true;
  }
}

function renderGrid() {
  const grid = $('grid');
  grid.style.gridTemplateColumns = `80px repeat(${scenes.length}, 1fr)`;
  grid.replaceChildren();
  manifest.tracks.forEach((track, t) => {
    const label = document.createElement('div');
    label.className = 'row-label'; label.textContent = track?.name ?? `track ${t + 1}`;
    grid.append(label);
    scenes.forEach((s, i) => {
      const clip = engine.getClip(t, s);
      const b = document.createElement('button');
      b.className = 'cell'; b.dataset.t = t; b.dataset.s = s; b.disabled = !clip; b.textContent = clip ? i + 1 : '';
      b.onclick = () => { engine.triggerClip(t, clip); active[t] = active[t] === s ? undefined : s; paint(); };   // same clip again = stop
      grid.append(b);
    });
  });
}
const paint = () => document.querySelectorAll('.cell').forEach(c => {
  const on = !c.disabled && active[+c.dataset.t] === +c.dataset.s;
  c.classList.toggle('on', on); c.setAttribute('aria-pressed', on);
});

boot();
