import assert from 'node:assert/strict';
import test from 'node:test';

import { drawMaze, drawTrace, drawTraceCells, getCellFromPointer } from '../src/canvas.mjs';

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

test('drawMaze paints static walls and trace separately', () => {
  const calls = [];
  const context = {
    fillStyle: '',
    fillRect(x, y, width, height) {
      calls.push({ fillStyle: this.fillStyle, x, y, width, height });
    },
  };
  const trace = {
    cells: [[1, 1]],
  };

  drawMaze(context, [
    ['X', 'X', 'X'],
    ['X', '', 'X'],
    ['X', 'X', 'X'],
  ], trace, false);

  assert.deepEqual(calls[0], {
    fillStyle: '#fff',
    x: 0,
    y: 0,
    width: 3,
    height: 3,
  });
  assert.ok(calls.some((call) => call.fillStyle === '#999' && call.x === 0 && call.y === 0));
  assert.ok(calls.some((call) => call.fillStyle === 'red' && call.x === 1 && call.y === 1));
});

test('drawTraceCells only paints the supplied delta cells', () => {
  const calls = [];
  const context = {
    fillStyle: '',
    fillRect(x, y, width, height) {
      calls.push({ fillStyle: this.fillStyle, x, y, width, height });
    },
  };

  drawTraceCells(context, [[2, 1], [3, 1]], false);

  assert.deepEqual(calls, [
    { fillStyle: 'red', x: 2, y: 1, width: 1, height: 1 },
    { fillStyle: 'red', x: 3, y: 1, width: 1, height: 1 },
  ]);
});

test('drawTrace repaints the complete trace green after completion', () => {
  const colors = [];
  const context = {
    fillStyle: '',
    fillRect() {
      colors.push(this.fillStyle);
    },
  };

  drawTrace(context, { cells: [[1, 1], [2, 1], [3, 1]] }, true);

  assert.deepEqual(colors, ['green', 'green', 'green']);
});
