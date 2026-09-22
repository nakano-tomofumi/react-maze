import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  MAX_SIZE,
  getMazeSize,
} from '../src/maze-size.mjs';

test('missing size parameters use defaults', () => {
  assert.deepEqual(getMazeSize(''), {
    w: DEFAULT_WIDTH,
    h: DEFAULT_HEIGHT,
  });
});

test('invalid size parameters use defaults independently', () => {
  assert.deepEqual(getMazeSize('?w=nope&h='), {
    w: DEFAULT_WIDTH,
    h: DEFAULT_HEIGHT,
  });
  assert.deepEqual(getMazeSize('?w=12&h=nope'), {
    w: 12,
    h: DEFAULT_HEIGHT,
  });
});

test('size parameters are clamped to the supported lower bound', () => {
  assert.deepEqual(getMazeSize('?w=0&h=-10'), { w: 1, h: 1 });
  assert.deepEqual(getMazeSize('?w=1&h=1'), { w: 1, h: 1 });
});

test('size parameters are clamped to the supported upper bound', () => {
  assert.deepEqual(getMazeSize(`?w=${MAX_SIZE}&h=${MAX_SIZE}`), {
    w: MAX_SIZE,
    h: MAX_SIZE,
  });
  assert.deepEqual(getMazeSize('?w=201&h=9999'), {
    w: MAX_SIZE,
    h: MAX_SIZE,
  });
});

test('width and height are parsed independently', () => {
  assert.deepEqual(getMazeSize('?w=17&h=23'), { w: 17, h: 23 });
});
