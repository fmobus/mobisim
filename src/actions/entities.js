export const CREATE_SEGMENT = 'CREATE_SEGMENT';
export const FOCUS_ENTITY   = 'FOCUS_ENTITY';
export const UNFOCUS_ENTITY = 'UNFOCUS_ENTITY';

function id() {
  return Math.floor(Math.random() * Math.pow(2,32))
}

export function createSegment({ latitude, longitude }) {
  return { type: CREATE_SEGMENT, latitude, longitude, id: id() }
}

export function unfocus() {
  return { type: UNFOCUS_ENTITY }
}

export function focusEntity(id) {
  return [
    { type: FOCUS_ENTITY, id: id }
  ]
}
