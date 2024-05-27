import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OnboardingState } from '../../../services/redux/versions/current'

export const onboardingInitialState: OnboardingState = {
  showOnboardingOnStartup: true,
  notificationOnboardingShown: false,
}

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: onboardingInitialState,
  reducers: {
    setShowOnboardingOnStartup: (state, action: PayloadAction<boolean>) => {
      state.showOnboardingOnStartup = action.payload
    },
    setNotificationOnboardingShown: (state, action: PayloadAction<boolean>) => {
      state.notificationOnboardingShown = action.payload
    },
  },
})

export const { setShowOnboardingOnStartup, setNotificationOnboardingShown } = onboardingSlice.actions
