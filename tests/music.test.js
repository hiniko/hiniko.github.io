import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickRandom, loopSeconds, sceneOrder, nextScene } from '../js/lib/music.js';

const manifest = {
  title: 'x', tempo: 92,
  tracks: [{ name: 'drums' }, { name: 'bass' }],
  clips: [
    { file: 'a', track: 0, scene: 0, loop_duration_s: 10.4 },
    { file: 'b', track: 1, scene: 0, loop_duration_s: 10.4 },
    { file: 'c', track: 0, scene: 1, loop_duration_s: 20.8 },
  ],
};

test('pickRandom uses injected rng', () => {
  assert.equal(pickRandom(['a', 'b', 'c'], () => 0.99), 'c');
  assert.equal(pickRandom(['a', 'b', 'c'], () => 0), 'a');
});

test('loopSeconds', () => {
  assert.equal(loopSeconds(manifest.clips.filter(c => c.scene === 1)), 20.8);
});

test('sceneOrder and nextScene walk the set then end', () => {
  assert.deepEqual(sceneOrder(manifest), [0, 1]);
  assert.deepEqual(sceneOrder({ ...manifest, scenes: [{ index: 2 }, { index: 0 }] }), [2, 0]);
  assert.equal(nextScene([2, 0], 2), 0);
  assert.equal(nextScene([2, 0], 0), null);
});
