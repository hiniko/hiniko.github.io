import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cardsFor } from '../js/lib/projects.js';

const repos = [
  { name: 'homecluster', html_url: 'https://github.com/hiniko/homecluster', description: 'k3s', language: 'YAML', stargazers_count: 1, fork: false },
  { name: 'musicbox', html_url: 'https://github.com/hiniko/musicbox', description: 'loops', language: 'JavaScript', stargazers_count: 3, fork: false },
];

test('pinned order and live fields', () => {
  const c = cardsFor(['musicbox', 'homecluster'], repos);
  assert.deepEqual(c.map(x => x.name), ['musicbox', 'homecluster']);
  assert.equal(c[0].stars, 3);
  assert.equal(c[0].language, 'JavaScript');
});

test('fallback when api failed or repo missing', () => {
  const c = cardsFor(['musicbox', 'ghost'], null);
  assert.deepEqual(c[1], { name: 'ghost', url: 'https://github.com/hiniko/ghost', description: '', language: null, stars: null });
  assert.equal(cardsFor(['ghost'], repos)[0].stars, null);
});

test('pages repos link to the live site, user-site repo keeps the repo link', () => {
  const c = cardsFor(['PSTE', 'hiniko.github.io', 'home'], [
    { name: 'PSTE', html_url: 'https://github.com/hiniko/PSTE', has_pages: true, homepage: null },
    { name: 'hiniko.github.io', html_url: 'https://github.com/hiniko/hiniko.github.io', has_pages: true },
    { name: 'home', html_url: 'https://github.com/hiniko/home', has_pages: false, homepage: 'https://example.com' },
  ]);
  assert.deepEqual(c.map(x => x.url), ['https://shermanrose.uk/PSTE/', 'https://github.com/hiniko/hiniko.github.io', 'https://example.com']);
});
