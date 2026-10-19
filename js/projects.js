import { cardsFor, esc } from './lib/projects.js';

// Edit this list to choose what's shown, in order. Details come live from GitHub.
export const PINNED = ['ferret', 'hiniko.github.io', 'How2Pay', 'ExtensibleMigrations', 'dinnerthisweek', 'PSTE'];
const LANG_COLORS = { JavaScript: '#f1e05a', TypeScript: '#3178c6', 'C#': '#178600', Python: '#3572A5', Go: '#00ADD8', Rust: '#dea584', YAML: '#cb171e', Shell: '#89e051', HTML: '#e34c26' };
const CACHE = 'gh-repos';
const TITLES = { 'hiniko.github.io': 'shermanrose.uk' };   // display name; the card still links to the repo

async function repos() {
  try { const c = sessionStorage.getItem(CACHE); if (c) return JSON.parse(c); } catch {}
  try {
    const res = await fetch('https://api.github.com/users/hiniko/repos?per_page=100');
    if (!res.ok) return null;
    const data = await res.json();
    try { sessionStorage.setItem(CACHE, JSON.stringify(data)); } catch {}
    return data;
  } catch { return null; }
}


export async function init() {
  const cards = cardsFor(PINNED, await repos()).map(c => ({ ...c, name: TITLES[c.name] ?? c.name }));
  document.getElementById('projects-grid').innerHTML = cards.map(c => `
    <div class="card glass">
      <b>${esc(c.name)}</b>
      ${c.description ? `<p>${esc(c.description)}</p>` : ''}
      <div class="meta">
        ${c.language ? `<span><span class="dot" style="background:${LANG_COLORS[c.language] ?? 'var(--dim)'}"></span>${esc(c.language)}</span>` : ''}
        <span class="links">${c.url !== (c.repo ?? c.url) ? `<a class="site" href="${esc(c.url)}">open site ↗</a>` : ''}<a href="${esc(c.repo ?? c.url)}">github</a></span></div>
    </div>`).join('');
  return cards;
}
