import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('coarse pointer sizing also applies on hybrid input devices', async () => {
  const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');

  assert.match(css, /@media\s*\(any-pointer:\s*coarse\)/);
  assert.doesNotMatch(css, /@media\s*\(pointer:\s*coarse\)/);
});
