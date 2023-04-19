import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type OnboardingState = {
  showOnboardingOnStartup: boolean
}

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
