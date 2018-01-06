import transposeSample from "../transposeSample";

it("maps to correct playbackRate", () => {
  expect(transposeSample(15)).toEqual(0.5); // C2
  expect(transposeSample(27)).toEqual(1); // C3
  expect(transposeSample(39)).toEqual(2); // C4
  expect(transposeSample(51)).toEqual(4); // C5
});
