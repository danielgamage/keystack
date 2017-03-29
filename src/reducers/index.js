import { combineReducers } from 'redux'
import tracks from './tracks'
import devices from './devices'
import notes from './notes'
import midi from './midi'
import view from './view'

const keystackApp = combineReducers({
  tracks: tracks,
  devices: devices,
  notes: notes,
  midi: midi,
  view: view
})

const rootReducer = (state, action) => {
  // Reset state to default
  if (action.type === 'RESET_STATE') {
    state = undefined
  }
  if (action.type === 'LOAD_STATE') {
    state = action.value
  }
  return keystackApp(state, action)
}

export default rootReducer
