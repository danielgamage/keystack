const defaultState = {
  input: [],
  output: []
}

const set = (state, action) => {
  switch (action.type) {
    case 'ADD_NOTE':
      return [
        ...state,
        action.note
      ]
    case 'REMOVE_NOTE':
      return [...state].filter(el => (
        el !== action.note
      ))
    default:
      return state
  }
}

const notes = (state = defaultState, action) => {
  switch (action.at) {
    case 'input':
      return {...state, input: set(state.input, action)}
    case 'output':
      return {...state, output: set(state.output, action)}
    default:
      return state
  }
}

export default notes
