import { combineReducers } from 'redux'
import synth from './synth'
import notes from './notes'

const keystackApp = combineReducers({
  synth: synth,
  notes: notes
})

const rootReducer = (state, action) => {
  // Reset state to default
  if (action.type === 'RESET_STATE') {
    state = undefined
  }
  return keystackApp(state, action)
}

export default rootReducer
