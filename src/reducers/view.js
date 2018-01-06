const defaultState = {
  draggingTrackItem: false
};
const view = (state = defaultState, action) => {
  switch (action.type) {
    case "UPDATE_VIEW":
      let newState = { ...state };
      newState[action.property] = action.value;
      return newState;
    default:
      return state;
  }
};

export default view;
