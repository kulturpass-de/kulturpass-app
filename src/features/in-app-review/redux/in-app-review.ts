import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { env } from '../../../env'
import { InAppReviewState } from '../../../services/redux/versions/current'

type InAppReviewStateNonPersisted = {
  showInAppReview: boolean
}

export const inAppReviewInitialStateNonPersisted: InAppReviewStateNonPersisted = {
  // In App Review should be disabled per default on dev menu builds
  // as there are issues with the test automation
  showInAppReview: !env.DEV_MENU,
}

export const inAppReviewInitialState: InAppReviewState = {
  lastShownTimestamp: undefined,
}

export const inAppReviewSliceNonPersisted = createSlice({
  name: 'inAppReview',
  initialState: inAppReviewInitialStateNonPersisted,
  reducers: {
    setShowInAppReview: (state, action: PayloadAction<boolean>) => {
      state.showInAppReview = action.payload
    },
  },
})

export const inAppReviewSlice = createSlice({
  name: 'inAppReview',
  initialState: inAppReviewInitialState,
  reducers: {
    setLastShownTimestamp: (state, action: PayloadAction<number | undefined>) => {
      state.lastShownTimestamp = action.payload
    },
  },
})

export const { setLastShownTimestamp } = inAppReviewSlice.actions
export const { setShowInAppReview } = inAppReviewSliceNonPersisted.actions
