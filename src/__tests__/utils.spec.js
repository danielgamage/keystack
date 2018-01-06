import {
  freqForIndex,
  noteForIndex,
  octaveForIndex,
  blackForIndex
} from "../utils.js";

describe(`freqForIndex`, () => {
  it(`fetches correct frequency`, () => {
    expect(freqForIndex(0)).toBe(27.5); // A0
    expect(freqForIndex(12)).toBe(55.0); // A1
    expect(freqForIndex(24)).toBe(110.0); // A2
    expect(freqForIndex(60)).toBe(880.0); // A5

    expect(freqForIndex(7)).toBeCloseTo(41.2034); // E1
    expect(freqForIndex(39)).toBeCloseTo(261.626); // C4
    expect(freqForIndex(62)).toBeCloseTo(987.767); // B5
    expect(freqForIndex(87)).toBeCloseTo(4186.01); // C8
  });
});

describe(`noteForIndex`, () => {
  it(`fetches correct note`, () => {
    expect(noteForIndex(0)).toBe(`A`);
    expect(noteForIndex(12)).toBe(`A`);
    expect(noteForIndex(24)).toBe(`A`);
    expect(noteForIndex(60)).toBe(`A`);

    expect(noteForIndex(2)).toBe(`B`);
    expect(noteForIndex(3)).toBe(`C`);
    expect(noteForIndex(4)).toBe(`C#`);
    expect(noteForIndex(7)).toBe(`E`);
    expect(noteForIndex(39)).toBe(`C`);
    expect(noteForIndex(62)).toBe(`B`);
  });
});
describe(`octaveForIndex`, () => {
  it(`fetches correct octave`, () => {
    expect(octaveForIndex(0)).toBe(0);
    expect(octaveForIndex(12)).toBe(1);
    expect(octaveForIndex(24)).toBe(2);
    expect(octaveForIndex(60)).toBe(5);

    expect(octaveForIndex(2)).toBe(0);
    expect(octaveForIndex(3)).toBe(1);
    expect(octaveForIndex(4)).toBe(1);
    expect(octaveForIndex(7)).toBe(1);
    expect(octaveForIndex(39)).toBe(4);
    expect(octaveForIndex(62)).toBe(5);
  });
});
describe(`blackForIndex`, () => {
  it(`analyzes color properly`, () => {
    expect(blackForIndex(63)).toBe(false); // C
    expect(blackForIndex(64)).toBe(true); // C#
    expect(blackForIndex(65)).toBe(false); // D
    expect(blackForIndex(66)).toBe(true); // D#
    expect(blackForIndex(67)).toBe(false); // E
    expect(blackForIndex(68)).toBe(false); // F
    expect(blackForIndex(69)).toBe(true); // F#
    expect(blackForIndex(70)).toBe(false); // G
    expect(blackForIndex(71)).toBe(true); // G#
    expect(blackForIndex(72)).toBe(false); // A
    expect(blackForIndex(73)).toBe(true); // A#
    expect(blackForIndex(74)).toBe(false); // B

    expect(blackForIndex(75)).toBe(false); // C
    expect(blackForIndex(76)).toBe(true); // C#
    expect(blackForIndex(77)).toBe(false); // D
    expect(blackForIndex(78)).toBe(true); // D#
    expect(blackForIndex(79)).toBe(false); // E
    expect(blackForIndex(80)).toBe(false); // F
    expect(blackForIndex(81)).toBe(true); // F#
    expect(blackForIndex(82)).toBe(false); // G
    expect(blackForIndex(83)).toBe(true); // G#
    expect(blackForIndex(84)).toBe(false); // A
    expect(blackForIndex(85)).toBe(true); // A#
    expect(blackForIndex(86)).toBe(false); // B
  });
});
