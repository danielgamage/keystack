import schema, { defaultDevices } from './schema.js'

let defaultState = {}
defaultDevices.map(el => {
  defaultState[el.id] = el
})

const devices = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_DEVICE_ARRAY':
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          [action.property]: [
            ...state[action.id][action.property].slice(0, action.index),
            action.value,
            ...state[action.id][action.property].slice(action.index + 1)
          ]
        }
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
