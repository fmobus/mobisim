import React from 'react'
import ReactKonva from 'react-konva'
import { flatten } from 'lodash'

import Turtle from '../lib/turtle'

export default React.createClass({
  render() {
    let { latitude, longitude, heading, length, projector } = this.props;
    let turtle = Turtle.GeoTurtle()
                      .position(longitude, latitude)
                      .heading(heading)
                      .forward(length);
    let points = flatten(turtle.trace().map(projector));
    console.log(points);

    return (
      <ReactKonva.Line points={points} stroke="blue" />
    )
  }
});


