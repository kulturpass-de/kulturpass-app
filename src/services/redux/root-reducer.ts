import { combineReducers } from '@reduxjs/toolkit'
import { inAppReviewSliceNonPersisted } from '../../features/in-app-review/redux/in-app-review'
import { productDetailSlice } from '../../features/product-detail/redux/product-detail-slice'
import { themeSlice } from '../../theme/redux/theme'
import { cdcApi } from '../api/cdc-api'
import { commerceApi } from '../api/commerce-api'
import { authSlice } from '../auth/store/auth-slice'
import { notificationsDebugSlice } from '../notifications/store/notifications-debug-slice'
import { userSlice } from '../user/redux/user-slice'
import { webviewsSlice } from '../webviews/redux/webviews-slice'
import { createPersistReducer } from './persist-reducer'
import { appCoreSlice } from './slices/app-core'

export const rootReducer = combineReducers({
  persisted: createPersistReducer(),
  // store anything else here which should not persist
  [cdcApi.reducerPath]: cdcApi.reducer,
  [commerceApi.reducerPath]: commerceApi.reducer,
  [userSlice.name]: userSlice.reducer,
  [authSlice.name]: authSlice.reducer,
  [webviewsSlice.name]: webviewsSlice.reducer,
  [themeSlice.name]: themeSlice.reducer,
  [appCoreSlice.name]: appCoreSlice.reducer,
  [notificationsDebugSlice.name]: notificationsDebugSlice.reducer,
  [inAppReviewSliceNonPersisted.name]: inAppReviewSliceNonPersisted.reducer,
  [productDetailSlice.name]: productDetailSlice.reducer,
})
