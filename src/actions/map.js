export const ZOOM_OUT = 'ZOOM_OUT';
export const ZOOM_IN  = 'ZOOM_IN';
export const RECENTER = 'RECENTER';

export function zoom(deltaY) {
  return {
    type: (deltaY > 0)? ZOOM_OUT : ZOOM_IN
  }
}

export function recenter({ latitude, longitude }) {
  return {
    type: RECENTER,
    latitude,
    longitude
  }
}
