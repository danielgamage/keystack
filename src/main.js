import { select, selectAll } from 'd3-selection'
import { axisLeft } from 'd3-axis'
import { scaleLinear } from 'd3-scale'
import { radialLine } from 'd3-shape'
import { range } from 'd3-array'

import { keys } from './utils'
import { stopNote, startNote } from './utils/notes'
import keySteps from './data/keySteps'

import { h, render } from 'preact'
import { Provider } from 'preact-redux'
import { store } from './utils/store'

import App from './components/App.jsx'

import './styles/style.scss'

//
// Redux
//

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.querySelector('#root'))

//
// Keyboard
//

let octave = 3

window.addEventListener('keydown', (event) => {
  if (!document.activeElement.classList.contains('item-title')) {
    if (keySteps.some(keyStep => keyStep.code === event.keyCode)) {
      const steps = keySteps.filter(keyStep => event.keyCode === keyStep.code)[0].step
      const note = keys[steps + 2 + (octave * 12)]
      startNote(note)
    }
  }
})
window.addEventListener('keyup', (event) => {
  if (!document.activeElement.classList.contains('item-title')) {
    if (event.keyCode === 90) { // z
      octave = Math.max(--octave, 0)
    } else if (event.keyCode === 88) { // x
      octave = Math.min(++octave, 5)
    } else if (keySteps.some(keyStep => keyStep.code === event.keyCode)) {
      const steps = keySteps.filter(keyStep => event.keyCode === keyStep.code)[0].step
      const note = keys[steps + 2 + (octave * 12)]
      stopNote(note)
    }
  }
})
