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
    { type: 'sawtooth' },
    { type: 'triangle' }
  ],
  envelope: {
    initial: 0,
    peak: 1,
    sustain: 0.2,
    attack: 0.05,
    decay: 0.5,
    release: 1
  }
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
