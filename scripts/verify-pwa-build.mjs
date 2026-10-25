import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const buildUrl = new URL('../build/', import.meta.url);
const manifestUrl = new URL('manifest.json', buildUrl);
const icon192Url = new URL('maze-icon-192.png', buildUrl);
const icon512Url = new URL('maze-icon-512.png', buildUrl);

await Promise.all([access(manifestUrl), access(icon192Url), access(icon512Url)]);

const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));

assert.equal(manifest.name, 'React Maze');
assert.equal(manifest.short_name, 'React Maze');
assert.equal(manifest.start_url, '/');
assert.deepEqual(
  manifest.icons.map(({ src, sizes, type }) => ({ src, sizes, type })),
  [
    { src: '/maze-icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/maze-icon-512.png', sizes: '512x512', type: 'image/png' },
  ],
);

console.log('Verified PWA build assets.');
