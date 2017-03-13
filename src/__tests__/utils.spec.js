import {freqForIndex, noteForIndex} from '../utils.js'

describe(`freqForIndex`, () => {
  it(`fetches correct frequency`, () => {
    expect(freqForIndex(1)).toBe(27.5000) // A0
    expect(freqForIndex(13)).toBe(55.0000) // A1
    expect(freqForIndex(25)).toBe(110.0000) // A2
    expect(freqForIndex(61)).toBe(880.0000) // A5

    expect(freqForIndex(8)).toBeCloseTo(41.2034) // E1
    expect(freqForIndex(40)).toBeCloseTo(261.626) // C4
    expect(freqForIndex(63)).toBeCloseTo(987.767) // B5
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
