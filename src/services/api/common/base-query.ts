import axios, { isAxiosError } from 'axios'

import { createHttpErrorFromStatusCode, NetworkError, UnknownError } from '../../errors/errors'
import { AxiosBaseQueryFn } from './types'

const AXIOS_TIMEOUT = 15000

export const axiosBaseQuery = <Result>(): AxiosBaseQueryFn<Result> => {
  return async args => {
    try {
      const result = await axios({ ...args, timeout: AXIOS_TIMEOUT })

      return { data: result.data }
    } catch (error: any) {
      if (isAxiosError(error) && error.response?.status !== undefined) {
        const httpError = createHttpErrorFromStatusCode(error.response.status, error.response.data)
        return { error: httpError }
      }

      if (isAxiosError(error)) {
        const networkError = new NetworkError()
        return { error: networkError }
      }

      const unknownError = new UnknownError()
      return { error: unknownError }
    }
  }
}
