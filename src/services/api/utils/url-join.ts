import { trimSlashes } from './trim-slashes'

export const urlJoin = (...urlParts: string[]) => {
  const trimmedUrlParts = urlParts.map(urlPart => trimSlashes(urlPart))
  return trimmedUrlParts.join('/')
}
