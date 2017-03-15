const defaultState = [

]

const midi = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_MIDI':
      return [
        ...state,
        action.value
      ]
    case 'REMOVE_MIDI':
      return [...state].filter(el => (el.id !== action.value.id))
    default:
      return state
  }
}

export default midi
