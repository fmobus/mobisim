import React, { PropTypes } from 'react'
import ReactKonva from 'react-konva'
import { flatten, take, takeRight } from 'lodash'
import LatLon from 'mt-latlon'

const sum = (a,b) => a+b;

const calcDistance = function(points) {
  let asCoords = points.map(LonLat);

  let distanceToNext = function(curr, idx) {
    let next = asCoords[idx+1];
    if (!next) { return 0; }
    return parseFloat(curr.distanceTo(next, 3)) * 1000;
  }
  return parseInt(asCoords.map(distanceToNext).reduce(sum, 0));
}
const LonLat = function([lon, lat]) {
  return new LatLon(lat, lon);
}

export default React.createClass({
  propTypes: {
    points: PropTypes.array.isRequired,
    projector: PropTypes.func.isRequired,
    focused: PropTypes.bool,
  },

 render() {
    let { projector, focused, points } = this.props;
    let path = points.map(projector);
    let totalDistance = calcDistance(points);
    let first = path[0]
    let last = path[path.length-1]

    let style = {
      stroke: (focused)? 'orange' : 'blue',
      strokeWidth: 5,
    }

    return (
        <ReactKonva.Group>
          <ReactKonva.Line points={flatten(path)} {...style} onClick={this.props.onClick} />
          <ReactKonva.Circle x={first[0]} y={first[1]} radius={3} stroke="red"/>
          <ReactKonva.Circle x={last[0]}  y={last[1]}  radius={3} stroke="red"/>

          <ReactKonva.Text   x={last[0]-10} y={last[1]+20} color="red" text={totalDistance}/>
        </ReactKonva.Group>
    )
  }
});
