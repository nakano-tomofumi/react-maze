import assert from 'node:assert/strict';
import test from 'node:test';

import {
  canActivatePointer,
  shouldReleasePointer,
  shouldTrackPointerMove,
} from '../src/pointer-input.mjs';

test('mouse move is always tracked to preserve hover behavior', () => {
  assert.equal(shouldTrackPointerMove('mouse', 1, null), true);
  assert.equal(shouldTrackPointerMove('mouse', 1, 2), true);
});

test('touch and pen moves require the active pointer id', () => {
  assert.equal(shouldTrackPointerMove('touch', 7, 7), true);
  assert.equal(shouldTrackPointerMove('pen', 9, 9), true);
  assert.equal(shouldTrackPointerMove('touch', 8, 7), false);
  assert.equal(shouldTrackPointerMove('pen', 8, null), false);
});

test('only primary non-mouse pointer can become active', () => {
  assert.equal(canActivatePointer('touch', true, null), true);
  assert.equal(canActivatePointer('pen', true, null), true);
  assert.equal(canActivatePointer('mouse', true, null), false);
  assert.equal(canActivatePointer('touch', false, null), false);
  assert.equal(canActivatePointer('touch', true, 4), false);
});

test('only the matching active pointer is released', () => {
  assert.equal(shouldReleasePointer(4, 4), true);
  assert.equal(shouldReleasePointer(5, 4), false);
  assert.equal(shouldReleasePointer(4, null), false);
});
