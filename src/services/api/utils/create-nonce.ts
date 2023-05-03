import crypto from 'crypto'

export const createNonce = () => {
  return crypto.randomBytes(16).toString('hex')
}
