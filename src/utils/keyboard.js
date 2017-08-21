//
// Keyboard
//

let octave = 3

const onKeyDown = (event) => {
  if (keySteps.some(keyStep => keyStep.code === event.keyCode)) {
    const steps = keySteps.filter(keyStep => event.keyCode === keyStep.code)[0].step
    const note = keys[steps + 2 + (octave * 12)]
    startNote(note)
  }
}

const onKeyUp = (event) => {
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

export const bindKeyboardEvents = () => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
}
export const unbindKeyboardEvents = () => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
}
