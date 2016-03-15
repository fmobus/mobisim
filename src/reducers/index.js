import { combineReducers } from 'redux'
import ui from './ui'
import map from './map'
import entities from './entities'

export default combineReducers({
  entities,
  map,
  ui
})
