import { combineReducers } from 'redux'
import ui from './ui'
import map from './map'

export default combineReducers({
  map,
  ui
})
