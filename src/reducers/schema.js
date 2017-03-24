import generateID from '../utils/generateID'

// ------------
// MIDI Effects
// ------------

export const midiEffectSchema = {
  Transpose: () => ({
    id: generateID(),
    name: `Transpose`,
    midiEffectType: `Transpose`,
    value: 0
  }),
  Chord: () => ({
    id: generateID(),
    name: `Chord`,
    midiEffectType: `Chord`,
    value: [
      0, 0, 0,
      0, 0, 0
    ]
  }),
  DisableNotes: () => ({
    id: generateID(),
    name: `Disable Notes`,
    midiEffectType: `DisableNotes`,
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
  KeySynth: () => ({
    id: generateID(),
    name: `KeySynth`,
    type: `KeySynth`,
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
  Sampler: () => ({
    id: generateID(),
    name: `Sampler`,
    type: `Sampler`,
    volume: 0.8,
    detune: 0,
    pitch: 0,
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
}

// -------------
// Audio Effects
// -------------

export const audioEffectSchema = {
  Filter: () => ({
    id: generateID(),
    name: `Filter`,
    audioEffectType: `Filter`,
    type: `lowpass`,
    frequency: 600,
    q: 0.5,
    gain: 0,
    mix: 100
  }),
  Delay: () => ({
    id: generateID(),
    name: `Delay`,
    audioEffectType: `Delay`,
    mix: 20,
    delay: 0.5,
    feedback: 30
  }),
  Distortion: () => ({
    id: generateID(),
    name: `Distortion`,
    audioEffectType: `Distortion`,
    amount: 300,
    oversample: '2x',
    mix: 100
  }),
  // StereoPanner: () => ({
  //   id: generateID(),
  //   name:   `Stereo Panner`,
  //   audioEffectType: `StereoPanner`,
  //   pan: 0
  // }),
  Compressor: () => ({
    id: generateID(),
    name: `Compressor`,
    audioEffectType: `Compressor`,
    attack: 0.003,
    knee: 30,
    ratio: 12,
    release: 0.25,
    threshold: -24,
    mix: 100
  })
}
