import generateID from '../utils/generateID'
import { combineReducers } from 'redux'

import schema, { defaultDevices } from './schema.js'

const defaultState = [
  {
    id: generateID(),
    devices: defaultDevices.map(el => el.id)
  }
]

// const sortDevices = (array) => {
//   const vals = {
//     midi: 0,
//     instrument: 1,
//     audio: 2
//   }
//   return array.sort((a, b) => a - b)
// }

const track = (state, action) => {
  let newState
  switch (action.type) {
    case 'ADD_DEVICE_TO_TRACK':
      return {
        ...state,
        devices: [
          ...state.devices,
          action.id
        ]
      }
    case 'MOVE_DEVICE':
      console.log(action)
      console.log(state.devices)
      let oldIndex = state.devices.indexOf(action.id)
      let newState = [...state.devices]
      let oldItems = newState.splice(oldIndex, 1)
      newState.splice((action.newIndex > oldIndex ? action.newIndex - 1 : action.newIndex), 0, ...oldItems)
      console.log(newState)
      return {...state, devices: newState}
    case 'REMOVE_DEVICE':
      return {
        ...state,
        devices: [...state.devices].filter(id => id !== action.id)
      }
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
    case 'ADD_DEVICE_TO_TRACK':
    case 'MOVE_DEVICE':
    case 'REMOVE_DEVICE':
      return [track(state[0], action)]
    case 'REMOVE_TRACK':
      return [...state].filter(el => el.id !== action.id)
    default:
      return state
  }
}

export default tracks
