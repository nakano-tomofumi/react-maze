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

export function isMazeCompleted(rows) {
  return rows[rows.length - 2][rows[0].length - 2] === '.';
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

  rows[1][1] = '.';

  return {
    rows,
    completed: isMazeCompleted(rows),
  };
}


export function updateTraceState(previousState, x, y) {
  const rows = extendTrace(previousState.rows, x, y);
  if (rows === previousState.rows) {
    return null;
  }

  return {
    rows,
    completed: isMazeCompleted(rows),
  };
}

export function extendTrace(rows, x, y) {
  if (!rows[y] || rows[y][x] !== '') {
    return rows;
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

    while (rows[scanY][scanX] === '') {
      scanX += dx;
      scanY += dy;
    }

    if (rows[scanY][scanX] !== '.') {
      continue;
    }

    const nextRows = rows.slice();
    const copiedRows = new Set();
    let traceX = x;
    let traceY = y;

    while (rows[traceY][traceX] === '') {
      if (!copiedRows.has(traceY)) {
        nextRows[traceY] = rows[traceY].slice();
        copiedRows.add(traceY);
      }

      nextRows[traceY][traceX] = '.';
      traceX += dx;
      traceY += dy;
    }

    return nextRows;
  }

  return rows;
}
