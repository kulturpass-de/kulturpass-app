import axios, { isAxiosError } from 'axios'
import { userAgent } from '../../../utils/user-agent/utils'
import { createHttpErrorFromStatusCode, NetworkError, UnknownError } from '../../errors/errors'
import { logger } from '../../logger'
import { AxiosBaseQueryFn } from './types'

const AXIOS_TIMEOUT = 15000

export const axiosBaseQuery = <Result>(): AxiosBaseQueryFn<Result> => {
  return async args => {
    try {
      logger.logRequest(args.url, args)

      const result = await axios({
        ...args,
        timeout: AXIOS_TIMEOUT,
        headers: {
          ...args.headers,
          'User-Agent': userAgent,
        },
      })

      logger.logResponse(args.url, result.data)

      return { data: result.data }
    } catch (error: any) {
      if (isAxiosError(error) && error.response?.status !== undefined) {
        const httpError = createHttpErrorFromStatusCode(error.response.status, error.response.data)
        logger.logRequestError(args.url, error.response.status, error.response.data)
        return { error: httpError }
      }

      if (isAxiosError(error)) {
        const response = error?.request?._response
        const networkError = new NetworkError(typeof response === 'string' ? response : null)
        logger.logRequestError(args.url, JSON.stringify(networkError))
        return { error: networkError }
      }

      logger.logRequestError(args.url, JSON.stringify(error))

      const unknownError = new UnknownError('API Error')
      return { error: unknownError }
    }
  }
}
