import { useCallback, useState } from 'react'
import { useAuth } from '../../../services/auth/use-auth'
import { cdcApi } from '../../../services/api/cdc-api'
import { useSelector } from 'react-redux'
import { getCdcSessionEmail } from '../../../services/auth/store/auth-selectors'

export const useDeleteAccount = () => {
  const [loading, setLoading] = useState(false)
  const { logout } = useAuth()
  const [login] = cdcApi.useAccountsLoginMutation()
  const [setAccountInfo] = cdcApi.useAccountsSetAccountInfoWithCustomSessionSignedMutation()
  const email = useSelector(getCdcSessionEmail)

  const deleteAccount = useCallback(
    async (password: string) => {
      if (email === undefined) {
        return
      }
      setLoading(true)
      try {
        const { sessionInfo } = await login({ loginID: email, password: password }).unwrap()
        const { sessionSecret, sessionToken } = sessionInfo
        await setAccountInfo({
          sessionSecret,
          sessionToken,
          data: { deletionRequested: true },
        }).unwrap()
        await logout()
      } finally {
        setLoading(false)
      }
    },
    [email, login, logout, setAccountInfo],
  )

  return { deleteAccount, loading }
}
