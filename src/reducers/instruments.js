import { instrumentSchema } from './schema.js'

const defaultState = [
  instrumentSchema.Sampler()
]

const synth = (state, action) => {
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
    case 'UPDATE_SAMPLE':
      newState = { ...state }
      newState.sample = action.value
      return newState
    default:
      return state
  }
}

const instruments = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_VOLUME_ENVELOPE':
    case 'ADD_OSC':
    case 'DELETE_OSC':
    case 'UPDATE_OSC':
    case 'UPDATE_SAMPLE':
      return [...state].map(instrument => {
        if (instrument.id === action.id) {
          return synth(instrument, action)
        } else {
          return instrument
        }
      })
    default:
      return state
  }
}

export default instruments
