import { QueryActionCreatorResult } from '@reduxjs/toolkit/query/react'
import { commerceApi } from '../../api/commerce-api'
import { createThunk } from '../utils/create-thunk'

/**
 * 5 minutes
 */
export const APP_CONFIG_POLLING_INTERVAL = 5 * 60 * 1000

export let pollAppConfigSubscription:
  | undefined
  | QueryActionCreatorResult<typeof commerceApi.endpoints.getAppConfig.Types.QueryDefinition>

export const pollAppConfig = createThunk<void, void>('root/pollAppConfig', async (payload, thunkApi) => {
  if (pollAppConfigSubscription) {
    pollAppConfigSubscription.refetch()
    return
  }

  pollAppConfigSubscription = thunkApi.dispatch(
    commerceApi.endpoints.getAppConfig.initiate(undefined, {
      subscriptionOptions: { pollingInterval: APP_CONFIG_POLLING_INTERVAL },
    }),
  )
})
