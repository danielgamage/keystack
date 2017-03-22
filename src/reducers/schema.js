import generateID from '../utils/generateID'

// ------------
// MIDI Effects
// ------------

export const midiEffectSchema = {
  "Transpose": () => ({
    id: generateID(),
    midiEffectType: "Transpose",
    value: 0
  }),
  "Chord": () => ({
    id: generateID(),
    midiEffectType: "Chord",
    value: [
      0, 0, 0,
      0, 0, 0
    ]
  }),
  "DisableNotes": () => ({
    id: generateID(),
    midiEffectType: "DisableNotes",
    value: [
      true, true, true, true,
      true, true, true, true,
      true, true, true, true
    ]
  })
}

// -----------
// Instruments
// -----------

export const instrumentSchema = {
  "KeySynth": () => ({
    id: generateID(),
    type: "KeySynth",
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
      attack: 0.01,
      decay: 0.5,
      release: 1
    }
  }),
  "Sampler": () => ({
    id: generateID(),
    type: "Sampler",
    volume: 0.8,
    detune: 0,
    pitch: 0,
    sample: {
      buffer: null,
      name: null,
      size: null,
      type: null,
      waveform: [0,0]
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
}

// -------------
// Audio Effects
// -------------

export const audioEffectSchema = {
  "Filter": () => ({
    id: "46",
    audioEffectType: "Filter",
    type: "lowpass",
    frequency: 200,
    q: 0.5,
    gain: 0
  }),
  "StereoPanner": () => ({
    id: "47",
    audioEffectType: "StereoPanner",
    pan: 0
  }),
  "Compressor": () => ({
    id: "80",
    audioEffectType: "Compressor",
    attack: 0.003,
    knee: 30,
    ratio: 12,
    release: 0.25,
    threshold: -24
  })
}
