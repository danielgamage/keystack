const defaultState = {
  theme: {
    lightness: 'light',
    accent: 'green',
  },
}

const view = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_THEME':
      let newState = {...state}
      newState.theme = action.value
      return newState

    default:
      return state
  }
}

export default view
