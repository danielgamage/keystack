import { store } from '../utils/store'
import getDevicesOfType from '../utils/getDevicesOfType'
import transposeSample from '../utils/transposeSample'
import { audioCtx, audioEffectNodes } from '../utils/audio'
import { scaleLinear } from 'd3-scale'

var oscillators = {}
var samples = {}
const minVolume = 0.00001
const sampleRate = 44100

export const shiftFrequencyByStep = (frequency, step) => {
  return frequency * (2 ** (step / 12))
}

const easeInQuad = (t) => (t * t)
const easeOutQuad = (t) => (t * (2 - t))
const easeInCubic = (t) =>  (t*t*t)
const easeOutCubic = (t) =>  ((--t)*t*t+1)
const easeInQuart = (t) => (t*t*t*t)
const easeOutQuart = (t) => (1-(--t)*t*t*t)

const getValueCurve = ({
  duration, // in samples
  bias, // -1 to +1
  from,
  to
}) => {
  var curve = new Array(duration).fill()

  const influence = Math.abs(bias)

  const valueMapper = scaleLinear()
    .domain([0, 1])
    .range([Math.max(minVolume, from), Math.max(minVolume, to)])

  const valueCurve = curve.map((el, i) => {
    const step = i / duration
    const value = (bias < 0)
      ? easeOutQuart(step) * influence +
        step * (1 - influence)
      : easeInQuart(step) * influence +
        step * (1 - influence)

    return valueMapper(value)
  })

  return valueCurve
}

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

          const attackSamples = Math.floor(envelope.attack * sampleRate)
          const decaySamples = Math.floor(envelope.decay * sampleRate)

          const attackCurve = getValueCurve({
            duration: attackSamples,
            bias: envelope.attackBias,
            from: Math.max(envelope.initial, minVolume),
            to: Math.max(envelope.peak, minVolume)
          })

          const decayCurve = getValueCurve({
            duration: decaySamples,
            bias: envelope.decayBias,
            from: Math.max(envelope.peak, minVolume),
            to: Math.max(envelope.sustain, minVolume)
          })

          const ADSCurve = Float32Array.from(attackCurve.concat(decayCurve))

          noteVolume.gain.setValueCurveAtTime(ADSCurve, audioCtx.currentTime, (attackSamples + decaySamples) / sampleRate)
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
          if (oscillators[note.index]) {
            const currentVolume = oscillators[note.index].volume.gain.value

            if (currentVolume > minVolume) {
              const releaseSamples = Math.floor(envelope.release * sampleRate)
              const releaseTime = releaseSamples / sampleRate

              const releaseCurve = getValueCurve({
                duration: releaseSamples,
                bias: envelope.decayBias,
                from: Math.max(currentVolume, minVolume),
                to: minVolume
              })

              oscillators[note.index].volume.gain.cancelAndHoldAtTime(0)
              oscillators[note.index].volume.gain.setValueCurveAtTime(releaseCurve, audioCtx.currentTime, releaseTime)

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
        if (myBuffer !== null) {
          notes.map(note => {
            samples[note.index].instance.stop(audioCtx.currentTime + envelope.release)

            samples[note.index].volume.gain.cancelAndHoldAtTime(audioCtx.currentTime)
            // samples[note.index].volume.gain.setValueAtTime(samples[note.index].volume.gain.value, audioCtx.currentTime)
            samples[note.index].volume.gain.exponentialRampToValueAtTime(minVolume, audioCtx.currentTime + envelope.release)
            samples[note.index] = null
          })
        }
        break
    }
  })
}
