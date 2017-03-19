import { store } from './store'
import { keys } from '../utils'
import { playInstrument, stopInstrument } from './audio'

export const processMIDI = {
  Transpose: (notes, state) => {
    return notes.map(note => {
      const value = parseInt(note.index) + parseInt(state.value)
      return keys[value]
    })
  }
}

export const parseMIDIChain = (oldState) => {
  const state = store.getState()
  const oldInput = oldState.notes.input
  const notes = state.notes.input
  const output = state.midiEffects.reduce((midiInput, effect, currentIndex, array) => {
    const newNotes = processMIDI[effect.midiEffectType](midiInput, effect)
    return newNotes
  }, notes)
  const notesToRemove = oldInput.filter((el, i) => {
    return (!output.includes(el))
  })
  const notesToAdd = output.filter((el, i) => {
    return (!oldInput.includes(el))
  })
  playInstrument(notesToAdd)
  if (notesToRemove.length > 0) {
    stopInstrument(notesToRemove)
  }
  store.dispatch({
    type: 'SET_NOTES',
    at: 'output',
    value: output
  })

}
