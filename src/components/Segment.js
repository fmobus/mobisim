import React, { PropTypes } from 'react'
import ReactKonva from 'react-konva'
import { flatten } from 'lodash'

import { GeoTurtle } from '../lib/turtle'

export default React.createClass({
  propTypes: {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    heading: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    projector: PropTypes.func.isRequired,
    focused: PropTypes.bool,
    onClick: PropTypes.func
  },

  _buildTurtle(props) {
    let { latitude, longitude, heading, length } = props;
    this.turtle = GeoTurtle()
                      .position(longitude, latitude)
                      .heading(heading)
                      .forward(length)
    this.trace = this.turtle.trace();
  },

  componentWillReceiveProps(nextProps) {
    this._buildTurtle(nextProps)
  },
  componentWillMount() {
    this._buildTurtle(this.props)
  },
  render() {
    let { projector, focused } = this.props;
    let points = flatten(this.trace.map(projector));
    let style = {
      stroke: (focused)? 'orange' : 'blue',
      strokeWidth: 5
    }

    return (
      <ReactKonva.Line points={points} {...style} onClick={this.props.onClick} />
    )
  }
});
