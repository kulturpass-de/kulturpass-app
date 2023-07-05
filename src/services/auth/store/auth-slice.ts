import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addIsLoadingAsyncThunkCases } from '../../redux/utils/add-is-loading-async-thunk-cases'
import { CdcSessionData, CommerceSessionData } from '../../session/types'
import { authLogin } from './thunks/auth-login'
import { authLogout } from './thunks/auth-logout'

export type AuthState = {
  cdc: CdcSessionData | null
  commerce: CommerceSessionData | null
  isLoading: boolean
}

export const initialState: AuthState = {
  cdc: null,
  commerce: null,
  isLoading: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setCdcSession: (state, action: PayloadAction<CdcSessionData>) => ({ ...state, cdc: action.payload }),
    setCdcIdToken: (state, action: PayloadAction<string>) => {
      if (!state.cdc) {
        return state
      }

      return { ...state, cdc: { ...state.cdc, idToken: action.payload } }
    },
    clearCdcSession: state => ({ ...state, cdc: null }),
    setCommerceSession: (state, action: PayloadAction<CommerceSessionData>) => {
      return { ...state, commerce: action.payload }
    },
    clearCommerceSession: state => ({ ...state, commerce: null }),
  },
  extraReducers: builder => {
    /**
     * The following lines modify `AuthState.isLoading` depending on the status of `authLogin` and `authLogout` thunks,
     * setting `isLoading = true` when any of the two thunks emit "pending state", and setting `isLoading = false` when
     * any of the two thunks emit "fulfilled / rejected state".
     */
    addIsLoadingAsyncThunkCases(builder, authLogin, 'isLoading')
    addIsLoadingAsyncThunkCases(builder, authLogout, 'isLoading')
  },
})
