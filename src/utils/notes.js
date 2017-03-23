import { store } from './store'
import { startMIDIChain } from './midiEffects'

export const startNote = (note) => {
  // prevent sticky keys
  const state = store.getState()
  if (!state.notes.input.includes(note)) {
    store.dispatch({
      type: 'ADD_NOTE',
      at: 'input',
      value: note
    })

    startMIDIChain(state)
  }
}

export const stopNote = (note) => {
  const state = store.getState()
  store.dispatch({
    type: 'REMOVE_NOTE',
    at: 'input',
    value: note
  })
  startMIDIChain(state)
}
