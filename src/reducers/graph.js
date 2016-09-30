import _ from 'lodash';

const initialState = [];

function to_deg(angle) { return angle * 180 / Math.PI; }
function to_rad(angle) { return angle * Math.PI / 180; }
function cos(angle) { return Math.cos(to_rad(angle)); }
function sin(angle) { return Math.sin(to_rad(angle)); }

function walk({ northing, easting }, { heading, distance }) {
  return {
    northing: northing + cos(heading) * distance,
    easting:  easting  + sin(heading) * distance
  }
}

function retrace(origin, trace) {
  var position = { northing: origin.northing, easting: origin.easting };
  var heading  = 0;
  trace.split(" ").forEach((p) => {
    switch (p[0]) {
      case 'H':
        heading = parseInt(p.substr(1));
        break;
      case 'F':
        let distance = parseInt(p.substr(1));
        position = walk(position, { heading, distance });
      default:
    }
  });
  return { ...position }
}

function appendToTrace(trace, operation) {
  return trace;
}


export default function map(state = initialState, action) {
  switch (action.type) {
    case 'CREATE_SEGMENT': {
      let startNode = _.find(state, { id: action.fromNode });
      let trace     = `H${action.heading} F${action.distance} H${action.heading}`;
      let endNode   = { id: state.length+1, type: 'Node', ...retrace(startNode, trace) }
      let segment   = { id: state.length+2, type: 'Segment', nodes: [ startNode.id, endNode.id ], trace }

      return [ ...state, endNode, segment ];
    }

    case 'APPEND_SEGMENT_STRAIGHT': {
      let segment   = _.find(state, { id: action.id });
      let startNode = _.find(state, { id: segment.nodes[0] });
      let endNode   = _.find(state, { id: segment.nodes[1] });
      let newTrace  = appendToTrace(segment.trace, 'F30');
      let newSegment = { ...segment, trace: newTrace };
      let newEndNode = { ...endNode, ...retrace(startNode, newTrace) };
      return [
        ..._.reject(state, (o) => (o.id == segment.id) || (o.id == endNode.id)),
        newEndNode,
        newSegment
      ]
    }
    default:
      return state;
  }
}
