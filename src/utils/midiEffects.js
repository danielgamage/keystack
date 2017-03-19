import { store } from './store'
import { keys } from '../utils'
import { playInstrument } from './audio'

export const processMIDI = {
  Transpose: (note, state) => {
    const value = parseInt(note.index) + parseInt(state.value)
    return [ keys[value] ]
  }
}

export const sendNoteToMIDIChain = (note) => {
  const state = store.getState()
  const output = state.midiEffects.reduce((midiInput, effect, currentIndex, array) => {
    const newNotes = processMIDI[effect.midiEffectType](midiInput, effect)
    return newNotes
  }, note)
  output.map(outputNote => {
    store.dispatch({
      type: 'ADD_NOTE',
      at: 'output',
      note: outputNote
    })
  })

  playInstrument(output, note)
}
