import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import Dimensions from 'react-dimensions'
import { MousetrapMixin } from 'react-mousetrap-mixin';

import ScrollLock from 'react-scroll-lock'
import ReactKonva from 'react-konva'
import { partial } from 'lodash'

import { zoom, recenter, dragStart, dragMove, dragEnd } from '../actions/map'
import { createPath, extendPath, unfocus, focusEntity, deleteFocusedEntity } from '../actions/entities'
import { setMode } from '../actions/ui'
import Tiler from '../lib/tiler'
import Tile from './Tile'
import Point from './Point'
import Segment from './Segment'
import Path from './Path'

function mapStateToProps(state, ownProps) {
  return {
    ...state.map,
    entities: state.entities,
    width: ownProps.containerWidth,
    height: ownProps.containerHeight,
    mode: state.ui.mode,
  }
}
function mapDispatchToProps(dispatch) {
  return {
    onScroll: function(ev) {
      dispatch(zoom(ev.deltaY))
    },
    onDragMap: {
      start: ({ latitude, longitude }) => dispatch(dragStart({ latitude, longitude })),
      move:  ({ latitude, longitude }) => dispatch(dragMove({ latitude, longitude })),
      end:   ({ latitude, longitude }) => dispatch(dragEnd({ latitude, longitude })),
    },
    onCreateEntity: function({ latitude, longitude }) {
      dispatch(unfocus());
      dispatch(createPath({ latitude, longitude }));
      dispatch(setMode('EXTEND'));
    },
    onExtendEntity: function({ latitude, longitude }) {
      dispatch(extendPath({ latitude, longitude }));
    },
    onClickEntity: function(ev, { id }) {
      if (!ev.evt.shiftKey) { dispatch(unfocus()) }
      dispatch(focusEntity(id))
    },
    onDeleteEntity: function(ev) {
      dispatch(deleteFocusedEntity());
    },
    onSetMode: function(ev, { mode }) {
      dispatch(setMode(mode));
    },
    dispatch
  }
}

const Map = React.createClass({
  mixins: [ ScrollLock, MousetrapMixin ],

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
        case 'Point':   return <Point key={entity.id}   projector={projector.projectToCanvas} {...entity} onClick={onClick} />;
        case 'Segment': return <Segment key={entity.id} projector={projector.projectToCanvas} {...entity} onClick={onClick} />;
        case 'Path':    return <Path key={entity.id}    projector={projector.projectToCanvas} {...entity} onClick={onClick} />;
      }
    }
  },

  buildProjector(centerTile) {
    return {
      projectToCanvas([ longitude, latitude ]) {
        return [
          centerTile.left + (longitude - centerTile.longitude) / centerTile.inWorldWidth  * centerTile.width,
          centerTile.top  + (latitude  - centerTile.latitude)  / centerTile.inWorldHeight * centerTile.height
        ]
      },
      projectFromMapEvent({ layerX, layerY }) {
        return {
          longitude: centerTile.longitude - centerTile.inWorldWidth  * (centerTile.left - layerX) / centerTile.width,
          latitude:  centerTile.latitude  - centerTile.inWorldHeight * (centerTile.top  - layerY) / centerTile.height
        }
      },
    }
  },

  buildDragHandlers(projector, mode) {
    if (mode != 'PAN') { return {}; }
    let handlerMap = this.props.onDragMap;
    return {
      onMouseDown: function({evt}) {
        return handlerMap.start(projector.projectFromMapEvent(evt));
      },
      onMouseMove: function({evt}) {
        if (evt.buttons & 1) {
          return handlerMap.move(projector.projectFromMapEvent(evt));
        }
      },
      onMouseUp: function({evt}) {
        return handlerMap.end(projector.projectFromMapEvent(evt))
      }
    }
  },

  buildClickHandlers(projector, mode) {
    let withEventCoords = (handler) => ({evt}) => handler(projector.projectFromMapEvent(evt))

    switch (mode) {
      case 'CREATE': return { onClick: withEventCoords(this.props.onCreateEntity) }
      case 'EXTEND': return { onClick: withEventCoords(this.props.onExtendEntity) }
      default: return {}
    }
  },

  modeSetter(mode) {
    return (ev) => {
      return this.props.onSetMode(ev, { mode });
    }
  },

  getMousetrap() {
    return {
      x: this.props.onDeleteEntity,
      c: this.modeSetter('CREATE'),
      e: this.modeSetter('EXTEND'),
      esc: this.modeSetter('PAN')
    }
  },

  render() {
    let { longitude, latitude, zoom, tiler, height, width, entities, mode } = this.props
    let tileSetup = Tiler(width, height).tileSetupFor(longitude, latitude, zoom)
    let centerTile = tileSetup.centerTile();
    let projector = this.buildProjector(centerTile)
    let dragHandlers = this.buildDragHandlers(projector, mode)
    let clickHandlers = this.buildClickHandlers(projector, mode)

    return (
      <ReactKonva.Stage height={height} width={width}>
        <ReactKonva.Layer>
          <ReactKonva.Rect x={0} y={0} height={height} width={width} fill="lightgray" />
          <ReactKonva.Group {...dragHandlers} {...clickHandlers}>
            {tileSetup.tiles().map(this.buildTile)}
          </ReactKonva.Group>
          <ReactKonva.Group>
            <ReactKonva.Line points={[ 0, height/2, width, height/2 ]} stroke="lightpink" strokeWidth={1} dash={[ 33,10 ]} />
            <ReactKonva.Line points={[ width/2,  0, width/2, height ]} stroke="lightpink" strokeWidth={1} dash={[ 33,10 ]} />
            <ReactKonva.Text x={5} y={5} fill="orange" text={`${latitude} / ${longitude} (${zoom})`}/>
            <ReactKonva.Text x={5} y={25} fill="red" text={`${mode}`}/>
          </ReactKonva.Group>
          <ReactKonva.Group>
            {entities.map(this.entityBuilder(projector))}
          </ReactKonva.Group>
        </ReactKonva.Layer>
      </ReactKonva.Stage>
    );
  }
});

export default Dimensions()(connect(mapStateToProps, mapDispatchToProps)(Map));
