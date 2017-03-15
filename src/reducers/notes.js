const defaultState = [

]

const notes = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_NOTE':
      return [
        ...state,
        action.note
      ]
    case 'REMOVE_NOTE':
      return [...state].filter(el => (el !== action.note))
    default:
      return state
  }
}

export default notes
