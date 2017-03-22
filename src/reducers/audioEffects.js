import { audioEffectSchema } from './schema'

const defaultState = [
  audioEffectSchema.Filter(),
  audioEffectSchema.StereoPanner(),
  audioEffectSchema.Compressor()
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
    case 'ADD_AUDIO_EFFECT':
      return [
        ...state.slice(0, action.index),
        audioEffectSchema[action.value](),
        ...state.slice(action.index, state.length)
      ]
    default:
      return state
  }
}

export default audioEffects
