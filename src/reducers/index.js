import { combineReducers } from 'redux'
import ui from './ui'
import map from './map'
import entities from './entities'
import graph from './graph'

export default combineReducers({
  entities,
  graph,
  map,
  ui,
})
