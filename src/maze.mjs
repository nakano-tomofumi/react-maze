function takeFrontier(open, index) {
  const lastIndex = open.length - 1;
  const entry = open[index];

  if (index !== lastIndex) {
    open[index] = open[lastIndex];
  }
  open.pop();

  return entry;
}

export function makeMaze(rows, open) {
  const arrows = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  while (open.length > 0) {
    let i = open.length - 1;
    if (Math.random() < 0.2) {
      i = Math.floor(Math.random() * open.length);
    }

    const [xy, arrow] = takeFrontier(open, i);
    const [x, y] = xy;
    const [xa, ya] = arrow;
    const [x2, y2] = [x + xa * 2, y + ya * 2];

    if (0 < x2 && x2 < rows[0].length && 0 < y2 && y2 < rows.length) {
      if (rows[y2][x2] !== '') {
        const [x1, y1] = [x + xa, y + ya];
        rows[y1][x1] = '';
        rows[y2][x2] = '';

        arrows.sort(function() {
          return Math.random() - Math.random();
        });
        arrows.forEach((nextArrow) => {
          open.push([[x2, y2], nextArrow]);
        });
      }
    }
  }
}

function traceIndex(trace, x, y) {
  return y * trace.width + x;
}

export function isTraceVisited(trace, x, y) {
  if (x < 0 || y < 0 || x >= trace.width || y >= trace.height) {
    return false;
  }

  return trace.visited[traceIndex(trace, x, y)] === 1;
}

export function isPassage(rows, x, y) {
  return Boolean(rows[y]) && rows[y][x] === '';
}

export function createTrace(rows) {
  const height = rows.length;
  const width = rows[0].length;
  const trace = {
    width,
    height,
    visited: new Uint8Array(width * height),
    cells: [],
  };

  markTraceCell(trace, 1, 1);
  return trace;
}

function markTraceCell(trace, x, y) {
  const index = traceIndex(trace, x, y);
  if (trace.visited[index] === 1) {
    return false;
  }

  trace.visited[index] = 1;
  trace.cells.push([x, y]);
  return true;
}

export function isMazeCompleted(rows, trace) {
  return isTraceVisited(trace, rows[0].length - 2, rows.length - 2);
}

export function createInitialMazeState(w, h) {
  const [width, height] = [w, h].map((size) => Number.parseInt(size, 10));
  const rows = Array(height * 2 + 1)
    .fill('X')
    .map(() => Array(width * 2 + 1).fill('X'));

  rows[1][1] = '';
  const xy = [1, 1];
  makeMaze(rows, [
    [xy, [1, 0]],
    [xy, [0, 1]],
  ]);

  const trace = createTrace(rows);

  return {
    rows,
    trace,
    completed: isMazeCompleted(rows, trace),
  };
}

export function extendTrace(rows, trace, x, y) {
  if (!isPassage(rows, x, y) || isTraceVisited(trace, x, y)) {
    return {
      addedCells: [],
      completed: isMazeCompleted(rows, trace),
    };
  }

  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  for (const [dx, dy] of directions) {
    let scanX = x;
    let scanY = y;

    while (
      isPassage(rows, scanX, scanY) &&
      !isTraceVisited(trace, scanX, scanY)
    ) {
      scanX += dx;
      scanY += dy;
    }

    if (!isTraceVisited(trace, scanX, scanY)) {
      continue;
    }

    const addedCells = [];
    let traceX = x;
    let traceY = y;

    while (!isTraceVisited(trace, traceX, traceY)) {
      markTraceCell(trace, traceX, traceY);
      addedCells.push([traceX, traceY]);
      traceX += dx;
      traceY += dy;
    }

    return {
      addedCells,
      completed: isMazeCompleted(rows, trace),
    };
  }

  return {
    addedCells: [],
    completed: isMazeCompleted(rows, trace),
  };
}
