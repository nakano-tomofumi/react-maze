import assert from 'node:assert/strict';
import test from 'node:test';

import { getCellFromPointer } from '../src/canvas.mjs';

const rect = {
  left: 10,
  top: 20,
  right: 410,
  bottom: 220,
  width: 400,
  height: 200,
};

test('pointer maps to top-left canvas cell', () => {
  assert.deepEqual(getCellFromPointer(10, 20, rect, 40, 20), { x: 0, y: 0 });
});

test('pointer maps to a middle canvas cell', () => {
  assert.deepEqual(getCellFromPointer(215, 125, rect, 40, 20), { x: 20, y: 10 });
});

test('pointer maps to bottom-right canvas cell', () => {
  assert.deepEqual(getCellFromPointer(409.9, 219.9, rect, 40, 20), { x: 39, y: 19 });
});

test('pointer outside canvas returns null', () => {
  assert.equal(getCellFromPointer(9, 20, rect, 40, 20), null);
  assert.equal(getCellFromPointer(410, 20, rect, 40, 20), null);
  assert.equal(getCellFromPointer(10, 220, rect, 40, 20), null);
});

test('zero-sized canvas rectangle returns null', () => {
  assert.equal(
    getCellFromPointer(10, 20, { ...rect, width: 0, right: 10 }, 40, 20),
    null,
  );
});
