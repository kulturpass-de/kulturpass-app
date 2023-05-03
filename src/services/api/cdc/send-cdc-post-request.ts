import { BaseQueryExtraOptions } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { AxiosHeaders, AxiosRequestConfig } from 'axios'

import { CdcResponseErrorSchema, createCdcErrorFromSchema } from '../../errors/cdc-errors'
import { AxiosBaseQueryFn, BaseQueryApi } from '../common/types'

export const sendCdcPostRequest = async <Result, BodyPayload extends {}>(
  url: string,
  bodyPayload: BodyPayload,
  api: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions<AxiosBaseQueryFn<Result>>,
  baseQuery: AxiosBaseQueryFn<Result>,
) => {
  const headers = new AxiosHeaders()
  headers.set('Content-Type', 'application/x-www-form-urlencoded')

  const args: AxiosRequestConfig = { url, headers, method: 'POST', data: bodyPayload }

  const response = await baseQuery(args, api, extraOptions)

  const errorResult = CdcResponseErrorSchema.safeParse(response.data)
  if (errorResult.success) {
    return {
      error: createCdcErrorFromSchema(errorResult.data),
    }
  }

  return response
}
