import assert from 'node:assert/strict';
import test from 'node:test';

import { createInitialMazeState, isMazeCompleted } from '../src/maze.mjs';

function canReachGoal(rows) {
  const goalX = rows[0].length - 2;
  const goalY = rows.length - 2;
  const queue = [[1, 1]];
  const visited = new Set(['1,1']);
  let cursor = 0;

  while (cursor < queue.length) {
    const [x, y] = queue[cursor];
    cursor += 1;

    if (x === goalX && y === goalY) {
      return true;
    }

    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
      const nextX = x + dx;
      const nextY = y + dy;
      const key = `${nextX},${nextY}`;

      if (
        nextX < 0 ||
        nextY < 0 ||
        nextY >= rows.length ||
        nextX >= rows[0].length ||
        rows[nextY][nextX] === 'X' ||
        visited.has(key)
      ) {
        continue;
      }

      visited.add(key);
      queue.push([nextX, nextY]);
    }
  }

  return false;
}

function assertOuterWalls(rows) {
  const lastRow = rows.length - 1;
  const lastColumn = rows[0].length - 1;

  assert.ok(rows[0].every((cell) => cell === 'X'));
  assert.ok(rows[lastRow].every((cell) => cell === 'X'));

  for (const row of rows) {
    assert.equal(row[0], 'X');
    assert.equal(row[lastColumn], 'X');
  }
}

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

test('maximum 200x200 maze keeps dimensions, outer walls, and a path to the goal', () => {
  const state = createInitialMazeState(200, 200);

  assert.equal(state.rows.length, 401);
  assert.equal(state.rows[0].length, 401);
  assert.equal(state.rows[1][1], '.');
  assertOuterWalls(state.rows);
  assert.equal(canReachGoal(state.rows), true);
});
