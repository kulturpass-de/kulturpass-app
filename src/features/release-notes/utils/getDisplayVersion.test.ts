import { getDisplayVersion } from './getDisplayVersion'

test.each([
  ['1.4.12', '1.4'],
  ['1.0.0', '1.0'],
])('getDisplayVersion should return (%d)', (input, expected) => {
  expect(getDisplayVersion(input)).toEqual(expected)
})
