import { test } from 'node:test';
import assert from 'node:assert/strict';
import { easterSunday, pickOccasion, parseOverride } from '../js/lib/dates.js';

test('easter sunday known years', () => {
  assert.deepEqual(easterSunday(2025), { m: 4, d: 20 });
  assert.deepEqual(easterSunday(2026), { m: 4, d: 5 });
  assert.deepEqual(easterSunday(2027), { m: 3, d: 28 });
});

test('occasion windows', () => {
  const d = (y, m, day) => new Date(y, m - 1, day);
  assert.equal(pickOccasion(d(2026, 12, 1)), 'christmas');
  assert.equal(pickOccasion(d(2026, 12, 26)), 'christmas');
  assert.equal(pickOccasion(d(2026, 12, 27)), null);
  assert.equal(pickOccasion(d(2026, 4, 3)), 'easter');    // Good Friday 2026
  assert.equal(pickOccasion(d(2026, 4, 6)), 'easter');    // Easter Monday 2026
  assert.equal(pickOccasion(d(2026, 4, 7)), null);
  assert.equal(pickOccasion(d(2027, 2, 15)), 'birthday');
  assert.equal(pickOccasion(d(2026, 10, 24)), 'halloween');
  assert.equal(pickOccasion(d(2026, 10, 31)), 'halloween');
  assert.equal(pickOccasion(d(2026, 10, 23)), null);
  assert.equal(pickOccasion(d(2027, 2, 14)), null);
  assert.equal(pickOccasion(d(2027, 2, 16)), null);
  assert.equal(pickOccasion(d(2026, 4, 2)), null);
  assert.equal(pickOccasion(d(2026, 11, 30)), null);
});

test('?date override', () => {
  const now = new Date(2026, 9, 12);
  const o = parseOverride('?date=12-25', now);
  assert.equal(o.getMonth(), 11); assert.equal(o.getDate(), 25); assert.equal(o.getFullYear(), 2026);
  assert.equal(parseOverride('', now), now);
  assert.equal(parseOverride('?date=nope', now), now);
});
