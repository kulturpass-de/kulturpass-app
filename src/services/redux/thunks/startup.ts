import { restoreSession } from '../../session/redux/thunks/restore-session'
import { installationSlice } from '../slices/installation'
import { createThunk } from '../utils/create-thunk'

export const startup = createThunk<void, { appFirstRun: boolean }>('root/startup', async (payload, thunkApi) => {
  await thunkApi.dispatch(restoreSession(payload)).unwrap()

  if (payload.appFirstRun) {
    thunkApi.dispatch(installationSlice.actions.setInstalled())
  }
})
