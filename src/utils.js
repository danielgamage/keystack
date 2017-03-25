export const freqForIndex = (index) => {
  // shift index up 1:
  // A0 is at position 1 in the formula, but position 0 in our data
  index += 1
  return (2 ** ((index - 49) / 12)) * 440
}

export const singleOctave = [
  { noteName: 'C', black: false },
  { noteName: 'C#', black: true },
  { noteName: 'D', black: false },
  { noteName: 'D#', black: true },
  { noteName: 'E', black: false },
  { noteName: 'F', black: false },
  { noteName: 'F#', black: true },
  { noteName: 'G', black: false },
  { noteName: 'G#', black: true },
  { noteName: 'A', black: false },
  { noteName: 'A#', black: true },
  { noteName: 'B', black: false }
]

export const getNoteIndexForMIDI = (code) => {
  return code - 21
}

export const noteObjectForIndex = (index) => {
  // A0 is index=0
  const adjustedIndex = index + 9
  const note = singleOctave[adjustedIndex % 12]
  return note
}

export const noteForIndex = (index) => {
  const note = noteObjectForIndex(index)
  return note.noteName
}

export const octaveForIndex = (index) => {
  const adjustedIndex = index + 9
  const octave = Math.floor(adjustedIndex / 12)
  return octave
}

export const blackForIndex = (index) => {
  return noteObjectForIndex(index).black
}

export const keys = [...Array(88).keys()].map((el, i, arr) => {
  return {
    index: i,
    black: blackForIndex(el),
    note: noteForIndex(el),
    octave: octaveForIndex(el),
    frequency: freqForIndex(el)
  }
})
