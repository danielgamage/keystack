import generateID from '../utils/generateID'
import { combineReducers } from 'redux'

import schema, { defaultDevices } from './schema.js'

const defaultState = [
  {
    id: generateID(),
    devices: defaultDevices.map(el => el.id)
  }
]

const track = (state, action) => {
  let newState
  switch (action.type) {
    case 'MOVE_DEVICE':
      let newState = [...state.devices]
      let oldItems = newState.splice(action.oldIndex, 1)
      newState.splice((action.newIndex > action.oldIndex ? action.newIndex - 1 : action.newIndex), 0, ...oldItems)
      return {...state, devices: newState}
    default:
      return state
  }
}

const tracks = (state = defaultState, action) => {
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
    case 'MOVE_DEVICE':
      return [track(state[0], action)]
    case 'REMOVE_TRACK':
      return [...state].filter(el => el.id !== action.id)
    default:
      return state
  }
}

export default tracks
