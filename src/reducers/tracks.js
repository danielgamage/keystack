import generateID from '../utils/generateID'
import { combineReducers } from 'redux'

import schema, { defaultDevices } from './schema.js'

const defaultState = [
  {
    id: generateID(),
    devices: defaultDevices.map(el => el.id)
  }
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
    case 'UPDATE_INSTRUMENT_ITEM':
      newState = { ...state }
      newState[action.property] = action.value
      return newState
    default:
      return state
  }
}

const instruments = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_TRACK':
      return [...state].map(instrument => {
        if (instrument.id === action.id) {
          return synth(instrument, action)
        } else {
          return instrument
        }
      })
    case 'ADD_TRACK':
      return [
        ...state,
        instrumentSchema[action.value]()
        // ...state.slice(action.index, state.length)
      ]
    case 'MOVE_TRACK':
      let newState = [...state]
      let oldItems = newState.splice(action.oldIndex, 1)
      newState.splice((action.newIndex > action.oldIndex ? action.newIndex - 1 : action.newIndex), 0, ...oldItems)
      return newState
    case 'REMOVE_TRACK':
      return [...state].filter(el => el.id !== action.id)
    default:
      return state
  }
}

export default instruments
