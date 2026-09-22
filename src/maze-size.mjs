export const DEFAULT_WIDTH = 84;
export const DEFAULT_HEIGHT = 42;
export const MAX_SIZE = 200;

function parseSize(params, name, fallback) {
  const value = Number.parseInt(params.get(name), 10);
  if (!Number.isInteger(value)) {
    return fallback;
  }

  return Math.min(Math.max(value, 1), MAX_SIZE);
}

export function getMazeSize(search = '') {
  const params = new URLSearchParams(search);

  return {
    w: parseSize(params, 'w', DEFAULT_WIDTH),
    h: parseSize(params, 'h', DEFAULT_HEIGHT),
  };
}
