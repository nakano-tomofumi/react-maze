export const DEFAULT_WIDTH = 84;
export const DEFAULT_HEIGHT = 42;
export const MAX_SIZE = 200;

const INTEGER_PATTERN = /^-?\d+$/u;
const MIN_SIZE_BIGINT = 1n;
const MAX_SIZE_BIGINT = BigInt(MAX_SIZE);

function parseSize(params, name, fallback) {
  const rawValue = params.get(name);
  if (rawValue === null || !INTEGER_PATTERN.test(rawValue)) {
    return fallback;
  }

  const value = BigInt(rawValue);
  if (value < MIN_SIZE_BIGINT) {
    return 1;
  }
  if (value > MAX_SIZE_BIGINT) {
    return MAX_SIZE;
  }

  return Number(value);
}

export function getMazeSize(search = '') {
  const params = new URLSearchParams(search);

  return {
    w: parseSize(params, 'w', DEFAULT_WIDTH),
    h: parseSize(params, 'h', DEFAULT_HEIGHT),
  };
}
