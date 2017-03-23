import { store } from './store'
import transposeSample from './transposeSample'

var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
var masterVolume = audioCtx.createGain()
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
    effect.attack.value = state.attack
    effect.knee.value = state.knee
    effect.ratio.value = state.ratio
    effect.release.value = state.release
    effect.threshold.value = state.threshold
  }
}

const createEffect = {
  Filter: (effect) => {
    const filter = audioCtx.createBiquadFilter()
    setProps[effect.audioEffectType](filter, effect)
    audioEffectNodes.push({
      id: effect.id,
      node: filter
    })
  },
  // StereoPanner: (effect) => {
  //   const stereoPanner = audioCtx.createStereoPanner()
  //   setProps[effect.audioEffectType](stereoPanner, effect)
  //   audioEffectNodes[effect.id] = stereoPanner
  // },
  Compressor: (effect) => {
    const compressor = audioCtx.createDynamicsCompressor()
    setProps[effect.audioEffectType](compressor, effect)
    audioEffectNodes.push({
      id: effect.id,
      node: compressor
    })
  }
}

export let audioEffectNodes = []
store.getState().audioEffects.map(effect => {
  createEffect[effect.audioEffectType](effect)
})

// initial connections
store.getState().audioEffects.map((el, i, arr) => {
  if (i !== arr.length - 1) {
    audioEffectNodes[i].node.connect(audioEffectNodes[i + 1].node)
  } else {
    audioEffectNodes[i].node.connect(masterVolume)
  }
})

let currentEffects
function handleChange () {
  let previousEffects = currentEffects
  currentEffects = store.getState().audioEffects
  if (previousEffects && currentEffects.length !== previousEffects.length) {
    // disconnect and remove unused
    audioEffectNodes.map((el, i, arr) => {
      el.node.disconnect()
      if (!currentEffects.some(effect => el.id === effect.id)) {
        audioEffectNodes.splice(i, 1)
      }
    })
    // add new
    currentEffects.map((effect, i, arr) => {
      if (!audioEffectNodes.some(el => el.id === effect.id)) {
        createEffect[effect.audioEffectType](effect)
      }
    })
    // connect
    currentEffects.map((el, i, arr) => {
      if (i !== arr.length - 1) {
        audioEffectNodes[i].node.connect(audioEffectNodes[i + 1].node)
      } else {
        audioEffectNodes[i].node.connect(masterVolume)
      }
    })
  }
  currentEffects.map(effect => {
    setProps[effect.audioEffectType](audioEffectNodes.find(el => el.id === effect.id).node, effect)
  })
}
let unsubscribe = store.subscribe(handleChange)

var oscillators = {}
var samples = {}
const minVolume = 0.00001

export const shiftFrequencyByStep = (frequency, step) => {
  return frequency * (2 ** (step / 12))
}

let myBuffer = null
let bufferChannelData

export const loadSample = (e, instrumentId) => {
  // If dropped items aren't files, reject them
  var dt = e.dataTransfer

  if (dt.files) {
    const file = [...dt.files][0]
    readSample(file).then((sampleData) => {
      audioCtx.decodeAudioData(sampleData, (buffer) => {
        bufferChannelData = buffer.getChannelData(0)
          .filter((el, i, arr) => (i % Math.ceil(arr.length / 256) === 0))
        store.dispatch({
          type: 'UPDATE_SAMPLE',
          id: instrumentId,
          value: {
            waveform: bufferChannelData,
            name: file.name,
            size: file.size,
            duration: buffer.duration,
            length: buffer.length,
            type: file.type
          }
        })
        myBuffer = buffer
      }, (e) => { 'Error with decoding audio data' + e.err })
    })
  }
}

const readSample = (file) => {
  return new Promise((resolve, reject) => {
    let reader = new FileReader()
    reader.addEventListener('load', () => {
      resolve(reader.result)
    }, false)
    reader.readAsArrayBuffer(file)
  })
}

export const playInstrument = (notes) => {
  const state = store.getState()
  state.instruments.map(instrument => {
    if (instrument.type === `KeySynth`) {
      const envelope = instrument.envelope

      notes.map(note => {
        var noteVolume = audioCtx.createGain()
        noteVolume.gain.value = envelope.initial
        noteVolume.connect(audioEffectNodes[0].node)

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
    } else if (instrument.type === `Sampler`) {
      const envelope = instrument.envelope

      notes.map(note => {
        let source = audioCtx.createBufferSource()
        var noteVolume = audioCtx.createGain()
        noteVolume.gain.value = envelope.initial
        noteVolume.connect(audioEffectNodes[0].node)

        source.buffer = myBuffer
        source.playbackRate.value = transposeSample(note.index)
        source.loop = instrument.loop
        source.loopStart = instrument.loopStart
        source.loopEnd = instrument.loopEnd
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
      if (instrument.type === `KeySynth`) {
        const envelope = instrument.envelope
        oscillators[note.index].oscillators.forEach((oscillator) => {
          oscillator.stop(audioCtx.currentTime + envelope.release)
        })

        oscillators[note.index].volume.gain.cancelScheduledValues(audioCtx.currentTime)
        // oscillators[note.index].volume.gain.setValueAtTime(oscillators[note.index].volume.gain.value, audioCtx.currentTime)
        oscillators[note.index].volume.gain.exponentialRampToValueAtTime(minVolume, audioCtx.currentTime + envelope.release)
        oscillators[note.index] = null
      } else if (instrument.type === `Sampler`) {
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
