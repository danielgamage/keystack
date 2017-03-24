import { store } from './store'
import transposeSample from './transposeSample'
import { setProps, createEffect } from './audioEffects'

export let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
var masterVolume = audioCtx.createGain()
masterVolume.gain.value = 0.2
masterVolume.connect(audioCtx.destination)

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
    const envelope = instrument.envelope
    switch (instrument.type) {
      case `KeySynth`:
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
        break
      case `Sampler`:
        if (myBuffer !== null) {
          notes.map(note => {
            let source = audioCtx.createBufferSource()
            var noteVolume = audioCtx.createGain()
            noteVolume.gain.value = envelope.initial
            noteVolume.connect(audioEffectNodes[0].entry)

            source.buffer = myBuffer
            source.playbackRate.value = transposeSample(note.index + 27 - instrument.pitch)
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
        break
    }
  })
}

export const stopInstrument = (notes) => {
  const state = store.getState()
  state.instruments.map(instrument => {
    const envelope = instrument.envelope
    switch (instrument.type) {
      case `KeySynth`:
        notes.map(note => {
          oscillators[note.index].oscillators.forEach((oscillator) => {
            oscillator.stop(audioCtx.currentTime + envelope.release)
          })

          oscillators[note.index].volume.gain.cancelScheduledValues(audioCtx.currentTime)
          // oscillators[note.index].volume.gain.setValueAtTime(oscillators[note.index].volume.gain.value, audioCtx.currentTime)
          oscillators[note.index].volume.gain.exponentialRampToValueAtTime(minVolume, audioCtx.currentTime + envelope.release)
          oscillators[note.index] = null
        })
        break
      case `Sampler`:
        if (myBuffer !== null) {
          notes.map(note => {
            samples[note.index].instance.stop(audioCtx.currentTime + envelope.release)

            samples[note.index].volume.gain.cancelScheduledValues(audioCtx.currentTime)
            // samples[note.index].volume.gain.setValueAtTime(samples[note.index].volume.gain.value, audioCtx.currentTime)
            samples[note.index].volume.gain.exponentialRampToValueAtTime(minVolume, audioCtx.currentTime + envelope.release)
            samples[note.index] = null
          })
        }
        break
    }
  })
}
