const initialState = {
  mode: 'PAN'
}

export default function ui (state = initialState, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { mode: action.mode }
    default:
      return state;
  }
}
