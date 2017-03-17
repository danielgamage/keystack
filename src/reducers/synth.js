const defaultOSC = {
  type: 'sine',
  volume: 1,
  detune: 0,
  pitch: 0
}
const defaultState = {
  oscillators: [
    {
      type: 'sine',
      volume: 1,
      detune: 0,
      pitch: 0
    }
  ],
  envelope: {
    initial: 0,
    peak: 1,
    sustain: 0.1,
    attack: 0.01,
    decay: 0.5,
    release: 1
  }
}

const synth = (state = defaultState, action) => {
  let newState
  switch (action.type) {
    case 'UPDATE_VOLUME_ENVELOPE':
      newState = { ...state }
      newState.envelope[action.key] = action.value
      return newState
    case 'ADD_OSC':
      newState = { ...state }
      newState.oscillators[newState.oscillators.length] = {
        type: 'sine',
        volume: 1,
        detune: 0,
        pitch: 0
      }
      return newState
    case 'DELETE_OSC':
      return { ...state, oscillators:
        [...state.oscillators].filter((el, i) => (i !== action.index))
      }
    case 'UPDATE_OSC':
      newState = { ...state }
      newState.oscillators[action.index][action.property] = action.value
      return newState
    default:
      return state
  }
}

export default synth
