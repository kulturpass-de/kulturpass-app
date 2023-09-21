import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { InAppReviewState } from '../../../services/redux/versions/current'

export const inAppReviewInitialState: InAppReviewState = {
  lastShownTimestamp: undefined,
}

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
