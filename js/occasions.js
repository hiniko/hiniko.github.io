import { pickOccasion, parseOverride } from './lib/dates.js';
import { palette, overlays } from './waves.js';
import { state } from './state.js';

export async function init() {
  const which = pickOccasion(parseOverride(location.search, new Date()));
  if (!which) return;
  const mod = await import(`./occasions/${which}.js`);
  mod.default({ palette, overlays, state, banner: document.getElementById('occasion-banner') });
}
