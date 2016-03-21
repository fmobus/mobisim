import React, { PropTypes } from 'react'
import ReactKonva from 'react-konva'
import { flatten } from 'lodash'

import { GeoTurtle } from '../lib/turtle'

const WithTurtle = {
  componentWillReceiveProps(nextProps) {
    this.buildTurtle(nextProps)
  },
  componentWillMount() {
    this.buildTurtle(this.props)
  },
}


const PossiblePaths = React.createClass({
  mixins: [ WithTurtle ],

  propTypes: {
    origin: PropTypes.object.isRequired,
    projector: PropTypes.func.isRequired,
  },

  buildTurtle(props) {
    let { longitude, latitude, heading } = props.origin;
    this.toLeft  = GeoTurtle().position(longitude, latitude).heading(heading).curveLeft(30, 100).trace();
    this.toRight = GeoTurtle().position(longitude, latitude).heading(heading).curveRight(30, 100).trace();
  },

  render() {
    let toLeft = flatten(this.toLeft.map(this.props.projector));
    let toRight = flatten(this.toRight.map(this.props.projector));
    let style = {
      stroke: 'red',
      strokeWidth: 2,
      dash: [ 5, 5 ]
    }

    return (
      <ReactKonva.Group>
        <ReactKonva.Line points={toLeft} {...style}/>
        <ReactKonva.Line points={toRight} {...style}/>
      </ReactKonva.Group>
    );
  }
});

export default React.createClass({
  mixins: [ WithTurtle ],
  propTypes: {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    heading: PropTypes.number.isRequired,
    length: PropTypes.number.isRequired,
    projector: PropTypes.func.isRequired,
    focused: PropTypes.bool,
    onClick: PropTypes.func
  },

  buildTurtle(props) {
    let { latitude, longitude, heading, length } = props;
    this.path = GeoTurtle()
                      .position(longitude, latitude)
                      .heading(heading)
                      .forward(length)
    this.trace = this.path.trace();
    this.origin = { longitude, latitude, heading: heading - 180};
    this.end = {
      longitude: this.path.position()[0],
      latitude: this.path.position()[1],
      heading: this.path.heading()
    }
  },

 render() {
    let { projector, focused, latitude, longitude, heading } = this.props;
    let path = flatten(this.trace.map(projector));

    let style = {
      stroke: (focused)? 'orange' : 'blue',
      strokeWidth: 5
    }

    return (
        <ReactKonva.Group>
          <ReactKonva.Line points={path} {...style} onClick={this.props.onClick} />
          { focused && (<PossiblePaths origin={this.origin} projector={projector} />) }
          { focused && (<PossiblePaths origin={this.end}    projector={projector} />) }
        </ReactKonva.Group>
    )
  }
});
