import { combineReducers } from 'redux'
import instruments from './instruments'
import audioEffects from './audioEffects'
import notes from './notes'
import midi from './midi'

const keystackApp = combineReducers({
  instruments: instruments,
  audioEffects: audioEffects,
  notes: notes,
  midi: midi
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
