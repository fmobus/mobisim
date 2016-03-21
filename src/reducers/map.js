import { ZOOM_IN, ZOOM_OUT, RECENTER, DRAG_START, DRAG_MOVE, DRAG_END } from '../actions/map'

const initialState = {
  latitude: -30.0331,
  longitude: -51.23,
  zoom: 16,
  dragCenter: {}
}

export default function map(state = initialState, action) {
  switch (action.type) {
    case ZOOM_IN:
      return { ...state, zoom: Math.min(22, state.zoom + 1) }
    case ZOOM_OUT:
      return { ...state, zoom: Math.max(5, state.zoom - 1) }
    case RECENTER:
      return { ...state, latitude: action.latitude, longitude: action.longitude }
    case DRAG_START:
      return { ...state, dragCenter: { latitude: action.latitude, longitude: action.longitude } }
    case DRAG_MOVE:
      if (Object.keys(state.dragCenter).length == 0) { return state }
      let longitude = state.longitude + (state.dragCenter.longitude - action.longitude)
      let latitude  = state.latitude  + (state.dragCenter.latitude  - action.latitude)
      if (isNaN(longitude) || isNaN(latitude)) { return { state } }
      return { ...state, latitude, longitude }
    case DRAG_END:
      return { ...state, dragCenter: { } }
    default:
      return state;
  }
}
