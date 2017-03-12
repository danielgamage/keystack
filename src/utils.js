export const freqForIndex = (index, array) => {
  return (2 ** ((index - 49) / 12)) * 440
}

const keyNames = [
  "c", "c#", "d", "d#", "e", "f", "f#", "g", "g#", "a", "a#", "b"
]

export const keyForIndex = (index) => {
  const key = keyNames[index % 12]
  const oct = Math.floor(index / 12)
  return `${key}${oct}`
}

export const keys = [...Array(49).keys()].map((el, i, arr) => {
  return {
    key: keyForIndex(el),
    freq: freqForIndex(el, arr)
  }
})
