const osc = (state, action) => {
  switch (action.type) {
    case 'ADD_OSC':
      return {
      }
    default:
      return state
  }
}

const defaultState = {
  oscillators: [
    { type: 'saw' },
    { type: 'tri' }
  ],
  dragged: []
}

const synth = (state = defaultState, action) => {
  switch (action.type) {
    case 'ADD_OSC':
      return { ...state, active: [
        osc(undefined, action),
        ...state.active.slice(action.index, state.length)
      ]}
    default:
      return state
  }
}

export default synth
