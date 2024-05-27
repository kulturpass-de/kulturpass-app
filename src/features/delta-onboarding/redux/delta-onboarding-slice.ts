import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DeltaOnboardingState } from '../../../services/redux/versions/current'

const initialState: DeltaOnboardingState = {
  showEditorialEmailModalOnStartup: false,
  deltaPushNotificationsOnboardingShown: false,
  shouldShowDeltaOnboardingPushNotification: false,
  userDismissed: false,
}

export const deltaOnboardingSlice = createSlice({
  name: 'deltaOnboarding',
  initialState,
  reducers: {
    setShowEditorialEmailModalOnStartup: (state, action: PayloadAction<boolean>) => {
      state.showEditorialEmailModalOnStartup = action.payload
    },
    setUserDismissedEditorialEmailModal: (state, action: PayloadAction<boolean>) => {
      state.userDismissed = action.payload
    },
    setDeltaPushNotificationsOnboardingShown: (state, action: PayloadAction<boolean>) => {
      state.deltaPushNotificationsOnboardingShown = action.payload
    },
    setShouldShowDeltaOnboardingPushNotification: (state, action: PayloadAction<boolean>) => {
      state.shouldShowDeltaOnboardingPushNotification = action.payload
    },
  },
})

export const {
  setShowEditorialEmailModalOnStartup,
  setUserDismissedEditorialEmailModal,
  setDeltaPushNotificationsOnboardingShown,
  setShouldShowDeltaOnboardingPushNotification,
} = deltaOnboardingSlice.actions
