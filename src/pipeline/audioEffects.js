import { audioCtx, audioEffectNodes } from "../utils/audio.js";

export const mix = (dry, wet, mix) => {
  dry.gain.value = 1.0 - mix / 100;
  wet.gain.value = mix / 100;
};

export const makeDistortionCurve = amount => {
  let k = typeof amount === "number" ? amount : 50;
  let nSamples = 44100;
  let curve = new Float32Array(nSamples);
  let deg = Math.PI / 180;
  let x;
  for (let i = 0; i < nSamples; ++i) {
    x = i * 2 / nSamples - 1;
    curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
  }
  return curve;
};

export const setProps = {
  Filter: (effect, state) => {
    effect.filter.type = state.type;
    effect.filter.frequency.value = state.frequency;
    effect.filter.Q.value = state.q;
    effect.filter.gain.value = state.gain;
    mix(effect.dry, effect.wet, state.mix);
  },

  Distortion: (effect, state) => {
    effect.distortion.curve = makeDistortionCurve(state.amount);
    effect.distortion.oversample = state.oversample;
    mix(effect.dry, effect.wet, state.mix);
  },

  // StereoPanner: (effect, state) => {
  //   effect.pan.value = state.pan
  // },

  Compressor: (effect, state) => {
    effect.compressor.attack.value = state.attack;
    effect.compressor.knee.value = state.knee;
    effect.compressor.ratio.value = state.ratio;
    effect.compressor.release.value = state.release;
    effect.compressor.threshold.value = state.threshold;
    mix(effect.dry, effect.wet, state.mix);
  },

  Delay: (effect, state) => {
    effect.delay.delayTime.value = state.delay;
    effect.feedback.gain.value = state.feedback / 100;
    mix(effect.dry, effect.wet, state.mix);
  }
};

export const createEffect = {
  Filter: effect => {
    let effectObj = {
      id: effect.id,
      filter: audioCtx.createBiquadFilter(),
      dry: audioCtx.createGain(),
      wet: audioCtx.createGain(),
      entry: audioCtx.createGain(),
      exit: audioCtx.createGain()
    };
    effectObj.entry.connect(effectObj.filter);
    effectObj.filter.connect(effectObj.wet);
    effectObj.wet.connect(effectObj.exit);

    effectObj.entry.connect(effectObj.dry);
    effectObj.dry.connect(effectObj.exit);

    setProps[effect.devicePrototype](effectObj, effect);
    audioEffectNodes.push(effectObj);
  },

  // StereoPanner: (effect) => {
  //   const stereoPanner = audioCtx.createStereoPanner()
  //   setProps[effect.devicePrototype](stereoPanner, effect)
  //   audioEffectNodes[effect.id] = stereoPanner
  // },

  Compressor: effect => {
    const effectObj = {
      id: effect.id,
      compressor: audioCtx.createDynamicsCompressor(),
      dry: audioCtx.createGain(),
      wet: audioCtx.createGain(),
      entry: audioCtx.createGain(),
      exit: audioCtx.createGain()
    };
    effectObj.entry.connect(effectObj.compressor);
    effectObj.compressor.connect(effectObj.wet);
    effectObj.wet.connect(effectObj.exit);

    effectObj.entry.connect(effectObj.dry);
    effectObj.dry.connect(effectObj.exit);

    setProps[effect.devicePrototype](effectObj, effect);
    audioEffectNodes.push(effectObj);
  },

  Delay: effect => {
    let effectObj = {
      id: effect.id,
      delay: audioCtx.createDelay(2.0),
      dry: audioCtx.createGain(),
      wet: audioCtx.createGain(),
      feedback: audioCtx.createGain(),
      entry: audioCtx.createGain(),
      exit: audioCtx.createGain()
    };
    effectObj.entry.connect(effectObj.delay);
    effectObj.delay.connect(effectObj.feedback);
    effectObj.feedback.connect(effectObj.delay);
    effectObj.delay.connect(effectObj.wet);
    effectObj.wet.connect(effectObj.exit);

    effectObj.entry.connect(effectObj.dry);
    effectObj.dry.connect(effectObj.exit);

    setProps[effect.devicePrototype](effectObj, effect);
    audioEffectNodes.push(effectObj);
  },

  Distortion: effect => {
    let effectObj = {
      id: effect.id,
      distortion: audioCtx.createWaveShaper(),
      dry: audioCtx.createGain(),
      wet: audioCtx.createGain(),
      entry: audioCtx.createGain(),
      exit: audioCtx.createGain()
    };
    effectObj.entry.connect(effectObj.distortion);
    effectObj.distortion.connect(effectObj.wet);
    effectObj.wet.connect(effectObj.exit);

    effectObj.entry.connect(effectObj.dry);
    effectObj.dry.connect(effectObj.exit);

    setProps[effect.devicePrototype](effectObj, effect);
    audioEffectNodes.push(effectObj);
  }
};
