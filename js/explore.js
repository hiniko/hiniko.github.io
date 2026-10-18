import { pick } from './lib/explore.js';
import { esc } from './lib/projects.js';
import { state, onChange } from './state.js';
import { skip } from './audio.js';

const TOYS = [{ kind: 'toy', text: 'turn the <b>wave knobs</b>', note: 'toy', action: 'tune' }];
const THOUGHTS = [];   // { kind: 'thought', text: 'read <b>…</b>', note: 'thought', href: '/thoughts/slug.html' }

export function init(cards) {
  const list = document.getElementById('explore-list');
  const now = document.createElement('li');
  const renderNow = s => {
    now.innerHTML = s.mode === 'napping' ? `<span>♪ the jukebox is napping</span><small>music</small>`
      : s.set ? `<span>♪ now playing <b>${esc(s.set.title.toLowerCase())}</b></span><small>${Math.round(s.set.tempo)} bpm</small>`
      : `<span>♪ the jukebox is warming up</span><small>music</small>`;
    list.querySelectorAll('[data-action="skip"]').forEach(a => { a.closest('li').style.display = s.mode === 'napping' ? 'none' : ''; });
  };
  const pool = [
    ...cards.map(c => ({ kind: 'project', text: `look at <b>${esc(c.name)}</b>`, note: 'project', href: c.url })),
    ...TOYS, ...THOUGHTS,
    { kind: 'music', text: 'hear <b>another track</b>', note: 'music', action: 'skip' },
  ];
  list.replaceChildren(now, ...pick(pool, 4).map(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${item.action ? `<a href="#" data-action="${item.action}">${item.text}</a>` : `<a href="${esc(item.href)}">${item.text}</a>`}</span><small>${item.note}</small>`;
    return li;
  }));
  onChange(renderNow); renderNow(state);
  list.addEventListener('click', e => {
    if (!e.target.closest('[data-action="skip"]')) return;
    e.preventDefault(); skip();
  });
}
