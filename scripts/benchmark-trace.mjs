import { performance } from 'node:perf_hooks';

import { extendTrace } from '../src/maze.mjs';

const RUNS = 20;
const WIDTH = 401;
const HEIGHT = 3;
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

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

const durations = [];
for (let run = 0; run < RUNS; run += 1) {
  const { rows, trace } = createFixture();
  const start = performance.now();
  const update = extendTrace(rows, trace, TARGET_X, 1);
  durations.push(performance.now() - start);

  if (update.addedCells.length !== TARGET_X - 1) {
    throw new Error(`unexpected trace length: ${update.addedCells.length}`);
  }
}

console.log(`trace corridor: ${WIDTH}x${HEIGHT}`);
console.log(`runs: ${RUNS}`);
console.log(`median: ${median(durations).toFixed(3)} ms`);
console.log(`samples: ${durations.map((value) => value.toFixed(3)).join(', ')} ms`);
