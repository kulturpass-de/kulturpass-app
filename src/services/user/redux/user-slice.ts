import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AccountInfo } from '../../api/types'

export type UserState = {
  profile: Pick<NonNullable<AccountInfo['profile']>, 'firstName'> | null
  data: AccountInfo['data'] | null
}

const initialState: UserState = {
  profile: null,
  data: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserState['profile']>) => {
      state.profile = action.payload
    },
    setUserPreferences: (state, action: PayloadAction<UserState['data']>) => {
      state.data = action.payload
    },
    clearUser: state => {
      state.profile = null
      state.data = null
    },
  },
})
