import { store } from "../utils/store"
import getDevicesOfType from "../utils/getDevicesOfType"
import transposeSample from "../utils/transposeSample"
import { audioCtx, audioEffectNodes } from "../utils/audio"
import { sampleRate, minWebAudioVolume } from "constants.js"
import { getEnvelopeCurves } from "reducers/selectors/envelopes"

var oscillators = {}
var samples = {}

export const shiftFrequencyByStep = (frequency, step) => {
  return frequency * 2 ** (step / 12)
}
//
// const easeInQuad = (t) => (t * t)
// const easeOutQuad = (t) => (t * (2 - t))
// const easeInCubic = (t) =>  (t*t*t)
// const easeOutCubic = (t) =>  ((--t)*t*t+1)
// const easeInQuart = (t) => (t*t*t*t)
// const easeOutQuart = (t) => (1-(--t)*t*t*t)
//
// const getValueCurve = ({
//   duration, // in samples
//   bias, // -1 to +1
//   from,
//   to
// }) => {
//   var curve = new Array(duration).fill()
//
//   const influence = Math.abs(bias)
//
//   const valueMapper = scaleLinear()
//     .domain([0, 1])
//     .range([Math.max(minWebAudioVolume, from), Math.max(minWebAudioVolume, to)])
//
//   const valueCurve = curve.map((el, i) => {
//     const step = i / duration
//     const value = (bias < 0)
//       ? easeOutQuart(step) * influence +
//         step * (1 - influence)
//       : easeInQuart(step) * influence +
//         step * (1 - influence)
//
//     return valueMapper(value)
//   })
//
//   return valueCurve
// }

export const playInstrument = (notes) => {
  const state = store.getState()
  const instruments = getDevicesOfType(
    state,
    state.tracks[0].devices,
    "instrument"
  )
  const instrumentsWithCurves = getEnvelopeCurves(instruments)

  instrumentsWithCurves.forEach((instrument) => {
    const envelope = instrument.envelope

    switch (instrument.devicePrototype) {
      case `KeySynth`:
        notes.map((note) => {
          var noteVolume = audioCtx.createGain()
          noteVolume.gain.value = envelope.initial
          noteVolume.connect(audioEffectNodes[0].entry)

          const initializedOscillators = instrument.oscillators.map((el) => {
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
            volume: noteVolume,
          }

          const attackSamples = Math.floor(envelope.attack * sampleRate)
          const decaySamples = Math.floor(envelope.decay * sampleRate)

          noteVolume.gain.cancelScheduledValues(audioCtx.currentTime)
          // noteVolume.gain.setValueAtTime(audioCtx.currentTime)
          noteVolume.gain.setValueCurveAtTime(
            instrument.envelopeCurves.AD,
            audioCtx.currentTime,
            (attackSamples + decaySamples) / sampleRate
          )
        })
        break

      case `Sampler`:
        if (window.myBuffer !== null) {
          notes.map((note) => {
            let source = audioCtx.createBufferSource()
            var noteVolume = audioCtx.createGain()
            noteVolume.gain.value = envelope.initial
            noteVolume.connect(audioEffectNodes[0].entry)

            source.buffer = window.myBuffer
            source.playbackRate.value = transposeSample(
              note.index + 27 - instrument.pitch
            )
            source.loop = instrument.loop
            source.loopStart = instrument.loopStart
            source.loopEnd = instrument.loopEnd
            source.connect(noteVolume)
            source.start(audioCtx.currentTime)

            samples[note.index] = {
              instance: source,
              volume: noteVolume,
            }

            noteVolume.gain.linearRampToValueAtTime(
              Math.max(envelope.peak, minWebAudioVolume),
              audioCtx.currentTime + envelope.attack
            )
            noteVolume.gain.exponentialRampToValueAtTime(
              Math.max(envelope.sustain, minWebAudioVolume),
              audioCtx.currentTime + envelope.attack + envelope.decay
            )
          })
        }
        break
    }
  })
}

export const stopInstrument = (notes) => {
  const state = store.getState()
  const instruments = getDevicesOfType(
    state,
    state.tracks[0].devices,
    "instrument"
  )
  const instrumentsWithCurves = getEnvelopeCurves(instruments)

  instrumentsWithCurves.forEach((instrument) => {
    const envelope = instrument.envelope

    switch (instrument.devicePrototype) {
      case `KeySynth`:
        notes.map((note) => {
          if (oscillators[note.index]) {
            const gain = oscillators[note.index].volume.gain
            const currentVolume = gain.value

            if (currentVolume > minWebAudioVolume) {
              const releaseSamples = Math.floor(envelope.release * sampleRate)
              const releaseTime = releaseSamples / sampleRate

              const releaseCurve =
                currentVolume === 1
                  ? instrument.envelopeCurves.R
                  : instrument.envelopeCurves.R.map((el) => el * currentVolume)

              gain.cancelScheduledValues(audioCtx.currentTime)
              // gain.setValueAtTime(currentVolume, audioCtx.currentTime)
              gain.setValueCurveAtTime(
                releaseCurve,
                audioCtx.currentTime,
                releaseTime
              )

              oscillators[note.index].oscillators.forEach((oscillator) => {
                oscillator.stop(audioCtx.currentTime + releaseTime)
              })
            } else {
              oscillators[note.index].oscillators.forEach((oscillator) => {
                oscillator.stop(audioCtx.currentTime)
              })
            }

            oscillators[note.index] = null
          }
        })
        break

      case `Sampler`:
        if (window.myBuffer !== null) {
          notes.map((note) => {
            const gain = samples[note.index].volume.gain
            samples[note.index].instance.stop(
              audioCtx.currentTime + envelope.release
            )

            gain.cancelAndHoldAtTime(audioCtx.currentTime)
            gain.setValueAtTime(gain.value, audioCtx.currentTime)
            gain.exponentialRampToValueAtTime(
              minWebAudioVolume,
              audioCtx.currentTime + envelope.release
            )
            samples[note.index] = null
          })
        }
        break
    }
  })
}
