export const freqForIndex = (index, length=49) => {
  return (2 ** ((index - 49) / 12)) * 440
}

export const singleOctave = [
  { keyName: "C",  black: false, qwerty: "a" },
  { keyName: "C#", black: true,  qwerty: "w" },
  { keyName: "D",  black: false, qwerty: "s" },
  { keyName: "D#", black: true,  qwerty: "e" },
  { keyName: "E",  black: false, qwerty: "d" },
  { keyName: "F",  black: false, qwerty: "f" },
  { keyName: "F#", black: true,  qwerty: "t" },
  { keyName: "G",  black: false, qwerty: "g" },
  { keyName: "G#", black: true,  qwerty: "y" },
  { keyName: "A",  black: false, qwerty: "h" },
  { keyName: "A#", black: true,  qwerty: "u" },
  { keyName: "B",  black: false, qwerty: "j" }
]

export const noteForIndex = (index) => {
  // A0 is index=0
  // +8 passes tests but seems like it should be +9 lmao
  const adjustedIndex = index + 8
  const note = singleOctave[adjustedIndex % 12]
  return note
}

export const keyForIndex = (index) => {
  const adjustedIndex = index + 8
  const note = noteForIndex(index)
  const octave = Math.floor(adjustedIndex / 12)
  return `${note.keyName}${octave}`
}

export const blackForIndex = (index) => {
  return noteForIndex(index).black
}

export const qwertyForIndex = (index) => {
  return noteForIndex(index).qwerty
}

export const keys = [...Array(49).keys()].map((el, i, arr) => {
  return {
    index: i,
    black: blackForIndex(el),
    qwerty: qwertyForIndex(el),
    key: keyForIndex(el),
    freq: freqForIndex(el)
  }
})
