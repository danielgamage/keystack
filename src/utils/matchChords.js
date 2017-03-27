import removeDuplicates from './removeDuplicates'
import chords from '../data/chords'

const matchChords = (notes) => {
  let matches = []

  notes.map((loopEl, loopIndex, arr) => {
    const integerList = arr.map((note) => {
      return (note.index - arr[loopIndex].index + 96) % 12
    })
    const dedupedList = [...new Set(integerList)]
    chords.filter(el => (
      el.set.length === dedupedList.length &&
      el.set.every((e) => dedupedList.indexOf(e) !== -1)
    )).map(chord => {
      matches.push({
        chord: `${arr[loopIndex].note} ${chord.name}`,
        name: chord.name,
        root: arr[loopIndex].note,
        quality: chord.quality
      })
    })
  })

  // dedupe results
  matches = removeDuplicates(matches, 'chord')
  return matches
}

export default matchChords
