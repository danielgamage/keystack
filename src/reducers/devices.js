import schema, { defaultDevices } from './schema.js'

let defaultState = {}
defaultDevices.map(el => {
  defaultState[el.id] = el
})

const device = (state, action) => {
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
      return {
        ...state,
        oscillators: [...state.oscillators].filter((el, i) => (i !== action.index))
      }
    case 'UPDATE_OSC':
      newState = { ...state }
      newState.oscillators[action.index][action.property] = action.value
      return newState
    case 'UPDATE_SAMPLE':
      newState = { ...state }
      newState.sample = action.value
      return newState
    case 'UPDATE_DEVICE_ARRAY':
      return {
        ...state,
        [action.property]: [
          ...state[action.property].slice(0, action.index),
          action.value,
          ...state[action.property].slice(action.index + 1)
        ]
      }
    default:
      return state
  }
}

const devices = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_VOLUME_ENVELOPE':
    case 'ADD_OSC':
    case 'DELETE_OSC':
    case 'UPDATE_OSC':
    case 'UPDATE_SAMPLE':
    case 'UPDATE_INSTRUMENT_ITEM':
    case 'UPDATE_DEVICE_ARRAY':
      return {
        ...state,
        [action.id]: device({...state[action.id]}, action)
      }
    case 'UPDATE_DEVICE':
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          [action.property]: action.value
        }
      }
    default:
      return state
  }
}

export default devices
