import React, { PropTypes } from 'react'
import ReactKonva from 'react-konva'
import { flatten } from 'lodash'

export default React.createClass({
  propTypes: {
    points: PropTypes.array.isRequired,
    projector: PropTypes.func.isRequired,
    focused: PropTypes.bool,
  },

 render() {
    let { projector, focused, points, length = 0 } = this.props;
    let path = points.map(projector);
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

          <ReactKonva.Text   x={last[0]-10} y={last[1]+20} color="red" text={length}/>
        </ReactKonva.Group>
    )
  }
});
