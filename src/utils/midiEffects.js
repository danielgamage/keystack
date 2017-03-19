import { store } from './store'
import { keys } from '../utils'
import { playInstrument } from './audio'

export const processMIDI = {
  Transpose: (note, state) => {
    const value = note.index + state.value
    return [ keys[value] ]
  }
}

export const sendNoteToMIDIChain = (note) => {
  const state = store.getState()
  const output = state.midiEffects.reduce((midiInput, effect, currentIndex, array) => {
    return processMIDI[effect.midiEffectType](midiInput, effect)
  }, note)
  playInstrument(output, note)
}
