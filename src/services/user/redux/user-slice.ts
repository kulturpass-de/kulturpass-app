import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AccountInfo } from '../../api/types'
import { CdcSessionData } from '../../session/types'

export type UserState = {
  profile: Pick<CdcSessionData['user'], 'firstName'> | null
  data: AccountInfo['data'] | null
  userDeniedLocationServices: boolean
  displayVerifiedAlert: boolean
  registrationFinalizationInProgess: boolean
}

const initialState: UserState = {
  profile: null,
  data: null,
  userDeniedLocationServices: false,
  displayVerifiedAlert: false,
  registrationFinalizationInProgess: false,
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
    setUserDeniedLocationServices: (state, action: PayloadAction<boolean>) => {
      state.userDeniedLocationServices = action.payload
    },
    setDisplayVerifiedAlert: (state, action: PayloadAction<boolean>) => {
      state.displayVerifiedAlert = action.payload
    },
    setRegistrationFinalizationInProgess: (state, action: PayloadAction<boolean>) => {
      state.registrationFinalizationInProgess = action.payload
    },
    clearUser: state => {
      state.profile = null
      state.data = null
      state.userDeniedLocationServices = false
    },
  },
})
