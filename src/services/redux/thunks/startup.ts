import { clearSecurePersistedSession } from '../../session/redux/thunks/clear-secure-persisted-session'
import { restoreSession } from '../../session/redux/thunks/restore-session'
import { translation } from '../../translation/translation'
import { appCoreSlice, selectLastUsedTranslationLanguage } from '../slices/app-core'
import { createThunk } from '../utils/create-thunk'
import { pollAppConfig } from './poll-app-config'

export const startup = createThunk<void, { appFirstRun: boolean }>('root/startup', async (payload, thunkApi) => {
  if (payload.appFirstRun) {
    await thunkApi.dispatch(clearSecurePersistedSession())
    thunkApi.dispatch(appCoreSlice.actions.setIsBootstrapped())
  } else {
    await thunkApi.dispatch(restoreSession()).unwrap()
  }

  const lastUsedTranslationLanguage = selectLastUsedTranslationLanguage(thunkApi.getState())
  if (lastUsedTranslationLanguage) {
    translation.changeLanguage(lastUsedTranslationLanguage)
  }

  thunkApi.dispatch(pollAppConfig())
})
