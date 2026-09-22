import assert from 'node:assert/strict';
import test from 'node:test';

import { createInitialMazeState, extendTrace, isMazeCompleted, updateTraceState } from '../src/maze.mjs';

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


test('extendTrace does not mutate the input and only copies changed rows', () => {
  const rows = [
    ['X', 'X', 'X', 'X', 'X'],
    ['X', '.', 'X', '', 'X'],
    ['X', '', 'X', '', 'X'],
    ['X', '', '', '', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
  ];
  const snapshot = rows.map((row) => row.slice());

  const nextRows = extendTrace(rows, 1, 3);

  assert.deepEqual(rows, snapshot);
  assert.notStrictEqual(nextRows, rows);
  assert.strictEqual(nextRows[0], rows[0]);
  assert.strictEqual(nextRows[1], rows[1]);
  assert.notStrictEqual(nextRows[2], rows[2]);
  assert.notStrictEqual(nextRows[3], rows[3]);
  assert.strictEqual(nextRows[4], rows[4]);
  assert.equal(nextRows[3][1], '.');
  assert.equal(nextRows[2][1], '.');
  assert.equal(nextRows[1][1], '.');
});

test('extendTrace returns the original rows when no path reaches the traced route', () => {
  const rows = [
    ['X', 'X', 'X', 'X', 'X'],
    ['X', '.', 'X', '', 'X'],
    ['X', 'X', 'X', '', 'X'],
    ['X', '', '', '', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
  ];

  const nextRows = extendTrace(rows, 3, 3);

  assert.strictEqual(nextRows, rows);
});

test('extendTrace returns the original rows for walls and already traced cells', () => {
  const rows = [
    ['X', 'X', 'X'],
    ['X', '.', 'X'],
    ['X', 'X', 'X'],
  ];

  assert.strictEqual(extendTrace(rows, 0, 0), rows);
  assert.strictEqual(extendTrace(rows, 1, 1), rows);
});

test('extendTrace can reach the goal without mutating the previous state', () => {
  const rows = [
    ['X', 'X', 'X', 'X', 'X'],
    ['X', '.', '', '', 'X'],
    ['X', 'X', 'X', '', 'X'],
    ['X', 'X', 'X', '', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
  ];
  const previousRows = rows.map((row) => row.slice());

  const firstMove = extendTrace(rows, 3, 1);
  const completedRows = extendTrace(firstMove, 3, 3);

  assert.deepEqual(rows, previousRows);
  assert.equal(isMazeCompleted(rows), false);
  assert.equal(isMazeCompleted(completedRows), true);
});


test('updateTraceState composes consecutive moves from the latest state', () => {
  const initialState = {
    rows: [
      ['X', 'X', 'X', 'X', 'X'],
      ['X', '.', '', '', 'X'],
      ['X', 'X', 'X', '', 'X'],
      ['X', 'X', 'X', '', 'X'],
      ['X', 'X', 'X', 'X', 'X'],
    ],
    completed: false,
  };

  const firstUpdate = updateTraceState(initialState, 3, 1);
  assert.notEqual(firstUpdate, null);

  const stateAfterFirstMove = {
    ...initialState,
    ...firstUpdate,
  };
  const secondUpdate = updateTraceState(stateAfterFirstMove, 3, 3);
  assert.notEqual(secondUpdate, null);

  const finalState = {
    ...stateAfterFirstMove,
    ...secondUpdate,
  };

  assert.equal(initialState.rows[1][2], '');
  assert.equal(initialState.rows[1][3], '');
  assert.equal(stateAfterFirstMove.rows[1][2], '.');
  assert.equal(stateAfterFirstMove.rows[1][3], '.');
  assert.equal(finalState.rows[3][3], '.');
  assert.equal(finalState.completed, true);
});

test('updateTraceState returns null for a no-op update', () => {
  const state = {
    rows: [
      ['X', 'X', 'X'],
      ['X', '.', 'X'],
      ['X', 'X', 'X'],
    ],
    completed: true,
  };

  assert.equal(updateTraceState(state, 1, 1), null);
});
