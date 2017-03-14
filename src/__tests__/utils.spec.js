import {
  freqForIndex,
  noteForIndex,
  octaveForIndex,
  blackForIndex
} from '../utils.js'

describe(`freqForIndex`, () => {
  it(`fetches correct frequency`, () => {
    expect(freqForIndex(1)).toBe(27.5000) // A0
    expect(freqForIndex(13)).toBe(55.0000) // A1
    expect(freqForIndex(25)).toBe(110.0000) // A2
    expect(freqForIndex(61)).toBe(880.0000) // A5

    expect(freqForIndex(8)).toBeCloseTo(41.2034) // E1
    expect(freqForIndex(40)).toBeCloseTo(261.626) // C4
    expect(freqForIndex(63)).toBeCloseTo(987.767) // B5
    expect(freqForIndex(88)).toBeCloseTo(4186.01) // C8
  })
})

describe(`noteForIndex`, () => {
  it(`fetches correct note`, () => {
    expect(noteForIndex(1)).toBe(`A`)
    expect(noteForIndex(13)).toBe(`A`)
    expect(noteForIndex(25)).toBe(`A`)
    expect(noteForIndex(61)).toBe(`A`)

    expect(noteForIndex(3)).toBe(`B`)
    expect(noteForIndex(4)).toBe(`C`)
    expect(noteForIndex(5)).toBe(`C#`)
    expect(noteForIndex(8)).toBe(`E`)
    expect(noteForIndex(40)).toBe(`C`)
    expect(noteForIndex(63)).toBe(`B`)
  })
})
describe(`octaveForIndex`, () => {
  it(`fetches correct octave`, () => {
    expect(octaveForIndex(1)).toBe(0)
    expect(octaveForIndex(13)).toBe(1)
    expect(octaveForIndex(25)).toBe(2)
    expect(octaveForIndex(61)).toBe(5)

    expect(octaveForIndex(3)).toBe(0)
    expect(octaveForIndex(4)).toBe(1)
    expect(octaveForIndex(5)).toBe(1)
    expect(octaveForIndex(8)).toBe(1)
    expect(octaveForIndex(40)).toBe(4)
    expect(octaveForIndex(63)).toBe(5)
  })
})
describe(`blackForIndex`, () => {
  it(`analyzes color properly`, () => {
    expect(blackForIndex(64)).toBe(false) // C
    expect(blackForIndex(65)).toBe(true) // C#
    expect(blackForIndex(66)).toBe(false) // D
    expect(blackForIndex(67)).toBe(true) // D#
    expect(blackForIndex(68)).toBe(false) // E
    expect(blackForIndex(69)).toBe(false) // F
    expect(blackForIndex(70)).toBe(true) // F#
    expect(blackForIndex(71)).toBe(false) // G
    expect(blackForIndex(72)).toBe(true) // G#
    expect(blackForIndex(73)).toBe(false) // A
    expect(blackForIndex(74)).toBe(true) // A#
    expect(blackForIndex(75)).toBe(false) // B

    expect(blackForIndex(76)).toBe(false) // C
    expect(blackForIndex(77)).toBe(true) // C#
    expect(blackForIndex(78)).toBe(false) // D
    expect(blackForIndex(79)).toBe(true) // D#
    expect(blackForIndex(80)).toBe(false) // E
    expect(blackForIndex(81)).toBe(false) // F
    expect(blackForIndex(82)).toBe(true) // F#
    expect(blackForIndex(83)).toBe(false) // G
    expect(blackForIndex(84)).toBe(true) // G#
    expect(blackForIndex(85)).toBe(false) // A
    expect(blackForIndex(86)).toBe(true) // A#
    expect(blackForIndex(87)).toBe(false) // B
  })
})
