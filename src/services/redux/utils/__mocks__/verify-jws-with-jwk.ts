export const verifyJwsWithJwk = async (jws: string, publicKey: string) => {
  return `payload decoded from ${jws} and ${publicKey}`
}
