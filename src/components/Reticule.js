import React from 'react'
import ReactKonva from 'react-konva'

export default React.createClass({
  render() {
    let debug = false;
    let { width, height, latitude, longitude, zoom, mode } = this.props

    return (
          <ReactKonva.Group>
            <ReactKonva.Line points={[ 0, height/2, width, height/2 ]} stroke="lightpink" strokeWidth={1} dash={[ 33,10 ]} />
            <ReactKonva.Line points={[ width/2,  0, width/2, height ]} stroke="lightpink" strokeWidth={1} dash={[ 33,10 ]} />
            <ReactKonva.Text x={5} y={5} fill="orange" text={`${latitude} / ${longitude} (${zoom})`}/>
            <ReactKonva.Text x={5} y={25} fill="red" text={`${mode}`}/>
          </ReactKonva.Group>
    )
  }
});


