export const ZOOM_OUT = 'ZOOM_OUT';
export const ZOOM_IN  = 'ZOOM_IN';
export const RECENTER = 'RECENTER';
export const DRAG_START = 'DRAG_START';
export const DRAG_MOVE  = 'DRAG_MOVE';
export const DRAG_END   = 'DRAG_END';

export function zoom(deltaY) {
  return {
    type: (deltaY > 0)? ZOOM_OUT : ZOOM_IN
  }
}

export function recenter({ latitude, longitude }) {
  return { type: RECENTER, latitude, longitude }
}

export function dragStart({ latitude, longitude }) {
  return { type: DRAG_START, latitude, longitude }
}
export function dragMove({ latitude, longitude }) {
  return { type: DRAG_MOVE, latitude, longitude }
}
export function dragEnd({ latitude, longitude }) {
  return { type: DRAG_END, latitude, longitude }
}
