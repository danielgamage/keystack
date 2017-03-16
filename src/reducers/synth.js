const osc = (state, action) => {
  switch (action.type) {
    case 'ADD_OSC':
      return {
      }
    case 'UPDATE_OSC_TYPE':
      return { ...state, type: action.value }
    default:
      return state
  }
}

const defaultState = {
  oscillators: [
    {
      type: 'sawtooth',
      detune: 10
    },
    {
      type: 'triangle',
      detune: 0
    }
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
  let newState
  switch (action.type) {
    case 'ADD_OSC':
      return { ...state, oscillators: [
        ...state.oscillators,
        osc(undefined, action)
      ]}
    case 'UPDATE_VOLUME_ENVELOPE':
      newState = { ...state }
      newState.envelope[action.key] = action.value
      return newState
    case 'UPDATE_OSC':
      newState = { ...state }
      newState.oscillators[action.index][action.property] = action.value
      return newState
    case 'UPDATE_OSC_TYPE':
      return {...state, oscillators: [...state.oscillators].map((el, i) => {
        if (i === action.index) {
          el = osc(el, action)
        }
        if (el === false) { // why did i add this? probably for a good reason
          return false
        } else {
          return el
        }
      })}
    default:
      return state
  }
}

export default synth
