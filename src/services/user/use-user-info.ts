import isEqual from 'lodash.isequal'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { commerceApi } from '../api/commerce-api'
import { getCdcSessionData, getIsUserLoggedIn } from '../auth/store/auth-selectors'
import { AppDispatch } from '../redux/configure-store'
import { selectUserPreferences } from './redux/user-selectors'
import { userSlice } from './redux/user-slice'
import { useGetAccountInfo } from './use-get-account-info'
import { useSetAccountInfo } from './use-set-account-info'

export const useUserInfo = (regToken?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const { data: userProfile } = commerceApi.useGetProfileQuery({}, { skip: !isLoggedIn })
  const userPreferences = useSelector(selectUserPreferences)
  const cdcSessionData = useSelector(getCdcSessionData)
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

  const firstName = useMemo(
    // at the time of registration userProfile is not in redux yet, so the first name is empty
    () => ((isLoggedIn || regToken) && userProfile?.firstName) || '',
    [isLoggedIn, regToken, userProfile],
  )

  return { firstName, userPreferences, setAccountInfo, accountInfo }
}
