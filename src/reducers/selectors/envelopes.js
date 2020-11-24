import { createSelector } from "reselect"
import { sampleRate, minWebAudioVolume } from "constants.js"
import { scaleLinear } from "d3-scale"

const easeInQuad = (t) => t * t
const easeOutQuad = (t) => t * (2 - t)
const easeInCubic = (t) => t * t * t
const easeOutCubic = (t) => --t * t * t + 1
const easeInQuart = (t) => t * t * t * t
const easeOutQuart = (t) => 1 - --t * t * t * t

const getValueCurve = ({
  duration, // in samples
  bias, // -1 to +1
  from,
  to,
}) => {
  var curve = new Array(duration).fill()

  const influence = Math.abs(bias)

  const valueMapper = scaleLinear()
    .domain([0, 1])
    .range([Math.max(minWebAudioVolume, from), Math.max(minWebAudioVolume, to)])

  const valueCurve = curve.map((el, i) => {
    const step = i / duration
    const value =
      bias < 0
        ? easeOutQuart(step) * influence + step * (1 - influence)
        : easeInQuart(step) * influence + step * (1 - influence)

    return valueMapper(value)
  })

  return valueCurve
}

const getDevices = (state) => state

export const getEnvelopeCurves = createSelector([getDevices], (devices) => {
  return Object.keys(devices)
    .map((deviceKey) => devices[deviceKey])
    .filter((device) => device.envelope !== undefined)
    .map((device) => {
      // attack, decay

      const attackSamples = Math.floor(device.envelope.attack * sampleRate)
      const decaySamples = Math.floor(device.envelope.decay * sampleRate)
      const attackCurve = getValueCurve({
        duration: attackSamples,
        bias: device.envelope.attackBias,
        from: Math.max(device.envelope.initial, minWebAudioVolume),
        to: Math.max(device.envelope.peak, minWebAudioVolume),
      })

      const decayCurve = getValueCurve({
        duration: decaySamples,
        bias: device.envelope.decayBias,
        from: Math.max(device.envelope.peak, minWebAudioVolume),
        to: Math.max(device.envelope.sustain, minWebAudioVolume),
      })

      const ADCurve = Float32Array.from(attackCurve.concat(decayCurve))

      // release

      const releaseSamples = Math.floor(device.envelope.release * sampleRate)
      const releaseTime = releaseSamples / sampleRate

      const releaseCurve = getValueCurve({
        duration: releaseSamples,
        bias: device.envelope.decayBias,
        from: 1,
        to: minWebAudioVolume,
      })

      return {
        ...device,
        envelopeCurves: {
          AD: ADCurve,
          R: releaseCurve,
        },
      }
    })
})
