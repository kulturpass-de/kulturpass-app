import { createNonce } from './create-nonce'

describe('createNonce', () => {
  test('should return a 16 byte alpha-numeric', () => {
    const nonce = createNonce()
    const alphaNumeric = nonce.replace(/[^a-z0-9]+/, '')
    const number = Number('0x' + alphaNumeric)

    expect(alphaNumeric).toHaveProperty('length', 32)
    expect(number).not.toBe(NaN)
  })
})
