const defaultState = {
  theme: {
    lightness: 'light',
    accent: 'green',
  },
}

const view = (state = defaultState, action) => {
  let newState = {...state}

  switch (action.type) {
    case 'UPDATE_THEME':
      newState.theme = action.value
      return newState

    case 'HYDRATE_USER_SETTINGS':
      newState = action.value
      return newState

    default:
      return state
  }
}

export default view
