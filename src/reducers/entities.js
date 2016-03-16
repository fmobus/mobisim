import { CREATE_SEGMENT, FOCUS_ENTITY, UNFOCUS_ENTITY } from '../actions/entities'

const initialState = [
  { id: 1000, type: 'Point',   latitude: -30.033100, longitude: -51.230000 },
  { id: 1001, type: 'Segment', latitude: -30.027889, longitude: -51.228269, heading: 160, length: 110 },
  { id: 1002, type: 'Segment', latitude: -30.032070, longitude: -51.238610, heading: 68.5, length: 500 },
  { id: 1003, type: 'Segment', latitude: -30.030370, longitude: -51.233610, heading: 67.5, length: 500 }
]

export default function map(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_SEGMENT':
      let newSegment = { id: action.id, type: 'Segment', latitude: action.latitude, longitude: action.longitude, heading: 90, length: 100 }
      return [ ...state.slice(), newSegment ];

    case 'UNFOCUS_ENTITY':
      let focusedIndex = state.findIndex((e) => e.focused === true)
      if (focusedIndex < 0) { return state }
      let unfocusedEntity = { ...state[focusedIndex], focused: false }
      return [
        ...state.slice(0, focusedIndex),
        unfocusedEntity,
        ...state.slice(focusedIndex+1, state.length)
      ]

    case 'FOCUS_ENTITY':
      let selectedIndex = state.findIndex((e) => action.id === e.id)
      if (selectedIndex < 0) { return state }
      let selectedEntity = { ...state[selectedIndex], focused: true }
      return [
        ...state.slice(0, selectedIndex),
        selectedEntity,
        ...state.slice(selectedIndex+1, state.length)
      ]
    default: return state;
  }
}
