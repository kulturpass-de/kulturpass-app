import { BaseQueryExtraOptions, BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes'
import { BaseQueryApi as RtkBaseQueryApi } from '@reduxjs/toolkit/query/react'
import { AxiosRequestConfig } from 'axios'

import { ErrorWithCode } from '../../errors/errors'

export type BaseQueryArg = Record<string, any>

export type QueryFnPrepare<Prepared extends {}, QueryArg extends void | BaseQueryArg> = (
  params: QueryArg,
  api: BaseQueryApi,
) => Prepared

export type CreateQueryFn<Prepared extends {}, ExtraQueryArg extends BaseQueryArg | unknown = unknown> = <
  Result,
  QueryArg extends ExtraQueryArg extends BaseQueryArg ? BaseQueryArg & ExtraQueryArg : BaseQueryArg | void,
>(
  prepare: QueryFnPrepare<Prepared, QueryArg>,
) => QueryFn<Result, QueryArg>

export type AxiosBaseQueryFn<Result> = BaseQueryFn<AxiosRequestConfig, Result, ErrorWithCode>

export type BaseQueryApi = RtkBaseQueryApi

export type QueryFn<Result, QueryArg> = (
  arg: QueryArg,
  api: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions<AxiosBaseQueryFn<Result>>,
  baseQuery: AxiosBaseQueryFn<Result>,
) => ReturnType<typeof baseQuery>
