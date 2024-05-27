import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '../../../services/redux/configure-store'

export const getDeltaOnboardingState = (state: RootState) => state.persisted.deltaOnboarding

export const getShowEditorialEmailModalOnStartup = createSelector(
  getDeltaOnboardingState,
  state => state.showEditorialEmailModalOnStartup === true,
)

export const getUserDismissedEditorialEmailModal = createSelector(
  getDeltaOnboardingState,
  state => state.userDismissed === true,
)

export const getDeltaPushNotificationsOnboardingShown = createSelector(
  getDeltaOnboardingState,
  state => state.deltaPushNotificationsOnboardingShown === true,
)

export const getShouldShowDeltaOnboardingPushNotification = createSelector(
  getDeltaOnboardingState,
  state => state.shouldShowDeltaOnboardingPushNotification === true,
)
