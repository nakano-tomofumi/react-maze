export function canActivatePointer(pointerType, isPrimary, activePointerId) {
  return pointerType !== 'mouse' && isPrimary && activePointerId === null;
}

export function shouldTrackPointerMove(pointerType, pointerId, activePointerId) {
  return pointerType === 'mouse' || pointerId === activePointerId;
}

export function shouldReleasePointer(pointerId, activePointerId) {
  return pointerId === activePointerId;
}
