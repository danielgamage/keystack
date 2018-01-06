import { store } from "./store";
import getDevicesOfType from "./getDevicesOfType";
import { setProps, createEffect } from "../pipeline/audioEffects";

export let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const master = {
  init() {
    this.exit = audioCtx.createGain();
    this.exit.gain.value = 0.2;
    this.exit.connect(audioCtx.destination);

    this.entry = audioCtx.createGain();
    this.entry.connect(this.exit);
  }
};
master.init();

let initialState = store.getState();

export let audioEffectNodes = [];
initialState.tracks.map((track, trackIndex, trackArray) => {
  track.devices
    .map(el => initialState.devices[el])
    .filter(el => el.deviceType === "audio")
    .map((device, deviceIndex, deviceArray) => {
      createEffect[device.devicePrototype](device);
    });
});

// initial connections
initialState.tracks.map((track, trackIndex, trackArray) => {
  track.devices
    .map(el => initialState.devices[el])
    .filter(el => el.deviceType === "audio")
    .map((device, deviceIndex, deviceArray) => {
      if (deviceIndex !== deviceArray.length - 1) {
        audioEffectNodes[deviceIndex].exit.connect(
          audioEffectNodes[deviceIndex + 1].entry
        );
      } else {
        audioEffectNodes[deviceIndex].exit.connect(master.entry);
      }
    });
});

let currentEffects;
function handleChange() {
  const previousEffects = currentEffects;
  const state = store.getState();
  currentEffects = getDevicesOfType(state, state.tracks[0].devices, "audio");
  if (previousEffects) {
    if (
      currentEffects.length !== previousEffects.length ||
      !currentEffects.every((effect, i) => previousEffects[i].id === effect.id)
    ) {
      // disconnect and remove unused
      audioEffectNodes.map((el, i, arr) => {
        el.exit.disconnect();
        if (!currentEffects.some(effect => el.id === effect.id)) {
          audioEffectNodes.splice(i, 1);
        }
      });
      // add new
      currentEffects.map((effect, i, arr) => {
        if (!audioEffectNodes.some(el => el.id === effect.id)) {
          createEffect[effect.devicePrototype](effect);
        }
      });
      // connect
      currentEffects.map((el, i, arr) => {
        if (i !== arr.length - 1) {
          audioEffectNodes[i].exit.connect(audioEffectNodes[i + 1].entry);
        } else {
          audioEffectNodes[i].exit.connect(master.entry);
        }
      });
    }
  }
  currentEffects.map(effect => {
    setProps[effect.devicePrototype](
      audioEffectNodes.find(el => el.id === effect.id),
      effect
    );
  });
}
let unsubscribe = store.subscribe(handleChange);

let myBuffer = null;
let bufferChannelData;

export const loadSample = (e, instrumentId) => {
  // If dropped items aren't files, reject them
  var dt = e.dataTransfer;

  if (dt.files) {
    const file = [...dt.files][0];
    readSample(file).then(sampleData => {
      audioCtx.decodeAudioData(
        sampleData,
        buffer => {
          bufferChannelData = buffer
            .getChannelData(0)
            .filter((el, i, arr) => i % Math.ceil(arr.length / 256) === 0);
          store.dispatch({
            type: "UPDATE_SAMPLE",
            id: instrumentId,
            value: {
              waveform: bufferChannelData,
              name: file.name,
              size: file.size,
              duration: buffer.duration,
              length: buffer.length,
              type: file.type
            }
          });
          myBuffer = buffer;
        },
        e => {
          "Error with decoding audio data" + e.err;
        }
      );
    });
  }
};

const readSample = file => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        resolve(reader.result);
      },
      false
    );
    reader.readAsArrayBuffer(file);
  });
};
