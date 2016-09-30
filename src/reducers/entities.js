import { filter, zip, sum } from 'lodash';
import { CREATE_PATH, EXTEND_PATH, FOCUS_ENTITY, UNFOCUS_ENTITY, DELETE_FOCUSED_ENTITY } from '../actions/entities'
import LatLon from 'mt-latlon';

function pointsFromStream(stream) {
  let values = stream.split(",").map(parseFloat);
  let longitudes = filter(values, (v,i) => i % 2 == 0)
  let latitudes  = filter(values, (v,i) => i % 2 == 1)

  return zip(longitudes, latitudes)
}

const experiment = "-51.23989198684692,-30.033471550337232,-51.2399778175354,-30.034121763427382,-51.24062154769897,-30.03545934464141,-51.24064300537109,-30.035886627529223,-51.24040697097778,-30.036276755383312,-51.239784698486325,-30.036573995653097,-51.23697374343872,-30.03701985605777,-51.236008148193356,-30.03713132115894,-51.2334761428833,-30.037279941293832,-51.23285387039184,-30.037447138945588,-51.232574920654294,-30.03776295673223,-51.232532005310055,-30.03822739465377,-51.232574920654294,-30.038691832575307,-51.23261783599853,-30.039416378908342,-51.230300407409665,-30.042370062362576,-51.231051425933835,-30.047478634374613"
const points = pointsFromStream(experiment)

const calcDistance = function(points) {
  let asCoords = points.map(LonLat);

  let distanceToNext = function(curr, idx) {
    let next = asCoords[idx+1];
    if (!next) { return 0; }
    return parseFloat(curr.distanceTo(next, 3)) * 1000;
  }
  return parseInt(sum(asCoords.map(distanceToNext)));
}
const LonLat = function([lon, lat]) {
  return new LatLon(lat, lon);
}

const initialState = [
  { id: 1001, type: 'Segment', latitude: -30.027889, longitude: -51.228269, heading: 160, length: 110 },
  { id: 1002, type: 'Segment', latitude: -30.032070, longitude: -51.238610, heading: 68.5, length: 500 },
  { id: 1003, type: 'Segment', latitude: -30.030370, longitude: -51.233610, heading: 67.5, length: 500 },
  { id: 1004, type: 'Path', points, length: calcDistance(points) }
]
/*

const desired = [
  { id: 600,  type: 'Node', latitude: -30.027889, longitude: -51.228269, connectsTo: [ 1000 ] },
  { id: 601,  type: 'Node', latitude: -30.027890, longitude: -51.228270, connectsTo: [ 1000, 1001 ] },
  { id: 602,  type: 'Node', latitude: ...       , longitude: ...       , connectsTo: [ 1001 ] }
  { id: 1000, type: 'Station', nodes: [ 600, 601 ], trace: 'N600 H30 F100 N601' },
  { id: 1001, type: 'Segment', nodes: [ 601, 602 ], trace: 'N601 H30 F200 R300,100 F200 L300,100 F200 N602' },
  { id: 1002, type: 'Station', nodes: [ 602, 603 ], trace: 'N602 H30 F100 N603' },
  { id: 1003, type: 'Segment', nodes: [ 603, 604 ], trace: 'N603 H30 F400 N604' }
]
// shift station 1002 50meters back
  { id: 1000, type: 'Station', nodes: [ 600, 601 ], trace: 'N600 H30 F100 N601' },
  { id: 1001, type: 'Segment', nodes: [ 601, 602 ], trace: 'N601 H30 F200 R300,100 F200 L300,100 F150 N602' },
  { id: 1002, type: 'Station', nodes: [ 602, 603 ], trace: 'N602 H30 F100 N603' },
  { id: 1003, type: 'Segment', nodes: [ 603, 604 ], trace: 'N603 H30 F450 N604' }
*/

export default function map(state = initialState, action) {
  switch (action.type) {
    case CREATE_PATH:
      var newSegment = { id: action.id, type: 'Path', points: [ [ action.longitude, action.latitude] ], focused: true }
      return [ ...state.slice(), newSegment ];

    case EXTEND_PATH:
      var selectedIndex = state.findIndex((e) => e.focused);
      if (selectedIndex < 0) { return state; }
      var oldPoints = state[selectedIndex].points;
      var points = [ ...oldPoints, [ action.longitude, action.latitude ] ];
      return [
        ...state.slice(0, selectedIndex),
        { ...state[selectedIndex], points, length: calcDistance(points) },
        ...state.slice(selectedIndex+1, state.length)
      ]

    case UNFOCUS_ENTITY:
      return state.map(function(entity) { return { ...entity, focused: false }; });

    case FOCUS_ENTITY:
      var selectedIndex = state.findIndex((e) => action.id === e.id)
      if (selectedIndex < 0) { return state }
      var selectedEntity = { ...state[selectedIndex], focused: true }
      return [
        ...state.slice(0, selectedIndex),
        selectedEntity,
        ...state.slice(selectedIndex+1, state.length)
      ]

    case DELETE_FOCUSED_ENTITY:
      return state.filter(function(entity) { return !entity.focused; });

    default: return state;
  }
}
