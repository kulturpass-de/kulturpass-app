import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../../services/redux/configure-store'

export const getOnboardingState = (state: RootState) => state.persisted.onboarding

export const getNotificationOnboardingShown = createSelector(
  getOnboardingState,
  state => state.notificationOnboardingShown === true,
)

export const getShowOnboardingOnStartup = createSelector(getOnboardingState, state => state.showOnboardingOnStartup)
