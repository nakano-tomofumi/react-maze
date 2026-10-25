import assert from 'node:assert/strict';
import test from 'node:test';

import { createSeededRandom, getMazeSeed } from '../src/maze-seed.mjs';

test('seeded RNG repeats the same sequence for the same seed', () => {
  const first = createSeededRandom('same-seed');
  const second = createSeededRandom('same-seed');

  const firstValues = Array.from({ length: 12 }, () => first());
  const secondValues = Array.from({ length: 12 }, () => second());

  assert.deepEqual(firstValues, secondValues);
  assert.ok(firstValues.every((value) => value >= 0 && value < 1));
});

test('different seeds produce different RNG sequences', () => {
  const first = createSeededRandom('seed-a');
  const second = createSeededRandom('seed-b');

  const firstValues = Array.from({ length: 8 }, () => first());
  const secondValues = Array.from({ length: 8 }, () => second());

  assert.notDeepEqual(firstValues, secondValues);
});

test('getMazeSeed treats missing and empty seed as unspecified', () => {
  assert.equal(getMazeSeed(''), null);
  assert.equal(getMazeSeed('?w=10&h=10'), null);
  assert.equal(getMazeSeed('?seed='), null);
});

test('getMazeSeed returns the URL-decoded non-empty seed string', () => {
  assert.equal(getMazeSeed('?seed=hello%20maze'), 'hello maze');
  assert.equal(getMazeSeed('?seed=%E8%BF%B7%E8%B7%AF'), '迷路');
  assert.equal(getMazeSeed('?seed=00123'), '00123');
});
