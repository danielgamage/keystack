import { combineReducers } from "redux";
import tracks from "./tracks";
import devices from "./devices";
import notes from "./notes";
import midi from "./midi";
import view from "./view";
import preferences from "./preferences";

const keystackApp = combineReducers({
  tracks,
  devices,
  notes,
  midi,
  view,
  preferences
});

const rootReducer = (state, action) => {
  // Reset state to default
  if (action.type === "RESET_STATE") {
    state = undefined;
  }
  if (action.type === "LOAD_STATE") {
    state = action.value;
  }
  return keystackApp(state, action);
};

export default rootReducer;
