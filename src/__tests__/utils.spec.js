import {freqForIndex, keyForIndex} from '../utils.js'

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

describe(`keyForIndex`, () => {
  it(`fetches correct key`, () => {
    expect(keyForIndex(1)).toBe(`A0`)
    expect(keyForIndex(13)).toBe(`A1`)
    expect(keyForIndex(25)).toBe(`A2`)
    expect(keyForIndex(61)).toBe(`A5`)

    expect(keyForIndex(3)).toBe(`B0`)
    expect(keyForIndex(4)).toBe(`C1`)
    expect(keyForIndex(5)).toBe(`C#1`)
    expect(keyForIndex(8)).toBe(`E1`)
    expect(keyForIndex(40)).toBe(`C4`)
    expect(keyForIndex(63)).toBe(`B5`)
  })
})
