import type { AxiosRequestConfig } from 'axios'

export type FetchArgs = AxiosRequestConfig

export type ExtraOptions = {
  skipAuth?: boolean
  sign?: boolean // sign, if given
}

const ensureTailingSlash = (s: string) => (s.slice(-1) === '/' ? s : s + '/')
const removeLeadingSlash = (s: string) => s.replace(/^\/+/, '')

export const buildUrl = (baseUrl: string, path: string) => ensureTailingSlash(baseUrl) + removeLeadingSlash(path)
