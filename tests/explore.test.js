import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pick } from '../js/lib/explore.js';

const pool = [
  { kind: 'project', id: 'a' }, { kind: 'project', id: 'b' },
  { kind: 'toy', id: 'c' }, { kind: 'music', id: 'd' },
];
const seq = vals => { let i = 0; return () => vals[i++ % vals.length]; };

test('distinct, one per kind first', () => {
  const r = pick(pool, 3, seq([0.1, 0.5, 0.9, 0.3]));
  assert.equal(new Set(r.map(x => x.kind)).size, 3);
});

test('small pool returns everything', () => {
  assert.equal(pick(pool.slice(0, 2), 5).length, 2);
});
