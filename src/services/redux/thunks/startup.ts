import { getNotificationOnboardingShown } from '../../../features/onboarding/redux/onboarding-selectors'
import { rehydrateCommerceApiCache } from '../../api/redux/thunks/rehydrate-commerce-api-cache'
import { notificationsStartup } from '../../notifications/store/thunks/notifications-startup'
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
    await translation.changeLanguage(lastUsedTranslationLanguage)
  }

  if (getNotificationOnboardingShown(state)) {
    await thunkApi.dispatch(notificationsStartup()).unwrap()
  }

  await thunkApi.dispatch(pollAppConfig()).unwrap()
})
