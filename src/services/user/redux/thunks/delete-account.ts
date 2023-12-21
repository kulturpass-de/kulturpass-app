import { cdcApi } from '../../../api/cdc-api'
import { AccountsLoginResponse } from '../../../api/types'
import { getCdcSessionEmail, getIsUserVerificationPending } from '../../../auth/store/auth-selectors'
import { authLogout } from '../../../auth/store/thunks/auth-logout'
import { CdcInvalidLoginIdDeleteError, CdcInvalidLoginIdError } from '../../../errors/cdc-errors'
import { UnknownError } from '../../../errors/errors'
import { logger } from '../../../logger'
import { createThunk } from '../../../redux/utils/create-thunk'

export const deleteAccount = createThunk<void, { password: string }>(
  'user/delete-account',
  async (payload, thunkApi) => {
    const { password } = payload
    const { dispatch } = thunkApi
    const state = thunkApi.getState()

    const email = getCdcSessionEmail(state)

    if (!email) {
      logger.warn('deleteAccount email not set. Is the user logged in?')
      throw new UnknownError('Email Missing')
    }

    const initLoginAction = cdcApi.endpoints.accountsLogin.initiate({ loginID: email, password: password })
    let loginResponse: AccountsLoginResponse
    try {
      loginResponse = await dispatch(initLoginAction).unwrap()
    } catch (error: unknown) {
      // Show specific error message for invalid login credentials
      if (error instanceof CdcInvalidLoginIdError) {
        const newError = new CdcInvalidLoginIdDeleteError()
        newError.errorDetails = error.errorDetails
        throw newError
      } else {
        throw error
      }
    }

    const { regToken, sessionInfo } = loginResponse
    const isUserVerificationPending = getIsUserVerificationPending(state)

    if (isUserVerificationPending && regToken) {
      await dispatch(
        cdcApi.endpoints.accountsSetAccountInfoWithRegTokenUnsigned.initiate({
          regToken,
          data: { deletionRequested: true },
        }),
      ).unwrap()
    } else if (!isUserVerificationPending && sessionInfo && sessionInfo.sessionToken && sessionInfo.sessionSecret) {
      const { sessionSecret, sessionToken } = sessionInfo
      await dispatch(
        cdcApi.endpoints.accountsSetAccountInfoWithCustomSessionSigned.initiate({
          sessionSecret,
          sessionToken,
          data: { deletionRequested: true },
        }),
      ).unwrap()
    } else {
      logger.warn('deleteAccount session info missing after login')
      throw new UnknownError('Session Info Missing')
    }
    await dispatch(authLogout()).unwrap()
  },
)
