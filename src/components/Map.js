import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Dimensions from 'react-dimensions'
import ReactKonva from 'react-konva'
import ScrollLock from 'react-scroll-lock'

import { zoom, recenter, dragStart, dragMove, dragEnd } from '../actions/map'
import Tiler from '../lib/tiler'
import Tile from './Tile'

function mapStateToProps(state, ownProps) {
  return {
    ...state.map,
    width: ownProps.containerWidth,
    height: ownProps.containerHeight,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    onScroll: function(ev) {
      dispatch(zoom(ev.deltaY))
    },
    onMouseDown: function({ evt: { latitude, longitude }}) {
      dispatch(dragStart({ latitude, longitude }))
    },
    onMouseMove: function({ evt: { movementX, movementY, latitude, longitude, buttons }}) {
      let isMouseDown = buttons & 1
      if (isMouseDown) {
        dispatch(dragMove({ latitude, longitude }))
      }
    },
    onMouseUp: function({ evt: { latitude, longitude }}) {
      dispatch(dragEnd({ latitude, longitude }))
    },
  }
}

const Map = React.createClass({
  mixins: [ ScrollLock ],

  propTypes: {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  },

  buildTile(tile, idx) {
    let key = tile.x + tile.y * 1000;
    return <Tile key={key} {...tile} />
  },

  appendCoords(centerTile, handler) {
    return function(ev) {
      ev.evt.latitude  = centerTile.latitude  - centerTile.inWorldHeight * (centerTile.top  - ev.evt.layerY) / 256;
      ev.evt.longitude = centerTile.longitude - centerTile.inWorldWidth  * (centerTile.left - ev.evt.layerX) / 256;
      return handler(ev);
    }
  },

  render() {
    console.log(this.props);
    let { longitude, latitude, zoom, tiler, height, width } = this.props
    let tileSetup = Tiler(width, height).tileSetupFor(longitude, latitude, zoom)
    let centerTile = tileSetup.centerTile();
    let handlers = {
      onMouseDown: this.appendCoords(centerTile, this.props.onMouseDown),
      onMouseMove: this.appendCoords(centerTile, this.props.onMouseMove),
      onMouseUp:   this.appendCoords(centerTile, this.props.onMouseUp),
    }
    return (
      <ReactKonva.Stage height={height} width={width}>
        <ReactKonva.Layer>
          <ReactKonva.Rect x={0} y={0} height={height} width={width} fill="lightgray" />
          <ReactKonva.Group {...handlers}>
            {tileSetup.tiles().map(this.buildTile)}
          </ReactKonva.Group>
          <ReactKonva.Line points={[ 0, height/2, width, height/2 ]} stroke="lightpink" strokeWidth={1} dash={[ 33,10 ]} />
          <ReactKonva.Line points={[ width/2,  0, width/2, height ]} stroke="lightpink" strokeWidth={1} dash={[ 33,10 ]} />
        </ReactKonva.Layer>
      </ReactKonva.Stage>
    );
  }
});

export default Dimensions()(connect(mapStateToProps, mapDispatchToProps)(Map))
