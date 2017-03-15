import { combineReducers } from 'redux'
import synth from './synth'
import notes from './notes'
import midi from './midi'

const keystackApp = combineReducers({
  synth: synth,
  notes: notes,
  midi: midi
})

const rootReducer = (state, action) => {
  // Reset state to default
  if (action.type === 'RESET_STATE') {
    state = undefined
  }
  return keystackApp(state, action)
}

export default rootReducer
