import { store } from './store'
import { keys } from '../utils'
import { playInstrument, stopInstrument } from './audio'

export const processMIDI = {
  Transpose: (notes, effect, effectIndex, effectsArray, oldState) => {
    const value = notes.map(note => {
      const value = parseInt(note.index) + parseInt(effect.value)
      return keys[value]
    })
    nextInMIDIChain(value, effect, effectIndex, effectsArray, oldState)
  },
  Chord: (notes, effect, effectIndex, effectsArray, oldState) => {
    const value = notes.map(note => {
      return [...new Set(effect.value)].map(tone => {
        const value = parseInt(note.index) + parseInt(tone)
        return keys[value]
      })
    }).reduce((acc, cur) => {
      return acc.concat(cur)
    }, [])
    nextInMIDIChain(value, effect, effectIndex, effectsArray, oldState)
  },
  DisableNotes: (notes, effect, effectIndex, effectsArray, oldState) => {
    const value = notes.filter(note => (
      effect.value[(note.index + 9) % 12]
    ))
    nextInMIDIChain(value, effect, effectIndex, effectsArray, oldState)
  }
}

export const nextInMIDIChain = (notes, effect, effectIndex, effectsArray, oldState) => {
  if ((effectsArray.length - 1) !== effectIndex) {
    processMIDI[effectsArray[effectIndex+1].midiEffectType](notes, effectsArray[effectIndex+1], effectIndex+1, effectsArray, oldState)
  } else {
    sendMIDIOut(notes, oldState)
  }
}

export const startMIDIChain = (oldState) => {
  const state = store.getState()
  const notes = state.notes.input
  if (state.midiEffects.length > 0) {
    const newNotes = processMIDI[state.midiEffects[0].midiEffectType](notes, state.midiEffects[0], 0, state.midiEffects, oldState)
  } else {
    sendMIDIOut(notes, oldState)
  }
}

export const sendMIDIOut = (newOutput, oldState) => {
  const oldOutput = oldState.notes.output
  const notesToRemove = oldOutput.filter((el, i) => {
    return (!newOutput.includes(el))
  })
  const notesToAdd = newOutput.filter((el, i) => {
    return (!oldOutput.includes(el))
  })
  playInstrument(notesToAdd)
  if (notesToRemove.length > 0) {
    stopInstrument(notesToRemove)
  }
  store.dispatch({
    type: 'SET_NOTES',
    at: 'output',
    value: newOutput
  })
}
