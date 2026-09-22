import assert from 'node:assert/strict';
import test from 'node:test';

import { createSeededRandom } from '../src/maze-seed.mjs';
import {
  createInitialMazeState,
  extendTrace,
  isMazeCompleted,
  isPassage,
  isTraceVisited,
} from '../src/maze.mjs';

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

function fixture() {
  const rows = [
    ['X', 'X', 'X', 'X', 'X'],
    ['X', '', '', '', 'X'],
    ['X', 'X', 'X', '', 'X'],
    ['X', 'X', 'X', '', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
  ];
  const trace = {
    width: 5,
    height: 5,
    visited: new Uint8Array(25),
    cells: [[1, 1]],
  };
  trace.visited[6] = 1;
  return { rows, trace };
}

test('same seed and size produce identical maze rows', () => {
  const first = createInitialMazeState(20, 12, createSeededRandom('repeatable-seed'));
  const second = createInitialMazeState(20, 12, createSeededRandom('repeatable-seed'));

  assert.deepEqual(first.rows, second.rows);
});

test('different seeds produce different maze rows for a representative size', () => {
  const first = createInitialMazeState(20, 12, createSeededRandom('seed-a'));
  const second = createInitialMazeState(20, 12, createSeededRandom('seed-b'));

  assert.notDeepEqual(first.rows, second.rows);
});

test('directly injected RNG controls maze generation deterministically', () => {
  const sequence = [0.1, 0.9, 0.3, 0.7, 0.2, 0.8];
  const makeRandom = () => {
    let index = 0;
    return () => {
      const value = sequence[index % sequence.length];
      index += 1;
      return value;
    };
  };

  const first = createInitialMazeState(8, 6, makeRandom());
  const second = createInitialMazeState(8, 6, makeRandom());

  assert.deepEqual(first.rows, second.rows);
});

test('1x1 maze starts completed because start and goal are the same cell', () => {
  const state = createInitialMazeState(1, 1);

  assert.equal(state.completed, true);
  assert.equal(state.rows[1][1], '');
  assert.equal(isTraceVisited(state.trace, 1, 1), true);
});

test('1xN maze with N > 1 does not start completed', () => {
  const state = createInitialMazeState(1, 2);

  assert.equal(state.completed, false);
});

test('Nx1 maze with N > 1 does not start completed', () => {
  const state = createInitialMazeState(2, 1);

  assert.equal(state.completed, false);
});

test('maximum 200x200 maze keeps dimensions, outer walls, and a path to the goal', () => {
  const state = createInitialMazeState(200, 200);

  assert.equal(state.rows.length, 401);
  assert.equal(state.rows[0].length, 401);
  assert.equal(state.rows[1][1], '');
  assertOuterWalls(state.rows);
  assert.equal(canReachGoal(state.rows), true);
});

test('trace state is separate from static maze rows', () => {
  const state = createInitialMazeState(2, 2);
  const before = state.rows.map((row) => row.slice());

  for (let y = 0; y < state.rows.length; y += 1) {
    for (let x = 0; x < state.rows[0].length; x += 1) {
      if (isPassage(state.rows, x, y) && !isTraceVisited(state.trace, x, y)) {
        extendTrace(state.rows, state.trace, x, y);
      }
    }
  }

  assert.deepEqual(state.rows, before);
});

test('extendTrace returns only newly traced cells and keeps static rows unchanged', () => {
  const { rows, trace } = fixture();
  const snapshot = rows.map((row) => row.slice());

  const update = extendTrace(rows, trace, 3, 1);

  assert.deepEqual(rows, snapshot);
  assert.deepEqual(update.addedCells, [[3, 1], [2, 1]]);
  assert.equal(isTraceVisited(trace, 2, 1), true);
  assert.equal(isTraceVisited(trace, 3, 1), true);
  assert.equal(update.completed, false);
});

test('extendTrace composes consecutive moves and completes at the goal', () => {
  const { rows, trace } = fixture();

  const first = extendTrace(rows, trace, 3, 1);
  const second = extendTrace(rows, trace, 3, 3);

  assert.deepEqual(first.addedCells, [[3, 1], [2, 1]]);
  assert.deepEqual(second.addedCells, [[3, 3], [3, 2]]);
  assert.equal(second.completed, true);
  assert.equal(isMazeCompleted(rows, trace), true);
});

test('extendTrace is a no-op for walls and already traced cells', () => {
  const { rows, trace } = fixture();

  assert.deepEqual(extendTrace(rows, trace, 0, 0).addedCells, []);
  assert.deepEqual(extendTrace(rows, trace, 1, 1).addedCells, []);
  assert.equal(trace.cells.length, 1);
});

test('extendTrace is a no-op when no straight path reaches the trace', () => {
  const rows = [
    ['X', 'X', 'X', 'X', 'X'],
    ['X', '', 'X', '', 'X'],
    ['X', 'X', 'X', '', 'X'],
    ['X', '', '', '', 'X'],
    ['X', 'X', 'X', 'X', 'X'],
  ];
  const trace = {
    width: 5,
    height: 5,
    visited: new Uint8Array(25),
    cells: [[1, 1]],
  };
  trace.visited[6] = 1;

  const update = extendTrace(rows, trace, 3, 3);

  assert.deepEqual(update.addedCells, []);
  assert.equal(trace.cells.length, 1);
});
