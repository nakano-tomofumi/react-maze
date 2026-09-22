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

export function drawMaze(context, rows, completed) {
  const height = rows.length;
  const width = rows[0].length;

  context.fillStyle = '#fff';
  context.fillRect(0, 0, width, height);

  const traceColor = completed ? 'green' : 'red';

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = rows[y][x];
      if (cell === 'X') {
        context.fillStyle = '#999';
        context.fillRect(x, y, 1, 1);
      } else if (cell === '.') {
        context.fillStyle = traceColor;
        context.fillRect(x, y, 1, 1);
      }
    }
  }
}
