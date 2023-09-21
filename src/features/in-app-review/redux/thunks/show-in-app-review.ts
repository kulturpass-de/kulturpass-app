import InAppReview from 'react-native-in-app-review'
import { logger } from '../../../../services/logger'
import { createThunk } from '../../../../services/redux/utils/create-thunk'
import { setLastShownTimestamp } from '../in-app-review'
import { getLastShownTimestamp } from '../in-app-review-selectors'

export const TIMESTAMP_DIFF_TO_SHOW_NEXT_REVIEW = 31 * 24 * 60 * 60 * 1000 /* 31 days in milliseconds */

export const showInAppReview = createThunk<void, void>('inAppReview/showReview', async (_payload, thunkAPI) => {
  if (!InAppReview.isAvailable()) {
    logger.warn('InAppReview Not Available on Device')
    return
  }

  const lastShownTimestamp = getLastShownTimestamp(thunkAPI.getState())
  if (lastShownTimestamp === undefined || Date.now() > lastShownTimestamp + TIMESTAMP_DIFF_TO_SHOW_NEXT_REVIEW) {
    try {
      logger.log('InAppReview request to show review popup')
      await InAppReview.RequestInAppReview()
    } catch (error: unknown) {
      logger.logError('InAppReview', error)
    }
    thunkAPI.dispatch(setLastShownTimestamp(Date.now()))
  }
})
