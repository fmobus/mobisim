export const CREATE_PATH = 'CREATE_PATH';
export const EXTEND_PATH = 'EXTEND_PATH';
export const FOCUS_ENTITY   = 'FOCUS_ENTITY';
export const UNFOCUS_ENTITY = 'UNFOCUS_ENTITY';
export const DELETE_FOCUSED_ENTITY = 'DELETE_FOCUSED_ENTITY';

function id() {
  return Math.floor(Math.random() * Math.pow(2,32))
}

export function createPath({ latitude, longitude }) {
  return { type: CREATE_PATH, latitude, longitude, id: id() }
}

export function extendPath({ latitude, longitude }) {
  return { type: EXTEND_PATH, latitude, longitude }
}

export function unfocus() {
  return { type: UNFOCUS_ENTITY }
}

export function focusEntity(id) {
  return [
    { type: FOCUS_ENTITY, id: id }
  ]
}

export function deleteFocusedEntity() {
  return { type: DELETE_FOCUSED_ENTITY };
}
