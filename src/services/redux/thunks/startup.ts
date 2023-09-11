import { rehydrateCommerceApiCache } from '../../api/redux/thunks/rehydrate-commerce-api-cache'
import { clearSecurePersistedSession } from '../../session/redux/thunks/clear-secure-persisted-session'
import { restoreSession } from '../../session/redux/thunks/restore-session'
import { translation } from '../../translation/translation'
import { persistedAppCoreSlice, selectLastUsedTranslationLanguage } from '../slices/persisted-app-core'
import { createThunk } from '../utils/create-thunk'
import { pollAppConfig } from './poll-app-config'

export const startup = createThunk<void, { appFirstRun: boolean }>('root/startup', async (payload, thunkApi) => {
  if (payload.appFirstRun) {
    await thunkApi.dispatch(clearSecurePersistedSession())
    thunkApi.dispatch(persistedAppCoreSlice.actions.setIsBootstrapped())
  } else {
    await thunkApi.dispatch(restoreSession()).unwrap()
    await thunkApi.dispatch(rehydrateCommerceApiCache()).unwrap()
  }

  const state = thunkApi.getState()

  const lastUsedTranslationLanguage = selectLastUsedTranslationLanguage(state)
  if (lastUsedTranslationLanguage) {
    translation.changeLanguage(lastUsedTranslationLanguage)
  }

  thunkApi.dispatch(pollAppConfig())
})
