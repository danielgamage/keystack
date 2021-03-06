import { audioCtx, audioEffectNodes } from "../utils/audio.js"

export const mix = (dry, wet, mix) => {
  dry.gain.value = 1.0 - mix / 100
  wet.gain.value = mix / 100
}

export const makeWaveshaperCurve = (
  amount = 50,
  { method = "distortion", samples = 128 } = {}
) => {
  let curve = new Float32Array(samples)
  let deg = Math.PI / 180
  let x
  console.log("making")

  switch (method) {
    case "chebyshev":
      /** @todo
       *  Chebyshev calculation is pretty slow
       *  at higher levels of recursion
       *
       *  Maybe we can generate these upfront and cache them
       *  */
      const polynomial = function (n, x) {
        if (n === 0) return 1
        if (n === 1) return x
        var k = n - 1
        return 2 * x * polynomial(k, x) - polynomial(k - 1, x)
      }
      const boop = Math.ceil((amount / 300) * 8 + 1)
      for (let i = 0; i < samples; ++i) {
        x = (i * 2) / samples - 1
        curve[i] = polynomial(boop, x)
      }
      break
    case "sine":
      for (let i = 0; i < samples; ++i) {
        x = (i * 2) / samples - 1
        curve[i] = Math.sin(x * Math.max(1, amount))
      }
      break
    case "depth":
      const base = 300 / (amount + 1)
      for (let i = 0; i < samples; ++i) {
        x = (i * 2) / samples - 1
        curve[i] = Math.round(x * base) / base
      }
      break
    case "distortion":
    default:
      for (let i = 0; i < samples; ++i) {
        x = (i * 2) / samples - 1
        curve[i] =
          ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
      }
      break
  }
  return curve
}

export const setProps = {
  Filter: (effect, state) => {
    effect.filter.type = state.type
    effect.filter.frequency.value = state.frequency
    effect.filter.Q.value = state.q
    effect.filter.gain.value = state.gain
    mix(effect.dry, effect.wet, state.mix)
  },

  Waveshaper: (effect, state) => {
    effect.waveshaper.curve = makeWaveshaperCurve(state.amount, {
      method: state.method,
    })
    effect.waveshaper.oversample = state.oversample
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
  },
}

export const createEffect = {
  Filter: (effect) => {
    let effectObj = {
      id: effect.id,
      filter: audioCtx.createBiquadFilter(),
      dry: audioCtx.createGain(),
      wet: audioCtx.createGain(),
      entry: audioCtx.createGain(),
      exit: audioCtx.createGain(),
    }
    effectObj.entry.connect(effectObj.filter)
    effectObj.filter.connect(effectObj.wet)
    effectObj.wet.connect(effectObj.exit)

    effectObj.entry.connect(effectObj.dry)
    effectObj.dry.connect(effectObj.exit)

    setProps[effect.devicePrototype](effectObj, effect)
    audioEffectNodes.push(effectObj)
  },

  // StereoPanner: (effect) => {
  //   const stereoPanner = audioCtx.createStereoPanner()
  //   setProps[effect.devicePrototype](stereoPanner, effect)
  //   audioEffectNodes[effect.id] = stereoPanner
  // },

  Compressor: (effect) => {
    const effectObj = {
      id: effect.id,
      compressor: audioCtx.createDynamicsCompressor(),
      dry: audioCtx.createGain(),
      wet: audioCtx.createGain(),
      entry: audioCtx.createGain(),
      exit: audioCtx.createGain(),
    }
    effectObj.entry.connect(effectObj.compressor)
    effectObj.compressor.connect(effectObj.wet)
    effectObj.wet.connect(effectObj.exit)

    effectObj.entry.connect(effectObj.dry)
    effectObj.dry.connect(effectObj.exit)

    setProps[effect.devicePrototype](effectObj, effect)
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
      exit: audioCtx.createGain(),
    }
    effectObj.entry.connect(effectObj.delay)
    effectObj.delay.connect(effectObj.feedback)
    effectObj.feedback.connect(effectObj.delay)
    effectObj.delay.connect(effectObj.wet)
    effectObj.wet.connect(effectObj.exit)

    effectObj.entry.connect(effectObj.dry)
    effectObj.dry.connect(effectObj.exit)

    setProps[effect.devicePrototype](effectObj, effect)
    audioEffectNodes.push(effectObj)
  },

  Waveshaper: (effect) => {
    console.log("waveshaper")
    let effectObj = {
      id: effect.id,
      waveshaper: audioCtx.createWaveShaper(),
      dry: audioCtx.createGain(),
      wet: audioCtx.createGain(),
      entry: audioCtx.createGain(),
      exit: audioCtx.createGain(),
    }
    effectObj.entry.connect(effectObj.waveshaper)
    effectObj.waveshaper.connect(effectObj.wet)
    effectObj.wet.connect(effectObj.exit)

    effectObj.entry.connect(effectObj.dry)
    effectObj.dry.connect(effectObj.exit)

    setProps[effect.devicePrototype](effectObj, effect)
    audioEffectNodes.push(effectObj)
  },
}
