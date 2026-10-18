import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matcher, KONAMI } from '../js/lib/konami.js';

test('fires on exact sequence, tolerates noise before it', () => {
  const m = matcher(KONAMI);
  const keys = ['x', ...KONAMI];
  const results = keys.map(m);
  assert.equal(results.at(-1), true);
  assert.equal(results.slice(0, -1).some(Boolean), false);
});

test('restart mid-sequence still matches', () => {
  const m = matcher(['a', 'a', 'b']);
  assert.equal(['a', 'a', 'a', 'b'].map(m).at(-1), true);
});
