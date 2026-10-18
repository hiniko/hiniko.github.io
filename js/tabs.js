// Add a tab: put a <button role="tab" id="tab-x" aria-controls="x"> in #tabs and a <section id="x" role="tabpanel"> panel.
// Optionally give it a wave look in TAB_LOOKS (js/waves.js); without one it starts from the first tab's look.
import { TAB_LOOKS, view, draw } from './waves.js';

const tabs = [...document.querySelectorAll('#tabs [role=tab]')];
const NAMES = tabs.map(t => t.getAttribute('aria-controls'));   // panel ids, in button order
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let current = '';

export function select(name, { hash = true, focus = false } = {}) {
  if (!NAMES.includes(name)) return;
  current = name;
  NAMES.forEach((n, i) => {
    const on = n === name;
    tabs[i].setAttribute('aria-selected', on);
    tabs[i].tabIndex = on ? 0 : -1;
    document.getElementById(n).hidden = !on;
  });
  if (focus) tabs[NAMES.indexOf(name)].focus();
  view.name = name;
  view.goal = TAB_LOOKS[name] ??= { ...TAB_LOOKS[NAMES[0]] };   // own copy, so the wave knobs can edit this tab alone
  if (hash && location.hash !== '#' + name) history.replaceState(null, '', '#' + name);
  if (reduced.matches) draw(0);   // no rAF loop: jump and repaint once
}

const fromHash = () => location.hash.slice(1);

export function init() {
  select(NAMES.includes(fromHash()) ? fromHash() : NAMES[0], { hash: false });
  addEventListener('hashchange', () => select(fromHash(), { hash: false }));
  document.addEventListener('click', e => {   // explore items, eggs: any in-page link to a tab
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || !NAMES.includes(a.hash.slice(1))) return;
    e.preventDefault(); select(a.hash.slice(1));
  });
  tabs.forEach((t, i) => t.addEventListener('click', () => select(NAMES[i])));
  document.getElementById('tabs').addEventListener('keydown', e => {
    const i = NAMES.indexOf(current), last = NAMES.length - 1;
    const to = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
    if (to === undefined) return;
    e.preventDefault(); select(NAMES[to], { focus: true });
  });
}
