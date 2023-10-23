import { z } from 'zod'
import { logger } from '../../services/logger'

export const isHeaderShown = (url: string) => {
  const path: undefined | string = url.split('?')?.[0]
  return path === '/' || path?.startsWith('/homepage')
}

export const isRoutedToLogin = (url: string) => {
  return url.startsWith('/login')
}

export const decodeBase64Url = (value: string) => {
  // https://en.wikipedia.org/wiki/Base64#URL_applications
  const remainder = value.length % 4
  const padding = remainder !== 0 ? 4 - remainder : 0
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(padding)
  return Buffer.from(base64, 'base64').toString()
}

const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const LocationQueryParamSchema = z.string().transform((base64UrlEncoded, ctx) => {
  const value = decodeBase64Url(base64UrlEncoded)
  try {
    const jsonValue = JSON.parse(value)

    const locationValue = LocationSchema.safeParse(jsonValue)

    if (locationValue.success) {
      return locationValue.data
    } else {
      locationValue.error.issues.forEach(issue => ctx.addIssue(issue))
      return z.NEVER
    }
  } catch {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Not a JSON string',
    })
    return z.NEVER
  }
})

export type LocationQueryParam = z.infer<typeof LocationQueryParamSchema>

export const parseBaseUrl64Location = (locationString: string) => {
  const result = LocationQueryParamSchema.safeParse(locationString)
  if (result.success) {
    return result.data
  } else {
    logger.logError('Location Query parse failed', result.error.toString())
    return null
  }
}
