import { store } from '../utils/store'
import getDevicesOfType from '../utils/getDevicesOfType'
import transposeSample from '../utils/transposeSample'
import { audioCtx, audioEffectNodes } from '../utils/audio'

export const shiftFrequencyByStep = (frequency, step) => {
  return frequency * (2 ** (step / 12))
}

var oscillators = {}
var samples = {}
const minVolume = 0.00001

export const playInstrument = (notes) => {
  const state = store.getState()
  const instruments = getDevicesOfType(state, state.tracks[0].devices, 'instrument')
  instruments.map(instrument => {
    const envelope = instrument.envelope

    switch (instrument.devicePrototype) {
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
  const instruments = getDevicesOfType(state, state.tracks[0].devices, 'instrument')

  instruments.map(instrument => {
    const envelope = instrument.envelope

    switch (instrument.devicePrototype) {
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
