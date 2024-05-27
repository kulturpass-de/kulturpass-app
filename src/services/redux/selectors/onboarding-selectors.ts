import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../../services/redux/configure-store'

const getPersistedState = (state: RootState) => state.persisted

export const getNotificationOnboardingShown = createSelector(
  getPersistedState,
  state => state.onboarding.notificationOnboardingShown === true,
)

export const getShowOnboardingOnStartup = createSelector(
  getPersistedState,
  state => state.onboarding.showOnboardingOnStartup,
)
