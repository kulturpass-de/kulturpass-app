import { clearSecurePersistedSession } from '../../session/redux/thunks/clear-secure-persisted-session'
import { restoreSession } from '../../session/redux/thunks/restore-session'
import { appCoreSlice } from '../slices/app-core'
import { createThunk } from '../utils/create-thunk'
import { pollAppConfig } from './poll-app-config'

export const startup = createThunk<void, { appFirstRun: boolean }>('root/startup', async (payload, thunkApi) => {
  if (payload.appFirstRun) {
    await thunkApi.dispatch(clearSecurePersistedSession())
    thunkApi.dispatch(appCoreSlice.actions.setIsBootstrapped())
  } else {
    await thunkApi.dispatch(restoreSession()).unwrap()
  }

  thunkApi.dispatch(pollAppConfig())
})
