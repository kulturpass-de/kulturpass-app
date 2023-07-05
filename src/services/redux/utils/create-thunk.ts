import { createAsyncThunk, AsyncThunkPayloadCreator } from '@reduxjs/toolkit'
import { ErrorWithCode } from '../../errors/errors'
import { AppDispatch, RootState } from '../configure-store'

/**
 * Extended from https://github.com/reduxjs/redux-toolkit/blob/master/packages/toolkit/src/createAsyncThunk.ts#L108
 */
export type AsyncThunkConfig = {
  state: RootState
  dispatch: AppDispatch
  rejectValue: ErrorWithCode
  serializedErrorType: ErrorWithCode
}

/**
 * A convinience wrapper function for `@reduxjs/toolkit/createAsyncThunk`, mostly for DRY-ness, that adds the following:
 * - `AsyncThunkConfig` typing, which is needed in order to get properly typed `thunkApi` inside the `payloadCreator`
 * - a `try/catch` with `rejectWithValue`, which is needed for the asyncThunk to return the error as `payload` and not
 *   as `error` (in which case it will be transformed to a normal `Error` and `instanceof ErrorWithCode` will not work)
 */
export const createThunk = <Returned = void, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, AsyncThunkConfig>,
) => {
  const wrappedPayloadCreator: typeof payloadCreator = async (payload, thunkApi) => {
    let result: ReturnType<(typeof thunkApi)['rejectWithValue']> | Awaited<Returned>
    try {
      result = await payloadCreator(payload, thunkApi)
    } catch (error: any) {
      result = thunkApi.rejectWithValue(error)
    }
    return result
  }

  return createAsyncThunk<Returned, ThunkArg, AsyncThunkConfig>(typePrefix, wrappedPayloadCreator)
}
