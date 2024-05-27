import { getDeltaPushNotificationsOnboardingShown } from '../../../features/delta-onboarding/redux/delta-onboarding-selectors'
import { setShouldShowDeltaOnboardingPushNotification } from '../../../features/delta-onboarding/redux/delta-onboarding-slice'
import { authValidateSession } from '../../auth/store/thunks/auth-validate-session'
import { refreshLocation } from '../../location/redux/thunks/refresh-location'
import { logger } from '../../logger'
import { notificationsStartup } from '../../notifications/store/thunks/notifications-startup'
import { clearSecurePersistedSession } from '../../session/redux/thunks/clear-secure-persisted-session'
import { restoreSession } from '../../session/redux/thunks/restore-session'
import { translation } from '../../translation/translation'
import { getNotificationOnboardingShown } from '../selectors/onboarding-selectors'
import { persistedAppCoreSlice, selectLastUsedTranslationLanguage } from '../slices/persisted-app-core'
import { createThunk } from '../utils/create-thunk'
import { pollAppConfig } from './poll-app-config'

export const startup = createThunk<void, { appFirstRun: boolean }>('root/startup', async (payload, thunkApi) => {
  let isCdcSessionValid = false

  if (payload.appFirstRun) {
    await thunkApi.dispatch(clearSecurePersistedSession())
    thunkApi.dispatch(persistedAppCoreSlice.actions.setIsBootstrapped())
  } else {
    try {
      await thunkApi.dispatch(restoreSession()).unwrap()
      const session = await thunkApi.dispatch(authValidateSession()).unwrap()

      if (session?.isCdcSessionValid) {
        isCdcSessionValid = true
      }
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

  try {
    // subscribe to notification topics
    if (getNotificationOnboardingShown(state) || getDeltaPushNotificationsOnboardingShown(state)) {
      await thunkApi.dispatch(notificationsStartup()).unwrap()
    }
  } catch (error) {
    logger.logError('Startup notifications startup', error)
  }

  if (!getDeltaPushNotificationsOnboardingShown(state) && isCdcSessionValid) {
    thunkApi.dispatch(setShouldShowDeltaOnboardingPushNotification(true))
  }

  await thunkApi.dispatch(pollAppConfig()).unwrap()
})
