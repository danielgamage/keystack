import generateID from '../utils/generateID'

const schema = {

  // ------------
  // MIDI Effects
  // ------------

  midi: {
    Transpose: (argsID) => ({
      id: argsID || generateID(),
      name: `Transpose`,
      deviceType: `midi`,
      devicePrototype: `Transpose`,
      value: 0
    }),
    Chord: (argsID) => ({
      id: argsID || generateID(),
      name: `Chord`,
      deviceType: `midi`,
      devicePrototype: `Chord`,
      inversionChance: 0,
      inversionRange: 4,
      value: [
        0, 0, 0,
        0, 0, 0
      ]
    }),
    DisableNotes: (argsID) => ({
      id: argsID || generateID(),
      name: `Disable Notes`,
      deviceType: `midi`,
      devicePrototype: `DisableNotes`,
      value: [
        true, true, true, true,
        true, true, true, true,
        true, true, true, true
      ]
    })
  },

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
          type: 'sine',
          volume: 0.8,
          detune: 0,
          pitch: 0
        }
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
        releaseBias: -1
      }
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
        waveform: [0, 0]
      },
      envelope: {
        initial: 0,
        peak: 1,
        sustain: 0.1,
        attack: 0.01,
        decay: 0.5,
        release: 1
      }
    })
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
      mix: 100
    }),
    Delay: (argsID) => ({
      id: argsID || generateID(),
      name: `Delay`,
      deviceType: `audio`,
      devicePrototype: `Delay`,
      mix: 20,
      delay: 0.5,
      feedback: 30
    }),
    Distortion: (argsID) => ({
      id: argsID || generateID(),
      name: `Distortion`,
      deviceType: `audio`,
      devicePrototype: `Distortion`,
      amount: 300,
      oversample: '2x',
      mix: 100
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
      mix: 100
    })
  }
}

export const defaultDevices = [
  schema.midi.Chord(),
  schema.instrument.KeySynth(),
  schema.audio.Filter(),
  schema.audio.Delay()
]

export default schema
