import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { OnboardingState } from '../../../services/redux/versions/current'

export const onboardingInitialState: OnboardingState = {
  showOnboardingOnStartup: true,
}

export const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: onboardingInitialState,
  reducers: {
    setShowOnboardingOnStartup: (state, action: PayloadAction<boolean>) => {
      state.showOnboardingOnStartup = action.payload
    },
  },
})

export const { setShowOnboardingOnStartup } = onboardingSlice.actions
