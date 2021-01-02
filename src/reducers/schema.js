import generateID from "../utils/generateID"

const schema = {
  // -----------
  // Instruments
  // -----------

  instrument: {
    KeySynth: (argsID) => ({
      id: argsID || generateID(),
      name: `KeySynth`,
      deviceType: `instrument`,
      devicePrototype: `KeySynth`,
      oscillators: [
        {
          type: "sine",
          volume: 0.8,
          detune: 0,
          pitch: 0,
        },
      ],
      envelope: {
        initial: 0,
        peak: 1,
        sustain: 0.1,

        attack: 0.05,
        attackBias: -1,

        decay: 0.5,
        decayBias: -1,

        release: 1,
        releaseBias: -1,
      },
    }),
    Sampler: (argsID) => ({
      id: argsID || generateID(),
      name: `Sampler`,
      deviceType: `instrument`,
      devicePrototype: `Sampler`,
      volume: 0.8,
      detune: 0,
      pitch: 27,
      loop: true,
      loopStart: 0,
      loopEnd: 0,
      sample: {
        buffer: null,
        name: null,
        size: null,
        type: null,
        waveform: [0, 0],
      },
      envelope: {
        initial: 0,
        peak: 1,
        sustain: 0.1,
        attack: 0.01,
        decay: 0.5,
        release: 1,
      },
    }),
  },

  // -------------
  // Audio Effects
  // -------------

  audio: {
    Filter: (argsID) => ({
      id: argsID || generateID(),
      name: `Filter`,
      deviceType: `audio`,
      devicePrototype: `Filter`,
      type: `lowpass`,
      frequency: 8000,
      q: 0.5,
      gain: 0,
      mix: 100,
    }),
    Delay: (argsID) => ({
      id: argsID || generateID(),
      name: `Delay`,
      deviceType: `audio`,
      devicePrototype: `Delay`,
      mix: 20,
      delay: 0.5,
      feedback: 30,
    }),
    Waveshaper: (argsID) => ({
      id: argsID || generateID(),
      name: `Waveshaper`,
      deviceType: `audio`,
      method: `chebyshev`,
      devicePrototype: `Waveshaper`,
      amount: 50,
      oversample: "2x",
      mix: 10,
    }),
    // StereoPanner: (argsID) => ({
    //   id: argsID || generateID(),
    //   name:   `Stereo Panner`,
    //   deviceType: `audio`,
    //   devicePrototype: `StereoPanner`,
    //   pan: 0
    // }),
    Compressor: (argsID) => ({
      id: argsID || generateID(),
      name: `Compressor`,
      deviceType: `audio`,
      devicePrototype: `Compressor`,
      attack: 0.003,
      knee: 30,
      ratio: 12,
      release: 0.25,
      threshold: -24,
      mix: 100,
    }),
  },
}

export const defaultDevices = [
  schema.instrument.KeySynth(),
  schema.audio.Filter(),
  schema.audio.Delay(),
  schema.audio.Waveshaper(),
]

export default schema
