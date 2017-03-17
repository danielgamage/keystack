import { select, selectAll } from "d3-selection"
import { axisLeft } from "d3-axis"
import { scaleLinear } from "d3-scale"
import { radialLine } from "d3-shape"
import { range } from "d3-array"

import { keys, noteForIndex } from './utils'
import keySteps from './data/keySteps'
import chords from './data/chords'

import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import { createStore } from 'redux'
import reducer from './reducers'

import App from './components/App.jsx'

import './styles/style.scss'

//
// Redux
//

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

let currentValue
const noteViewer = document.querySelector('.note-viewer')
const chordViewer = document.querySelector('.chord-viewer')


render((
	<Provider store={store}>
		<App />
	</Provider>
), document.querySelector('#root'))

const body = document.body

//
// Keyboard
//

let octave = 3

window.addEventListener("keydown", (event) => {
  if (keySteps.some(el => el.key === event.key)) {
    const steps = keySteps.filter(key => event.key === key.key)[0].step
    const note = keys[steps + 2 + (octave * 12)]
    startNote(note)
  }
})
window.addEventListener("keyup", (event) => {
  if (event.key === "z") {
    octave = Math.max(--octave, 0)
  } else if (event.key === "x") {
    octave = Math.min(++octave, 5)
  } else if (keySteps.some(el => el.key === event.key)) {
    const steps = keySteps.filter(key => event.key === key.key)[0].step
    const note = keys[steps + 2 + (octave * 12)]
    stopNote(note)
  }
})

//
// Audio
//

var audioCtx = new AudioContext(),
    masterVolume = audioCtx.createGain()

masterVolume.gain.value = 0.2
masterVolume.connect(audioCtx.destination)

var oscillators = {}
const minVolume = 0.00001

const stopNote = (note) => {
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
const startNote = (note) => {
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

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({
        sysex: false // this defaults to 'false' and we won't be covering sysex in this article.
    }).then(onMIDISuccess, onMIDIFailure)
} else {
    console.log("No MIDI support in your browser.")
}

const getNoteIndexForMIDI = (code) => {
  return code - 21
}

//
// MIDI
//

function onMIDIMessage(event) {
    var data = event.data,
        cmd = data[0] >> 4,
        channel = data[0] & 0xf,
        type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
        note = data[1],
        velocity = data[2]
    // with pressure and tilt off
    // note off: 128, cmd: 8
    // note on: 144, cmd: 9
    // pressure / tilt on
    // pressure: 176, cmd 11:
    // bend: 224, cmd: 14

    var note = getNoteIndexForMIDI(note)

    switch (type) {
        case 144: // noteOn message
            startNote(keys[note])
            break
        case 128: // noteOff message
            stopNote(keys[note])

            break
    }
}

function onMIDISuccess(midiAccess) {
    // when we get a succesful response, run this code
    console.log('MIDI Access Object', midiAccess)
    const inputs = midiAccess.inputs.values()
    for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
        // listen for midi messages
        store.dispatch({
          type: 'ADD_MIDI',
          value: {
            id: input.value.id,
            manufacturer: input.value.manufacturer,
            name: input.value.name,
            type: input.value.type
          }
        })
        input.value.onmidimessage = onMIDIMessage
    }
    // listen for connect/disconnect message
    // midiAccess.onstatechange = onStateChange
}

function onMIDIFailure(e) {
    // when we get a failed response, run this code
    console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + e)
}
