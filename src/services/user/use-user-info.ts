import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import isEqual from 'lodash.isequal'

import { cdcApi } from '../api/cdc-api'
import { AccountsSetAccountInfoRequestParams } from '../api/types'
import { getCdcSessionData, getIsUserLoggedIn } from '../auth/store/auth-selectors'
import { AppDispatch } from '../redux/configure-store'
import { selectUserPreferences, selectUserProfile } from './redux/user-selectors'
import { userSlice } from './redux/user-slice'

export const useUserInfo = (regToken?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const isLoggedIn = useSelector(getIsUserLoggedIn)
  const userProfile = useSelector(selectUserProfile)
  const userPreferences = useSelector(selectUserPreferences)
  const cdcSessionData = useSelector(getCdcSessionData)
  regToken = cdcSessionData?.regToken || regToken
  const accountInfo = cdcApi.endpoints.accountsGetAccountInfo.useQuery(
    { regToken },
    { skip: !isLoggedIn && !cdcSessionData?.regToken },
  )
  const [setAccountInfoMutation] = cdcApi.endpoints.accountsSetAccountInfo.useMutation()

  const updateAccountInfo = async (data: AccountsSetAccountInfoRequestParams['data']) => {
    await setAccountInfoMutation({ data, regToken }).unwrap()
  }

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

  return { firstName, userPreferences, updateAccountInfo, accountInfo }
}
