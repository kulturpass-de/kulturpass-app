import { Buffer } from 'buffer'
import crypto from 'crypto'
import strictUriEncode from 'strict-uri-encode'

const buildEncodedQuery = (parameters: Record<string, string>): string => {
  return Object.keys(parameters)
    .sort()
    .map(key => `${key}=${strictUriEncode(parameters[key])}`)
    .join('&')
}

export const calculateSignature = (
  secret: string,
  method: string,
  url: string,
  parameters: Record<string, string>,
): string => {
  const baseSignature = [
    method.toUpperCase(),
    strictUriEncode(url),
    strictUriEncode(buildEncodedQuery(parameters)),
  ].join('&')

  const keyBytes = Buffer.from(secret, 'base64')
  const textData = Buffer.from(baseSignature, 'utf-8')
  const signature = crypto.createHmac('sha1', keyBytes).update(textData).digest('base64')
  return signature
}
