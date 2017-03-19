import { store } from './store'

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
const minVolume = 0.00001

export const shiftFrequencyByStep = (frequency, step) => {
  return frequency * (2 ** (step / 12))
}

export const stopNote = (note) => {
  store.dispatch({
    type: 'REMOVE_NOTE',
    note: note
  })
  const state = store.getState()
  state.instruments.map(instrument => {
    if (instrument.type === "KeySynth") {
      const envelope = instrument.envelope
      oscillators[note.frequency].oscillators.forEach((oscillator) => {
        oscillator.stop(audioCtx.currentTime + envelope.release)
      })

      oscillators[note.frequency].volume.gain.cancelScheduledValues(audioCtx.currentTime)
      oscillators[note.frequency].volume.gain.setValueAtTime(oscillators[note.frequency].volume.gain.value, audioCtx.currentTime)
      oscillators[note.frequency].volume.gain.exponentialRampToValueAtTime(minVolume, audioCtx.currentTime + envelope.release)
      oscillators[note.frequency] = null
    }
  })
}

export const startNote = (note) => {
  // prevent sticky keys
  if (!oscillators[note.frequency]) {
    const state = store.getState()
    store.dispatch({
      type: 'ADD_NOTE',
      note: note
    })

    state.instruments.map(instrument => {
      if (instrument.type === "KeySynth") {
        const envelope = instrument.envelope

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

        oscillators[note.frequency] = {
          oscillators: initializedOscillators,
          volume: noteVolume
        }

        noteVolume.gain.linearRampToValueAtTime(Math.max(envelope.peak, minVolume), audioCtx.currentTime + envelope.attack)
        noteVolume.gain.exponentialRampToValueAtTime(Math.max(envelope.sustain, minVolume), audioCtx.currentTime + envelope.attack + envelope.decay)
      }
    })
  }
}
