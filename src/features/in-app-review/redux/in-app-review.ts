import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InAppReviewState } from '../../../services/redux/versions/current'

type InAppReviewStateNonPersisted = {
  showInAppReview: boolean
}

export const inAppReviewInitialStateNonPersisted: InAppReviewStateNonPersisted = {
  showInAppReview: true,
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
