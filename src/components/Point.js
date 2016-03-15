import React from 'react'
import ReactKonva from 'react-konva'

export default React.createClass({
  render() {
    let { latitude, longitude, projector } = this.props;
    let [ x, y ] = projector([ longitude, latitude ])
    console.log(x,y)

    return (
      <ReactKonva.Circle x={x} y={y} radius={30} stroke="blue" />
    )
  }
});


