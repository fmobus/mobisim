import { SET_MODE, LOAD } from '../actions/ui'
import { FOCUS_ENTITY } from '../actions/entities'

const initialState = {
  mode: 'PAN'
}

export default function ui (state = initialState, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.mode }
    default:
      return state;
  }
}
