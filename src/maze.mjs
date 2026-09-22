const ARROWS = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

export function makeMaze(rows, open) {
  while (open.length > 0) {
    let i = open.length - 1;
    if (Math.random() < 0.2) {
      i = Math.floor(Math.random() * Math.floor(open.length));
    }

    const [xy, arrow] = open[i];
    const [x, y] = xy;
    const [xa, ya] = arrow;
    const [x2, y2] = [x + xa * 2, y + ya * 2];

    if (0 < x2 && x2 < rows[0].length && 0 < y2 && y2 < rows.length) {
      if (rows[y2][x2] !== '') {
        const [x1, y1] = [x + xa, y + ya];
        rows[y1][x1] = '';
        rows[y2][x2] = '';

        ARROWS.sort(function() {
          return Math.random() - Math.random();
        });
        ARROWS.forEach((nextArrow) => {
          open.push([[x2, y2], nextArrow]);
        });
      }
    }

    open.splice(i, 1);
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
