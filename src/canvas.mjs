export function getCellFromPointer(clientX, clientY, rect, columns, rows) {
  if (
    rect.width <= 0 ||
    rect.height <= 0 ||
    clientX < rect.left ||
    clientY < rect.top ||
    clientX >= rect.right ||
    clientY >= rect.bottom
  ) {
    return null;
  }

  const x = Math.floor(((clientX - rect.left) / rect.width) * columns);
  const y = Math.floor(((clientY - rect.top) / rect.height) * rows);

  if (x < 0 || y < 0 || x >= columns || y >= rows) {
    return null;
  }

  return { x, y };
}

export function drawTraceCells(context, cells, completed) {
  context.fillStyle = completed ? 'green' : 'red';

  for (const [x, y] of cells) {
    context.fillRect(x, y, 1, 1);
  }
}

export function drawTrace(context, trace, completed) {
  drawTraceCells(context, trace.cells, completed);
}

export function drawMaze(context, rows, trace, completed) {
  const height = rows.length;
  const width = rows[0].length;

  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);

  context.fillStyle = '#999';
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (rows[y][x] === 'X') {
        context.fillRect(x, y, 1, 1);
      }
    }
  }

  drawTrace(context, trace, completed);
}
