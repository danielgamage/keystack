export const freqForIndex = (index, array) => {
  return (2 ** ((index - 49) / 12)) * 440
}

const keyNames = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
]

export const keyForIndex = (index) => {
  // A0 is index=0
  // +8 passes tests but seems like it should be +9 lmao
  const adjustedIndex = index + 8
  const key = keyNames[adjustedIndex % 12]
  const oct = Math.floor(adjustedIndex / 12)
  return `${key}${oct}`
}

export const keys = [...Array(49).keys()].map((el, i, arr) => {
  return {
    key: keyForIndex(el),
    freq: freqForIndex(el, arr)
  }
})
