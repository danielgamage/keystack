import generateID from '../generateID'

it('returns non-decimal values', () => {
  expect(generateID()).toEqual(expect.stringMatching(/^[^.]*/))
})
it('returns hyphen with digits on either side', () => {
  expect(generateID()).toEqual(expect.stringMatching(/\d*-\d*/))
})
