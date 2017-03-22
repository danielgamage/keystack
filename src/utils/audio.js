import { store } from './store'
import { startMIDIChain } from './midiEffects'

var audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
    masterVolume = audioCtx.createGain(),
    masterCompressor = audioCtx.createDynamicsCompressor()

masterCompressor.connect(masterVolume)
masterVolume.gain.value = 0.2
masterVolume.connect(audioCtx.destination)

const setProps = {
  Filter: (effect, state) => {
    effect.type = state.type
    effect.frequency.value = state.frequency
    effect.Q.value = state.q
    effect.gain.value = state.gain
  },
  StereoPanner: (effect, state) => {
    effect.pan.value = state.pan
  },
  Compressor: (effect, state) => {
    effect.attack.value = state.attack,
    effect.knee.value = state.knee,
    effect.ratio.value = state.ratio,
    effect.release.value = state.release,
    effect.threshold.value = state.threshold
  }
}

const createEffect = {
  Filter: (effect) => {
    const filter = audioCtx.createBiquadFilter()
    setProps[effect.audioEffectType](filter, effect)
    audioEffectNodes[effect.id] = filter
  },
  StereoPanner: (effect) => {
    const stereoPanner = audioCtx.createStereoPanner()
    setProps[effect.audioEffectType](stereoPanner, effect)
    audioEffectNodes[effect.id] = stereoPanner
  },
  Compressor: (effect) => {
    const compressor = audioCtx.createDynamicsCompressor()
    setProps[effect.audioEffectType](compressor, effect)
    audioEffectNodes[effect.id] = compressor
  }
}

export let audioEffectNodes = {}
store.getState().audioEffects.map(effect => {
  createEffect[effect.audioEffectType](effect)
})

let currentEffects
function handleChange() {
  let previousEffects = currentEffects
  currentEffects = store.getState().audioEffects
  currentEffects.map(effect => {
    setProps[effect.audioEffectType](audioEffectNodes[effect.id], effect)
  })
}
let unsubscribe = store.subscribe(handleChange)

store.getState().audioEffects.map((el, i, arr) => {
	if (i !== arr.length - 1) {
		audioEffectNodes[el.id].connect(audioEffectNodes[arr[i+1].id])
	} else {
		audioEffectNodes[el.id].connect(masterCompressor)
	}
})

var oscillators = {}
var samples = {}
const minVolume = 0.00001

export const shiftFrequencyByStep = (frequency, step) => {
  return frequency * (2 ** (step / 12))
}

export const stopNote = (note) => {
  const state = store.getState()
  store.dispatch({
    type: 'REMOVE_NOTE',
    at: 'input',
    value: note
  })
  startMIDIChain(state)
}

export const startNote = (note) => {
  // prevent sticky keys
  const state = store.getState()
  if (!state.notes.input.includes(note)) {
    store.dispatch({
      type: 'ADD_NOTE',
      at: 'input',
      value: note
    })

    startMIDIChain(state)
  }
}

let myBuffer = null

export const loadSample = (instrumentId) => {
  const fileUpload = document.createElement('input')
  fileUpload.type = "file"
  fileUpload.onchange = (e) => {
    const file = [...e.target.files][0]
    readSample(file).then((sampleData) => {
      audioCtx.decodeAudioData(sampleData, function(buffer) {
          myBuffer = buffer
        }, function(e){"Error with decoding audio data" + e.err}
      )
    })
  }
  fileUpload.click()
}

const readSample = (file) => {
  return new Promise(function(resolve, reject) {
    let reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result)
    }, false)
    reader.readAsArrayBuffer(file)
  });
}

export const playInstrument = (notes) => {
  const state = store.getState()
  state.instruments.map(instrument => {
    if (instrument.type === "KeySynth") {
      const envelope = instrument.envelope

      notes.map(note => {
        var noteVolume = audioCtx.createGain()
        noteVolume.gain.value = envelope.initial
        noteVolume.connect(audioEffectNodes[Object.keys(audioEffectNodes)[0]])

        const initializedOscillators = instrument.oscillators.map(el => {
          const osc = audioCtx.createOscillator()
          osc.frequency.value = shiftFrequencyByStep(note.frequency, el.pitch)
          osc.detune.value = el.detune
          osc.type = el.type

          var oscVolume = audioCtx.createGain()
          oscVolume.gain.value = el.volume

          osc.connect(oscVolume)
          oscVolume.connect(noteVolume)

          osc.start(audioCtx.currentTime)
          return osc
        })

        oscillators[note.index] = {
          oscillators: initializedOscillators,
          volume: noteVolume
        }

        noteVolume.gain.linearRampToValueAtTime(Math.max(envelope.peak, minVolume), audioCtx.currentTime + envelope.attack)
        noteVolume.gain.exponentialRampToValueAtTime(Math.max(envelope.sustain, minVolume), audioCtx.currentTime + envelope.attack + envelope.decay)

      })
    } else if (instrument.type === "Sampler") {
      const envelope = instrument.envelope

      notes.map(note => {
        let source = audioCtx.createBufferSource()
        var noteVolume = audioCtx.createGain()
        noteVolume.gain.value = envelope.initial
        noteVolume.connect(audioEffectNodes[Object.keys(audioEffectNodes)[0]])

        source.buffer = myBuffer
        source.playbackRate.value = note.index / 12 * 2
        source.loop = true
        source.connect(noteVolume)
        source.start(audioCtx.currentTime)

        samples[note.index] = {
          instance: source,
          volume: noteVolume
        }

        noteVolume.gain.linearRampToValueAtTime(Math.max(envelope.peak, minVolume), audioCtx.currentTime + envelope.attack)
        noteVolume.gain.exponentialRampToValueAtTime(Math.max(envelope.sustain, minVolume), audioCtx.currentTime + envelope.attack + envelope.decay)
      })
    }
  })

}

export const stopInstrument = (notes) => {
  const state = store.getState()
  state.instruments.map(instrument => {
    notes.map(note => {
      if (instrument.type === "KeySynth") {
        const envelope = instrument.envelope
        oscillators[note.index].oscillators.forEach((oscillator) => {
          oscillator.stop(audioCtx.currentTime + envelope.release)
        })

        oscillators[note.index].volume.gain.cancelScheduledValues(audioCtx.currentTime)
        oscillators[note.index].volume.gain.setValueAtTime(oscillators[note.index].volume.gain.value, audioCtx.currentTime)
        oscillators[note.index].volume.gain.exponentialRampToValueAtTime(minVolume, audioCtx.currentTime + envelope.release)
        oscillators[note.index] = null
      } else if (instrument.type === "Sampler") {
        const envelope = instrument.envelope
        samples[note.index].instance.stop(audioCtx.currentTime + envelope.release)

        samples[note.index].volume.gain.cancelScheduledValues(audioCtx.currentTime)
        samples[note.index].volume.gain.setValueAtTime(samples[note.index].volume.gain.value, audioCtx.currentTime)
        samples[note.index].volume.gain.exponentialRampToValueAtTime(minVolume, audioCtx.currentTime + envelope.release)
        samples[note.index] = null
      }
    })
  })
}
