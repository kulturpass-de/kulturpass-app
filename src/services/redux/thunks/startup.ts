import { getNotificationOnboardingShown } from '../../../features/onboarding/redux/onboarding-selectors'
import { authValidateSession } from '../../auth/store/thunks/auth-validate-session'
import { refreshLocation } from '../../location/redux/thunks/refresh-location'
import { logger } from '../../logger'
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
    try {
      await thunkApi.dispatch(restoreSession()).unwrap()
      await thunkApi.dispatch(authValidateSession()).unwrap()
    } catch (error: unknown) {
      logger.logError('Startup restoring session', error)
    }
  }

  const state = thunkApi.getState()

  const lastUsedTranslationLanguage = selectLastUsedTranslationLanguage(state)
  if (lastUsedTranslationLanguage) {
    await translation?.changeLanguage(lastUsedTranslationLanguage)
  }

  await thunkApi.dispatch(refreshLocation())

  if (getNotificationOnboardingShown(state)) {
    await thunkApi.dispatch(notificationsStartup()).unwrap()
  }

  await thunkApi.dispatch(pollAppConfig()).unwrap()
})
