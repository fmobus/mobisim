import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Dimensions from 'react-dimensions'
import ReactKonva from 'react-konva'
import ScrollLock from 'react-scroll-lock'

import { zoom } from '../actions/map'
import { Tiler, degrees2meters, meters2degress } from '../utils';
import Tile from './Tile'

function mapStateToProps(state, ownProps) {
  return {
    ...state.map,
    width: ownProps.containerWidth,
    height: ownProps.containerHeight
  }
}
function mapDispatchToProps(dispatch) {
  return {
    onScroll: function(ev) {
      dispatch(zoom(ev.deltaY))
    }
  }
}

var tileCoordinate = function(x, y, z, latitude, longitude){
  return [

  ];
}

const Map = React.createClass({
  mixins: [ ScrollLock ],
  propTypes: {
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  },

  componentWillMount() {
    this.tiler = new Tiler(this.props.width, this.props.height);
  },

  componentWillReceiveProps(nextProps) {
    this.tiler = new Tiler(this.props.width, this.props.height);
  },

  buildTile(tile, idx) {
    let key = tile.x + tile.y * 1000;
    return <Tile key={key} {...tile}/>
  },

  render() {
    let { longitude, latitude, zoom, containerHeight: height, containerWidth: width } = this.props
    let tiles = this.tiler.getTiles(longitude, latitude, zoom)
    return (
      <ReactKonva.Stage height={height} width={width}>
        <ReactKonva.Layer>
          <ReactKonva.Rect x={0} y={0} height={height} width={width} fill="lightgray" />
          {tiles.map(this.buildTile)}
        </ReactKonva.Layer>
        <ReactKonva.Layer>
          <ReactKonva.Circle x={100} y={100} radius={200} stroke="blue" />
        </ReactKonva.Layer>
      </ReactKonva.Stage>
    );
  }
});

export default Dimensions()(connect(mapStateToProps, mapDispatchToProps)(Map))
