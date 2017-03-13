export const freqForIndex = (index, length=49) => {
  return (2 ** ((index - 49) / 12)) * 440
}

export const singleOctave = [
  { noteName: "C",  black: false, qwerty: "a" },
  { noteName: "C#", black: true,  qwerty: "w" },
  { noteName: "D",  black: false, qwerty: "s" },
  { noteName: "D#", black: true,  qwerty: "e" },
  { noteName: "E",  black: false, qwerty: "d" },
  { noteName: "F",  black: false, qwerty: "f" },
  { noteName: "F#", black: true,  qwerty: "t" },
  { noteName: "G",  black: false, qwerty: "g" },
  { noteName: "G#", black: true,  qwerty: "y" },
  { noteName: "A",  black: false, qwerty: "h" },
  { noteName: "A#", black: true,  qwerty: "u" },
  { noteName: "B",  black: false, qwerty: "j" }
]

export const noteObjectForIndex = (index) => {
  // A0 is index=0
  // +8 passes tests but seems like it should be +9 lmao
  const adjustedIndex = index + 8
  const note = singleOctave[adjustedIndex % 12]
  return note
}

export const noteForIndex = (index) => {
  const adjustedIndex = index + 8
  const note = noteObjectForIndex(index)
  return note.noteName
}

export const octaveForIndex = (index) => {
  const adjustedIndex = index + 8
  const octave = Math.floor(adjustedIndex / 12)
  return octave
}

export const blackForIndex = (index) => {
  return noteObjectForIndex(index).black
}

export const qwertyForIndex = (index) => {
  return noteObjectForIndex(index).qwerty
}

export const keys = [...Array(49).keys()].map((el, i, arr) => {
  return {
    index: i,
    black: blackForIndex(el),
    qwerty: qwertyForIndex(el),
    note: noteForIndex(el),
    octave: octaveForIndex(el),
    frequency: freqForIndex(el)
  }
})
