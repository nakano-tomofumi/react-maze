import { performance } from 'node:perf_hooks';

import { createInitialMazeState } from '../src/maze.mjs';

const cases = [
  { width: 84, height: 42, label: '84x42' },
  { width: 200, height: 200, label: '200x200' },
];
const warmupRuns = 2;
const measuredRuns = 5;

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function measure(width, height) {
  const startedAt = performance.now();
  const state = createInitialMazeState(width, height);
  const elapsedMs = performance.now() - startedAt;

  if (state.rows.length !== height * 2 + 1 || state.rows[0].length !== width * 2 + 1) {
    throw new Error(`Unexpected maze dimensions for ${width}x${height}`);
  }

  return elapsedMs;
}

for (const benchmarkCase of cases) {
  for (let i = 0; i < warmupRuns; i += 1) {
    measure(benchmarkCase.width, benchmarkCase.height);
  }

  const timings = [];
  for (let i = 0; i < measuredRuns; i += 1) {
    timings.push(measure(benchmarkCase.width, benchmarkCase.height));
  }

  console.log(
    `${benchmarkCase.label}: median=${median(timings).toFixed(2)}ms runs=[${timings
      .map((value) => value.toFixed(2))
      .join(', ')}] ms`,
  );
}
