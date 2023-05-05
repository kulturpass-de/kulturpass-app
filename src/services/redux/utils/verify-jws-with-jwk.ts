import * as jose from 'node-jose'

export const verifyJwsWithJwk = async (jws: string, publicKey: string) => {
  const pem = `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
  const key = await jose.JWK.asKey(pem, 'pem')
  const res = await jose.JWS.createVerify(key).verify(jws)

  return Buffer.from(res.payload).toString()
}
