import { ZOOM_IN, ZOOM_OUT } from '../actions/map'

const initialState = {
  latitude: -30.0331,
  longitude: -51.23,
  zoom: 15
}

export default function map(state = initialState, action) {
  switch (action.type) {
    case ZOOM_IN:
      return { ...state, zoom: Math.min(19, state.zoom + 1) }
    case ZOOM_OUT:
      return { ...state, zoom: Math.max(5, state.zoom - 1) }
    default:
      return state;
  }
}