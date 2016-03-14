import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Dimensions from 'react-dimensions'
import ReactKonva from 'react-konva'
import ScrollLock from 'react-scroll-lock'

import { zoom, recenter } from '../actions/map'
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
    onClick: function({ evt: { latitude, longitude } }) {
      dispatch(recenter({ latitude, longitude }));
    }
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
    return <Tile key={key} {...tile} onClick={this.props.onClick}/>
  },

  render() {
    let { longitude, latitude, zoom, tiler, height, width } = this.props
    let tiles = Tiler(width, height).getTiles(longitude, latitude, zoom)
    return (
      <ReactKonva.Stage height={height} width={width}>
        <ReactKonva.Layer>
          <ReactKonva.Rect x={0} y={0} height={height} width={width} fill="lightgray" />
          {tiles.map(this.buildTile)}
        </ReactKonva.Layer>
      </ReactKonva.Stage>
    );
  }
});

export default Dimensions()(connect(mapStateToProps, mapDispatchToProps)(Map))
