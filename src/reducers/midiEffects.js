import { midiEffectSchema } from './schema.js'

const defaultState = [
  midiEffectSchema.Transpose(),
  midiEffectSchema.Chord(),
  midiEffectSchema.DisableNotes()
]

const midiEffect = (state, action) => {
  let newState
  switch (action.type) {
    case 'UPDATE_MIDI_ITEM':
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
    case 'UPDATE_MIDI_ITEM':
    case 'UPDATE_MIDI_VALUE_ARRAY':
      return [...state].map(effect => {
        if (effect.id === action.id) {
          return midiEffect(effect, action)
        } else {
          return effect
        }
      })
    case 'ADD_MIDI_ITEM':
      return [
        ...state,
        midiEffectSchema[action.value]()
        // ...state.slice(action.index, state.length)
      ]
    case 'MOVE_MIDI_ITEM':
      let newState = [...state]
      let oldItems = newState.splice(action.oldIndex, 1)
      newState.splice((action.newIndex > action.oldIndex ? action.newIndex - 1 : action.newIndex), 0, ...oldItems)
      return newState
    case 'REMOVE_MIDI_ITEM':
      return [...state].filter(el => el.id !== action.id)
    default:
      return state
  }
}

export default midiEffects
