import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Dimensions from 'react-dimensions'
import ScrollLock from 'react-scroll-lock'
import ReactKonva from 'react-konva'
import { partial } from 'lodash'

import { zoom, recenter, dragStart, dragMove, dragEnd } from '../actions/map'
import { createSegment, unfocus, focusEntity } from '../actions/entities'
import Tiler from '../lib/tiler'
import Tile from './Tile'
import Point from './Point'
import Segment from './Segment'

function mapStateToProps(state, ownProps) {
  return {
    ...state.map,
    entities: state.entities,
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
    onDoubleClick: function({ evt: { latitude, longitude }}) {
      dispatch(createSegment({ latitude, longitude }))
    },
    onClickEntity: function(ev, { id }) {
      dispatch(unfocus())
      dispatch(focusEntity(id))
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
    entities: PropTypes.array.isRequired
  },

  buildTile(tile, idx) {
    let key = tile.x + tile.y * 1000;
    return <Tile key={key} {...tile} />
  },

  entityBuilder(projector) {
    return (entity, idx) => {
      let onClick = partial(this.props.onClickEntity, _, { id: entity.id })
      switch (entity.type) {
        case 'Point':   return <Point key={entity.id}   projector={projector.projectToCanvas} {...entity} onClick={onClick} />
        case 'Segment': return <Segment key={entity.id} projector={projector.projectToCanvas} {...entity} onClick={onClick} />
      }
    }
  },

  buildProjector(centerTile) {
    return {
      projectToCanvas([ longitude, latitude]) {
        return [
          centerTile.left + (longitude - centerTile.longitude) / centerTile.inWorldWidth * 256,
          centerTile.top  + (latitude - centerTile.latitude) / centerTile.inWorldHeight * 256
        ]
      },
      enhanceHandlerWithCoordinates(handler) {
        return function(ev) {
          ev.evt.latitude  = centerTile.latitude  - centerTile.inWorldHeight * (centerTile.top  - ev.evt.layerY) / 256;
          ev.evt.longitude = centerTile.longitude - centerTile.inWorldWidth  * (centerTile.left - ev.evt.layerX) / 256;
          return handler(ev);
        }
      }
    }
  },

  render() {
    let { longitude, latitude, zoom, tiler, height, width, entities } = this.props
    let tileSetup = Tiler(width, height).tileSetupFor(longitude, latitude, zoom)
    let centerTile = tileSetup.centerTile();
    let projector = this.buildProjector(centerTile)
    let handlers = {
      onMouseDown: projector.enhanceHandlerWithCoordinates(this.props.onMouseDown),
      onMouseMove: projector.enhanceHandlerWithCoordinates(this.props.onMouseMove),
      onMouseUp:   projector.enhanceHandlerWithCoordinates(this.props.onMouseUp),
      onDblClick:  projector.enhanceHandlerWithCoordinates(this.props.onDoubleClick)
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
          <ReactKonva.Text x={5} y={5} fill="orange" text={`${latitude} / ${longitude} (${zoom})`}/>
          <ReactKonva.Group>
            {entities.map(this.entityBuilder(projector))}
          </ReactKonva.Group>
        </ReactKonva.Layer>
      </ReactKonva.Stage>
    );
  }
});

export default Dimensions()(connect(mapStateToProps, mapDispatchToProps)(Map))
