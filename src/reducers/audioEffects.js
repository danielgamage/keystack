const defaultState = [
  {
    id: "46",
    audioEffectType: "Filter",
    type: "lowpass",
    frequency: 200,
    q: 0.5,
    gain: 0
  },
  {
    id: "47",
    audioEffectType: "StereoPanner",
    pan: 0
  }
]

const filter = (state, action) => {
  let newState
  switch (action.type) {
    case 'UPDATE_EFFECT':
      newState = { ...state }
      newState[action.property] = action.value
      return newState
    default:
      return state
  }
}

const audioEffects = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_EFFECT':
      return [...state].map(effect => {
        if (effect.id === action.id) {
          return filter(effect, action)
        } else {
          return effect
        }
      })
    default:
      return state
  }
}

export default audioEffects
