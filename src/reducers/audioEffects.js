import { audioEffectSchema } from './schema'

const defaultState = [
  audioEffectSchema.Filter()
  // audioEffectSchema.StereoPanner(),
  // audioEffectSchema.Compressor(),
  // audioEffectSchema.Delay()
]

const filter = (state, action) => {
  let newState
  switch (action.type) {
    case 'UPDATE_AUDIO_ITEM':
      newState = { ...state }
      newState[action.property] = action.value
      return newState
    default:
      return state
  }
}

const audioEffects = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_AUDIO_ITEM':
      return [...state].map(effect => {
        if (effect.id === action.id) {
          return filter(effect, action)
        } else {
          return effect
        }
      })
    case 'ADD_AUDIO_ITEM':
      // return [
        // ...state.slice(0, action.index),
        // audioEffectSchema[action.value](),
        // ...state.slice(action.index, state.length)
      // ]
      return [
        ...state,
        audioEffectSchema[action.value]()
      ]
    case 'REMOVE_AUDIO_ITEM':
      return [...state].filter(el => el.id !== action.id)
    default:
      return state
  }
}

export default audioEffects
