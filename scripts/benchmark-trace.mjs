import { performance } from 'node:perf_hooks';

import { drawMaze, drawTraceCells } from '../src/canvas.mjs';
import { extendTrace } from '../src/maze.mjs';

const RUNS = 50;
const WIDTH = 401;
const HEIGHT = 401;
const TARGET_X = WIDTH - 2;

function createFixture() {
  const rows = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill('X'));
  for (let x = 1; x < WIDTH - 1; x += 1) {
    rows[1][x] = '';
  }

  const trace = {
    width: WIDTH,
    height: HEIGHT,
    visited: new Uint8Array(WIDTH * HEIGHT),
    cells: [[1, 1]],
  };
  trace.visited[WIDTH + 1] = 1;

  return { rows, trace };
}

function createContext() {
  return {
    fillStyle: '',
    fillRect() {},
  };
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

const fullDrawDurations = [];
const deltaDrawDurations = [];

for (let run = 0; run < RUNS; run += 1) {
  const { rows, trace } = createFixture();
  const update = extendTrace(rows, trace, TARGET_X, 1);

  if (update.addedCells.length !== TARGET_X - 1) {
    throw new Error(`unexpected trace length: ${update.addedCells.length}`);
  }

  const fullContext = createContext();
  let start = performance.now();
  drawMaze(fullContext, rows, trace, false);
  fullDrawDurations.push(performance.now() - start);

  const deltaContext = createContext();
  start = performance.now();
  drawTraceCells(deltaContext, update.addedCells, false);
  deltaDrawDurations.push(performance.now() - start);
}

const fullMedian = median(fullDrawDurations);
const deltaMedian = median(deltaDrawDurations);

console.log(`maze: ${WIDTH}x${HEIGHT}`);
console.log(`delta trace cells: ${TARGET_X - 1}`);
console.log(`runs: ${RUNS}`);
console.log(`full redraw median: ${fullMedian.toFixed(3)} ms`);
console.log(`delta redraw median: ${deltaMedian.toFixed(3)} ms`);
console.log(`relative speedup: ${(fullMedian / deltaMedian).toFixed(1)}x`);
