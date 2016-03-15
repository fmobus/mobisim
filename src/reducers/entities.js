const initialState = [
  { id: 1000, type: 'Point',   latitude: -30.033100, longitude: -51.230000 },
  { id: 1001, type: 'Segment', latitude: -30.027889, longitude: -51.228269, heading: 160, length: 110 },
  { id: 1002, type: 'Segment', latitude: -30.032070, longitude: -51.238610, heading: 68.5, length: 500 },
  { id: 1003, type: 'Segment', latitude: -30.030370, longitude: -51.233610, heading: 67.5, length: 500 }
]

export default function map(state = initialState, action) {
  return state
}
