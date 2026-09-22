import assert from 'node:assert/strict';
import test from 'node:test';

import { createInitialMazeState, isMazeCompleted } from '../src/maze.mjs';

test('1x1 maze starts completed because start and goal are the same cell', () => {
  const state = createInitialMazeState(1, 1);

  assert.equal(state.completed, true);
  assert.equal(state.rows[1][1], '.');
});

test('1xN maze with N > 1 does not start completed', () => {
  const state = createInitialMazeState(1, 2);

  assert.equal(state.completed, false);
});

test('Nx1 maze with N > 1 does not start completed', () => {
  const state = createInitialMazeState(2, 1);

  assert.equal(state.completed, false);
});

test('completion becomes true when the goal cell is traced', () => {
  const state = createInitialMazeState(2, 2);
  const rows = state.rows.map((row) => row.slice());

  rows[rows.length - 2][rows[0].length - 2] = '.';

  assert.equal(isMazeCompleted(rows), true);
});
