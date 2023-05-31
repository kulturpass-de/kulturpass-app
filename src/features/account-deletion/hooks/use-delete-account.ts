import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'

import { cdcApi } from '../../../services/api/cdc-api'
import {
  getCdcSessionEmail,
  getIsUserVerificationPending,
  getRegistrationToken,
} from '../../../services/auth/store/auth-selectors'
import { useAuth } from '../../../services/auth/use-auth'

// TO-DO: This hook should should be a thunk inside the user service
export const useDeleteAccount = () => {
  const [loading, setLoading] = useState(false)
  const { logout } = useAuth()
  const [login] = cdcApi.useAccountsLoginMutation()
  const [setAccountInfoWithCustomSessionSigned] = cdcApi.useAccountsSetAccountInfoWithCustomSessionSignedMutation()
  const [setAccountInfoWithRegTokenUnsigned] = cdcApi.useAccountsSetAccountInfoWithRegTokenUnsignedMutation()
  const email = useSelector(getCdcSessionEmail)
  const regToken = useSelector(getRegistrationToken)
  const isUserVerificationPending = useSelector(getIsUserVerificationPending)

  const deleteAccount = useCallback(
    async (password: string) => {
      if (email === undefined) {
        return
      }
      setLoading(true)
      try {
        if (isUserVerificationPending) {
          if (regToken) {
            await setAccountInfoWithRegTokenUnsigned({
              regToken,
              data: { deletionRequested: true },
            }).unwrap()
          }
        } else {
          const { sessionInfo } = await login({ loginID: email, password: password }).unwrap()
          const { sessionSecret, sessionToken } = sessionInfo
          if (sessionSecret && sessionToken) {
            await setAccountInfoWithCustomSessionSigned({
              sessionSecret,
              sessionToken,
              data: { deletionRequested: true },
            }).unwrap()
          }
        }

        await logout()
      } finally {
        setLoading(false)
      }
    },
    [
      email,
      login,
      logout,
      isUserVerificationPending,
      regToken,
      setAccountInfoWithCustomSessionSigned,
      setAccountInfoWithRegTokenUnsigned,
    ],
  )

  return { deleteAccount, loading }
}
