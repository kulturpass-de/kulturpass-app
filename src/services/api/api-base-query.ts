import type { BaseQueryFn, FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query'
import axios, { isAxiosError } from 'axios'
import { createHttpErrorFromStatusCode, ErrorWithCode, NetworkError, UnknownError } from '../errors/errors'
import { buildUrl, FetchArgs } from './api'

export type AxiosBaseQueryOptions = {
  baseUrl: string
}

export type AxiosBaseQueryError = ErrorWithCode

export type AxiosQueryFn = BaseQueryFn<FetchArgs, unknown, AxiosBaseQueryError, {}, FetchBaseQueryMeta>

export const axiosBaseQuery = ({ baseUrl }: AxiosBaseQueryOptions): AxiosQueryFn => {
  return async fetchArgs => {
    const fullUrl = fetchArgs.url?.startsWith('http') ? fetchArgs.url : buildUrl(baseUrl, fetchArgs.url ?? '')

    try {
      let result

      if (fetchArgs.method === 'POST') {
        result = await axios.post(fullUrl, fetchArgs.params || fetchArgs.data || {}, { headers: fetchArgs.headers })
      } else {
        result = await axios({ ...fetchArgs, url: fullUrl })
      }

      return { data: result.data }
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status !== undefined) {
        const httpError = createHttpErrorFromStatusCode(error.response.status)
        return {
          error: httpError,
        }
      }

      if (isAxiosError(error)) {
        const networkError = new NetworkError()
        return {
          error: networkError,
        }
      }

      const unknownError = new UnknownError()
      return {
        error: unknownError,
      }
    }
  }
}
