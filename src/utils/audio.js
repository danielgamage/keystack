import { store } from './store'

var audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
    masterVolume = audioCtx.createGain()

masterVolume.gain.value = 0.2
masterVolume.connect(audioCtx.destination)

var oscillators = {}
const minVolume = 0.00001

export const stopNote = (note) => {
  store.dispatch({
    type: 'REMOVE_NOTE',
    note: note
  })
  const envelope = store.getState().synth.envelope
  oscillators[note.frequency].oscillators.forEach((oscillator) => {
    oscillator.stop(audioCtx.currentTime + envelope.release)
  })
  document.querySelector(`.spiral-${note.index}`)
    .classList.remove('on')
  oscillators[note.frequency].volume.gain.cancelScheduledValues(audioCtx.currentTime)
  oscillators[note.frequency].volume.gain.setValueAtTime(oscillators[note.frequency].volume.gain.value, audioCtx.currentTime)
  oscillators[note.frequency].volume.gain.exponentialRampToValueAtTime(minVolume, audioCtx.currentTime + envelope.release)
  oscillators[note.frequency] = null

}

export const startNote = (note) => {
  // prevent sticky keys
  if (!oscillators[note.frequency]) {
    const state = store.getState()
    store.dispatch({
      type: 'ADD_NOTE',
      note: note
    })

    document.querySelector(`.spiral-${note.index}`)
      .classList.add('on')

    const envelope = state.synth.envelope

    var noteVolume = audioCtx.createGain()
    noteVolume.gain.value = envelope.initial
    noteVolume.connect(audioCtx.destination)

    const initializedOscillators = state.synth.oscillators.map(el => {
      const osc = audioCtx.createOscillator()
      osc.frequency.value = note.frequency * (2 ** el.octave)
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
}
