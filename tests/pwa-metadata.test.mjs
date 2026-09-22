import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const manifestPath = new URL('../public/manifest.json', import.meta.url);
const indexPath = new URL('../index.html', import.meta.url);

test('PWA metadata identifies the app as React Maze', async () => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const html = await readFile(indexPath, 'utf8');

  assert.equal(manifest.name, 'React Maze');
  assert.equal(manifest.short_name, 'React Maze');
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.theme_color, '#121212');
  assert.equal(manifest.background_color, '#121212');

  assert.match(html, /<title>React Maze<\/title>/);
  assert.match(html, /<meta name="theme-color" content="#121212" \/>/);
  assert.doesNotMatch(JSON.stringify(manifest), /Create React App Sample|React App/);
});

test('manifest and HTML reference only React Maze icon assets', async () => {
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  const html = await readFile(indexPath, 'utf8');

  assert.deepEqual(
    manifest.icons.map(({ src, sizes, type }) => ({ src, sizes, type })),
    [
      { src: '/maze-icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/maze-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  );

  assert.match(html, /rel="icon" type="image\/png" href="\/maze-icon-192\.png"/);
  assert.match(html, /rel="apple-touch-icon" href="\/maze-icon-192\.png"/);
  assert.doesNotMatch(html, /logo192\.png|logo512\.png|favicon\.ico/);
});
