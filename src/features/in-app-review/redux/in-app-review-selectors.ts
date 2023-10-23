import { RootState } from '../../../services/redux/configure-store'

export const getLastShownTimestamp = (reduxState: RootState) => reduxState.persisted.inAppReview.lastShownTimestamp

export const getShowInAppReview = (reduxState: RootState) => reduxState.inAppReview.showInAppReview
