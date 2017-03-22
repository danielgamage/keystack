import { midiEffectSchema } from './schema.js'

const defaultState = [
  midiEffectSchema.Transpose(),
  midiEffectSchema.Chord(),
  midiEffectSchema.DisableNotes()
]

const midiEffect = (state, action) => {
  let newState
  switch (action.type) {
    case 'UPDATE_MIDI_EFFECT':
      newState = { ...state }
      newState[action.property] = action.value
      return newState
    case 'UPDATE_MIDI_VALUE_ARRAY':
      newState = { ...state }
      newState.value[action.index] = action.value
      return newState
    default:
      return state
  }
}

const midiEffects = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_MIDI_EFFECT':
    case 'UPDATE_MIDI_VALUE_ARRAY':
      return [...state].map(effect => {
        if (effect.id === action.id) {
          return midiEffect(effect, action)
        } else {
          return effect
        }
      })
    case 'ADD_MIDI_EFFECT':
      return [
        ...state.slice(0, action.index),
        midiEffectSchema[action.value](),
        ...state.slice(action.index, state.length)
      ]
    default:
      return state
  }
}

export default midiEffects
