import { init as waves } from './waves.js';
import { init as audio } from './audio.js';
import { init as jukebox } from './jukebox.js';
import { init as projects } from './projects.js';
import { init as explore } from './explore.js';
import { init as occasions } from './occasions.js';
import { init as eggs } from './eggs.js';
waves();
audio();
jukebox();
projects().then(explore);
occasions();
eggs();

// wave knobs toy: zero cost until asked for (?tune opens it on load)
const knobs = () => import('./toys/tune.js').then(m => m.toggle());
if (/[?&]tune\b/.test(location.search)) knobs();
document.addEventListener('click', e => {
  if (!e.target.closest('[data-action="tune"]')) return;
  e.preventDefault(); knobs();
});
