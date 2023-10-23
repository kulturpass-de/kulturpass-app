import isEqual from 'lodash.isequal'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCdcSessionData, getIsUserLoggedIn } from '../auth/store/auth-selectors'
import { AppDispatch } from '../redux/configure-store'
import { selectUserPreferences, selectUserProfile } from './redux/user-selectors'
import { userSlice } from './redux/user-slice'
import { useGetAccountInfo } from './use-get-account-info'
import { useSetAccountInfo } from './use-set-account-info'

export const useUserInfo = (regToken?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const userPreferences = useSelector(selectUserPreferences)
  const cdcSessionData = useSelector(getCdcSessionData)
  const userProfile = useSelector(selectUserProfile)

  regToken = cdcSessionData?.regToken || regToken
  const accountInfo = useGetAccountInfo(regToken)
  const setAccountInfo = useSetAccountInfo(regToken)

  useEffect(() => {
    if (!isLoggedIn && !regToken) {
      return
    }

    if (accountInfo.isLoading || !accountInfo.data) {
      return
    }

    if (!isEqual(userPreferences, accountInfo.data.data)) {
      dispatch(userSlice.actions.setUserPreferences(accountInfo.data.data))
    }
  }, [isLoggedIn, regToken, accountInfo, userPreferences, dispatch])

  const name = useMemo(
    () => (isLoggedIn && userProfile ? userProfile?.firstName : undefined),
    [isLoggedIn, userProfile],
  )

  return { name, userPreferences, setAccountInfo, accountInfo }
}
