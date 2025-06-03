import { ActionReducerMapBuilder, AsyncThunk } from '@reduxjs/toolkit'
import { AsyncThunkConfig } from './create-thunk'

/**
 * This method can be used to make an asyncThunk control the loading state inside a reducer,
 * depending on the current state
 * of the asyncThunk (pending / fulfilled / rejected).
 */

export const addIsLoadingAsyncThunkCases = <State extends object>(
  builder: ActionReducerMapBuilder<State>,
  asyncThunk: AsyncThunk<any, any, AsyncThunkConfig>,
  isLoadingPropName: keyof State,
) => {
  builder
    .addCase(asyncThunk.rejected, state => {
      return { ...state, [isLoadingPropName]: false }
    })
    .addCase(asyncThunk.fulfilled, state => {
      return { ...state, [isLoadingPropName]: false }
    })
    .addCase(asyncThunk.pending, state => {
      return { ...state, [isLoadingPropName]: true }
    })
}
