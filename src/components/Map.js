import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import MapTheTile from 'map-the-tiles'
import ReactKonva from 'react-konva'
import ScrollLock from 'react-scroll-lock'

import { zoom } from '../actions/map'
import { degrees2meters, meters2degress } from '../utils';
import Tile from './Tile'

const TILER = new MapTheTile({ width: 1200, height: 800 });

function mapStateToProps(state) {
  return state.map;
}
function mapDispatchToProps(dispatch) {
  return {
    onScroll: function(ev) {
      dispatch(zoom(ev.deltaY))
    }
  }
}

const Map = React.createClass({
  mixins: [ ScrollLock ],
  propTypes: {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired
  },
  buildTile(tile, idx) {
    let key = tile.x + tile.y * 1000;
    return <Tile key={key} {...tile}/>
  },
  render() {
    console.log('rendering map', this.props)
    let tiles = TILER.getTiles(degrees2meters(this.props.longitude, this.props.latitude), this.props.zoom)
    return (
      <ReactKonva.Stage height={800} width={1200}>
        <ReactKonva.Layer>
          {tiles.map(this.buildTile)}
          <ReactKonva.Rect x={0} y={0} height={800} width={1200} stroke="red" />
        </ReactKonva.Layer>
        <ReactKonva.Layer>
          <ReactKonva.Circle x={100} y={100} radius={200} stroke="blue" />
        </ReactKonva.Layer>
      </ReactKonva.Stage>
    );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Map)
