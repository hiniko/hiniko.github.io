import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('CNAME points at shermanrose.uk', () => {
  assert.equal(readFileSync('CNAME', 'utf8').trim(), 'shermanrose.uk');
});
