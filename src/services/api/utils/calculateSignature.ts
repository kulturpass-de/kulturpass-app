import crypto from 'crypto'
import { Buffer } from 'buffer'

// see https://github.com/SAP/gigya-android-sdk/blob/187f057c9e78ed857e83ee216202582ab3b0b83c/sdk-core/src/main/java/com/gigya/android/sdk/utils/UrlUtils.java#L40
const urlEncode = (str: string): string => {
  return encodeURIComponent(str).replace(/\+/, '%20').replace(/\*/, '%2A').replace(/%7E/, '~') //.replace(/!/, '%25')
}

// see https://github.com/SAP/gigya-android-sdk/blob/187f057c9e78ed857e83ee216202582ab3b0b83c/sdk-core/src/main/java/com/gigya/android/sdk/utils/UrlUtils.java#L20
const buildEncodedQuery = (parameters: Record<string, unknown>): string => {
  return Object.keys(parameters)
    .sort()
    .map(key => `${key}=${urlEncode(parameters[key] as string).toString()}`)
    .join('&')
}

export const calculateSignature = (
  secret: string,
  method: string,
  url: string,
  parameters: Record<string, unknown>,
): string => {
  const baseSignature = [method.toUpperCase(), urlEncode(url), urlEncode(buildEncodedQuery(parameters))].join('&')

  const keyBytes = Buffer.from(secret, 'base64')
  const textData = Buffer.from(baseSignature, 'utf-8')
  const signature = crypto.createHmac('sha1', keyBytes).update(textData).digest('base64')
  return signature
}
