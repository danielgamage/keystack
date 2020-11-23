import { store } from "../utils/store";
import { keys, noteObjectForIndex } from "../utils";
import getDevicesOfType from "../utils/getDevicesOfType";
import { playInstrument, stopInstrument } from "./instruments";
import { getRandomBoolean, getRandomIntegerInRange } from "utils/random";

export const processMIDI = {
  Transpose: (notes, newNotes, effect, effectIndex, effectsArray, oldState) => {
    const value = notes.map(note => {
      const value = parseInt(note.index) + parseInt(effect.value);
      return keys[value];
    });

    nextInMIDIChain(
      value,
      newNotes,
      effect,
      effectIndex,
      effectsArray,
      oldState
    );
  },

  //

  Chord: (notes, newNotes, effect, effectIndex, effectsArray, oldState) => {
    const value = notes
      .map(note => {
        return [...new Set(effect.value)].map(tone => {
          let newTone = parseInt(note.index) + parseInt(tone);

          if (effect.inversionChance > 0) {
            if (getRandomBoolean(effect.inversionChance)) {
              const multiplier = getRandomIntegerInRange(
                effect.inversionRange * -1,
                effect.inversionRange
              );
              newTone = newTone + 12 * multiplier;
            }
          }

          return keys[newTone] || false;
        });
      })
      .reduce((acc, cur) => {
        return acc.concat(cur);
      }, []);

    nextInMIDIChain(
      value,
      newNotes,
      effect,
      effectIndex,
      effectsArray,
      oldState
    );
  },

  //

  DisableNotes: (
    notes,
    newNotes,
    effect,
    effectIndex,
    effectsArray,
    oldState
  ) => {
    const value = notes.filter(note => effect.value[(note.index + 9) % 12]);

    nextInMIDIChain(
      value,
      newNotes,
      effect,
      effectIndex,
      effectsArray,
      oldState
    );
  }
};

export const nextInMIDIChain = (
  notes,
  newNotes,
  effect,
  effectIndex,
  effectsArray,
  oldState
) => {
  if (effectsArray.length - 1 !== effectIndex) {
    const nextIndex = effectIndex + 1;
    processMIDI[effectsArray[nextIndex].devicePrototype](
      [...new Set(notes)],
      newNotes,
      effectsArray[nextIndex],
      nextIndex,
      effectsArray,
      oldState
    );
  } else {
    sendMIDIOut([...new Set(notes)], oldState);
  }
};

export const startMIDIChain = oldState => {
  const state = store.getState();
  const notes = state.notes.input;
  const newNotes = notes.filter(
    note => !oldState.notes.input.some(oldNote => oldNote.index === note.index)
  );
  const midiDevices = getDevicesOfType(state, state.tracks[0].devices, "midi");
  if (midiDevices.length > 0) {
    processMIDI[midiDevices[0].devicePrototype](
      notes,
      newNotes,
      midiDevices[0],
      0,
      midiDevices,
      oldState
    );
  } else {
    sendMIDIOut(notes, oldState);
  }
};

export const sendMIDIOut = (newOutput, oldState) => {
  newOutput = newOutput.filter(Boolean);
  const oldOutput = oldState.notes.output;
  const notesToRemove = oldOutput.filter((el, i) => {
    return !newOutput.includes(el);
  });
  const notesToAdd = newOutput.filter((el, i) => {
    return !oldOutput.includes(el);
  });
  playInstrument(notesToAdd);
  if (notesToRemove.length > 0) {
    stopInstrument(notesToRemove);
  }
  store.dispatch({
    type: "SET_NOTES",
    at: "output",
    value: newOutput
  });
};
