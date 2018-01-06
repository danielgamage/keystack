const defaultState = {
  supports: false,
  inputs: []
};
const midi = (state = defaultState, action) => {
  switch (action.type) {
    case "ADD_MIDI":
      return {
        ...state,
        inputs: [...state.inputs, action.value]
      };
    case "REMOVE_MIDI":
      return {
        ...state,
        inputs: state.inputs.filter(el => el.id !== action.value.id)
      };
    case "CHANGE_MIDI_SUPPORT":
      return {
        ...state,
        supports: action.value
      };
    default:
      return state;
  }
};

export default midi;
