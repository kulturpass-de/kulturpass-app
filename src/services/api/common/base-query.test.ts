import { BaseQueryApi as RtkBaseQueryApi } from '@reduxjs/toolkit/query/react'
import axios from 'axios'
import { userAgent } from '../../../utils/user-agent/utils'
import { HttpError, NetworkError, UnknownError } from '../../errors/errors'
import { axiosBaseQuery } from './base-query'

jest.mock('axios', () => ({
  ...jest.requireActual('axios'),
  __esModule: true,
  default: jest.fn(() => Promise.resolve({ data: 'my_data' })),
}))

describe('base-query', () => {
  it('should return a function that will execute axios with given args', async () => {
    const args = {
      url: 'http://my_url',
      params: { my: 'params' },
      data: { my: 'data' },
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    }
    const api = {} as RtkBaseQueryApi
    const extraOptions = {}

    axiosBaseQuery()(args, api, extraOptions)

    expect(axios).toBeCalledWith({ ...args, headers: { ...args.headers, 'User-Agent': userAgent } })
  })

  it('should return a function that will return the data property of the returned value from axios', async () => {
    const args = { url: 'http://my_url', params: { my: 'params' }, data: { my: 'data' } }
    const api = {} as RtkBaseQueryApi
    const extraOptions = {}

    const result = await axiosBaseQuery()(args, api, extraOptions)

    expect(result).toEqual({ data: 'my_data' })
  })

  it('should catch AxiosError and return a redux compatibe HttpError if the status property of Axios response is defined', async () => {
    const args = { url: 'http://my_url', params: { my: 'params' }, data: { my: 'data' } }
    const api = {} as RtkBaseQueryApi
    const extraOptions = {}

    ;(axios as jest.MockedFunction<typeof axios>).mockImplementation(() =>
      Promise.reject({ isAxiosError: true, response: { status: 404 } }),
    )

    const result = await axiosBaseQuery()(args, api, extraOptions)

    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(HttpError)
  })

  it('should catch AxiosError and return a redux compatibe NetworkError if the status property of Axios response is not defined', async () => {
    const args = { url: 'http://my_url', params: { my: 'params' }, data: { my: 'data' } }
    const api = {} as RtkBaseQueryApi
    const extraOptions = {}

    ;(axios as jest.MockedFunction<typeof axios>).mockImplementation(() =>
      Promise.reject({
        isAxiosError: true,
        request: { _response: 'Unknown error with error code "NETWORK_ERROR".' },
      }),
    )

    const result = await axiosBaseQuery()(args, api, extraOptions)

    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(NetworkError)
    expect(result?.error?.message).toBe('Unknown error with error code "NETWORK_ERROR".')
  })

  it('should catch any error produced by Axios and return a redux compatibe UnknownError', async () => {
    const args = { url: 'http://my_url', params: { my: 'params' }, data: { my: 'data' } }
    const api = {} as RtkBaseQueryApi
    const extraOptions = {}

    ;(axios as jest.MockedFunction<typeof axios>).mockImplementation(() => Promise.reject(new Error()))

    const result = await axiosBaseQuery()(args, api, extraOptions)

    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(UnknownError)
  })
})
