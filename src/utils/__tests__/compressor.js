import {
  compressSample
} from '../compressor.js'

describe(`compressSample`, () => {
  it(`maps input to correct output with hard knee`, () => {
    // (input, threshold, ratio, knee)

    expect(compressSample(-6, -10, 4, 0)).toBe(-9)
    expect(compressSample(0.8, 0.8, 10, 0)).toBe(0.8)
    expect(compressSample(1, 0.5, 2, 0)).toBe(0.75)
  })
})
