import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync('cv/index.html', 'utf8');
const text = html.replace(/<[^>]+>/g, ' ');

test('no phone numbers', () => {
  assert.doesNotMatch(text, /(\+44|\b0)\s?7\d{3}\s?\d{3}\s?\d{3}/);
  assert.doesNotMatch(html, /tel:/i);
});
test('no named referee line', () => {
  assert.doesNotMatch(text, /available as referee/i);
});
test('contact is email + github only', () => {
  assert.match(html, /mailto:sherman@shermanrose\.uk/);
  assert.match(html, /github\.com\/hiniko/);
});
test('links back to the site and the pdf', () => {
  assert.match(html, /href="\/"/);
  assert.match(html, /sherman-rose-cv\.pdf/);
});
