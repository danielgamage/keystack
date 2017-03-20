const defaultState = [
  {
    id: "29",
    midiEffectType: "Transpose",
    value: 0
  },
  {
    id: "28",
    midiEffectType: "Chord",
    value: [
      0, 0, 0,
      0, 0, 0
    ]
  }
]

const midiEffect = (state, action) => {
  let newState
  switch (action.type) {
    case 'UPDATE_MIDI_EFFECT':
      newState = { ...state }
      newState[action.property] = action.value
      return newState
    case 'UPDATE_MIDI_CHORD_VALUES':
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
    case 'UPDATE_MIDI_CHORD_VALUES':
      return [...state].map(effect => {
        if (effect.id === action.id) {
          return midiEffect(effect, action)
        } else {
          return effect
        }
      })
    default:
      return state
  }
}

export default midiEffects
