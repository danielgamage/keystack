import { store } from './store'
import transposeSample from './transposeSample'

var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
var masterVolume = audioCtx.createGain()
masterVolume.gain.value = 0.2
masterVolume.connect(audioCtx.destination)

const mix = (dry, wet, mix) => {
  dry.gain.value = 1.0 - (mix / 100)
  wet.gain.value = mix / 100
}

const setProps = {
  Filter: (effect, state) => {
    effect.filter.type = state.type
    effect.filter.frequency.value = state.frequency
    effect.filter.Q.value = state.q
    effect.filter.gain.value = state.gain
    mix(effect.dry, effect.wet, state.mix)
  },
  // StereoPanner: (effect, state) => {
  //   effect.pan.value = state.pan
  // },
  Compressor: (effect, state) => {
    effect.compressor.attack.value = state.attack
    effect.compressor.knee.value = state.knee
    effect.compressor.ratio.value = state.ratio
    effect.compressor.release.value = state.release
    effect.compressor.threshold.value = state.threshold
    mix(effect.dry, effect.wet, state.mix)
  },
  Delay: (effect, state) => {
    effect.delay.delayTime.value = state.delay
    effect.feedback.gain.value = state.feedback / 100
    mix(effect.dry, effect.wet, state.mix)
  }
}

const createEffect = {
  Filter: (effect) => {
    let effectObj = {
      id: effect.id,
      filter: audioCtx.createBiquadFilter(),
      dry: audioCtx.createGain(),
      wet: audioCtx.createGain(),
      entry: audioCtx.createGain(),
      exit: audioCtx.createGain()
    }
    effectObj.entry.connect(effectObj.filter)
    effectObj.filter.connect(effectObj.wet)
    effectObj.wet.connect(effectObj.exit)

    effectObj.entry.connect(effectObj.dry)
    effectObj.dry.connect(effectObj.exit)

    setProps[effect.audioEffectType](effectObj, effect)
    audioEffectNodes.push(effectObj)
  },
  // StereoPanner: (effect) => {
  //   const stereoPanner = audioCtx.createStereoPanner()
  //   setProps[effect.audioEffectType](stereoPanner, effect)
  //   audioEffectNodes[effect.id] = stereoPanner
  // },
  Compressor: (effect) => {
    const effectObj = {
      id: effect.id,
      compressor: audioCtx.createDynamicsCompressor(),
      dry: audioCtx.createGain(),
      wet: audioCtx.createGain(),
      entry: audioCtx.createGain(),
      exit: audioCtx.createGain()
    }
    effectObj.entry.connect(effectObj.compressor)
    effectObj.compressor.connect(effectObj.wet)
    effectObj.wet.connect(effectObj.exit)

    effectObj.entry.connect(effectObj.dry)
    effectObj.dry.connect(effectObj.exit)

    setProps[effect.audioEffectType](effectObj, effect)
    audioEffectNodes.push(effectObj)
  },
  Delay: (effect) => {
    let effectObj = {
      id: effect.id,
      delay: audioCtx.createDelay(2.0),
      dry: audioCtx.createGain(),
      wet: audioCtx.createGain(),
      feedback: audioCtx.createGain(),
      entry: audioCtx.createGain(),
      exit: audioCtx.createGain()
    }
    effectObj.entry.connect(effectObj.delay)
    effectObj.delay.connect(effectObj.feedback)
    effectObj.feedback.connect(effectObj.delay)
    effectObj.delay.connect(effectObj.wet)
    effectObj.wet.connect(effectObj.exit)

    effectObj.entry.connect(effectObj.dry)
    effectObj.dry.connect(effectObj.exit)

    setProps[effect.audioEffectType](effectObj, effect)
    audioEffectNodes.push(effectObj)
  }
}

export let audioEffectNodes = []
store.getState().audioEffects.map(effect => {
  createEffect[effect.audioEffectType](effect)
})

// initial connections
store.getState().audioEffects.map((el, i, arr) => {
  if (i !== arr.length - 1) {
    audioEffectNodes[i].exit.connect(audioEffectNodes[i + 1].entry)
  } else {
    audioEffectNodes[i].exit.connect(masterVolume)
  }
})

let currentEffects
function handleChange () {
  let previousEffects = currentEffects
  currentEffects = store.getState().audioEffects
  if (previousEffects && currentEffects.length !== previousEffects.length) {
    // disconnect and remove unused
    audioEffectNodes.map((el, i, arr) => {
      el.exit.disconnect()
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
        audioEffectNodes[i].exit.connect(audioEffectNodes[i + 1].entry)
      } else {
        audioEffectNodes[i].exit.connect(masterVolume)
      }
    })
  }
  currentEffects.map(effect => {
    setProps[effect.audioEffectType](audioEffectNodes.find(el => el.id === effect.id), effect)
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
        noteVolume.connect(audioEffectNodes[0].entry)

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
        noteVolume.connect(audioEffectNodes[0].entry)

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
