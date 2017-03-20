import {
  mapSample,
} from '../compressor.js'

describe(`mapSample`, () => {
  it(`maps input to output with proper reduction`, () => {
    expect(mapSample(-6, -10, 4, 0)).toBe(-9)
  })
})
