import { AxiosHeaders } from 'axios'
import { ErrorWithCode } from '../../errors/errors'
import { configureMockStore } from '../../testing/configure-mock-store'
import { jestFn } from '../../testing/jest-fn'
import { BaseQueryApi } from '../common/types'
import { sendCdcPostRequest } from './send-cdc-post-request'

describe('send-cdc-post-request', () => {
  const store = configureMockStore()

  const url = 'my_url'
  const bodyPayload = { my: 'payload' }
  const api = { getState: store.getState } as BaseQueryApi
  const extraOptions = {}

  it('should call baseQuery with header Content-Type set to application/x-www-form-urlencoded', async () => {
    const baseQuery = jestFn((_args, _api, _extraOptions) => ({ data: 'my_base_query_response' }))

    await sendCdcPostRequest(url, bodyPayload, api, extraOptions, baseQuery)

    const headers = new AxiosHeaders()
    headers.set('Content-Type', 'application/x-www-form-urlencoded')
    const args = expect.objectContaining({ headers })

    expect(baseQuery).toHaveBeenCalledWith(args, api, extraOptions)
  })

  it('should have bodyPayload values encoded correctly', async () => {
    const bodyPayloadWithEncodedValues = { some: 'values', will: 'be', put: 'here' }
    const baseQuery = jestFn((_args, _api, _extraOptions) => ({ data: 'my_base_query_response' }))

    await sendCdcPostRequest(url, bodyPayloadWithEncodedValues, api, extraOptions, baseQuery)

    const args = expect.objectContaining({ data: bodyPayloadWithEncodedValues })

    expect(baseQuery).toHaveBeenCalledWith(args, api, extraOptions)
  })

  it('should call baseQuery with correct params and return the response', async () => {
    const baseQuery = jestFn((_args, _api, _extraOptions) => ({ data: 'my_base_query_response' }))

    const result = await sendCdcPostRequest(url, bodyPayload, api, extraOptions, baseQuery)

    const args = {
      data: { my: 'payload' },
      headers: new AxiosHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      method: 'POST',
      url: 'my_url',
    }

    expect(baseQuery).toHaveBeenCalledWith(args, api, extraOptions)
    expect(result).toEqual({ data: 'my_base_query_response' })
  })

  it('should return cdcError if the response contains an error', async () => {
    const baseQuery = jestFn((_args, _api, _extraOptions) => ({
      data: {
        errorCode: 1,
        errorDetails: 'my_error_details',
        errorMessage: 'my_error_message',
        statusCode: 400,
      },
    }))

    const result = await sendCdcPostRequest(url, bodyPayload, api, extraOptions, baseQuery)

    expect(result).toHaveProperty('error')
    expect(result.error).toBeInstanceOf(ErrorWithCode)
  })
})
