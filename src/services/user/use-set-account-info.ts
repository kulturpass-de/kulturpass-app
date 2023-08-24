import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AccountsSetAccountInfoSignedRequestParams } from '../api/types'
import { getCdcSessionData } from '../auth/store/auth-selectors'
import { AppDispatch } from '../redux/configure-store'
import { setAccountInfo } from './redux/thunks/set-account-info'

export const useSetAccountInfo = (regToken?: string) => {
  const dispatch = useDispatch<AppDispatch>()
  const cdcSessionData = useSelector(getCdcSessionData)
  regToken = regToken || cdcSessionData?.regToken

  const setAccountInfoCb = useCallback(
    async (params: AccountsSetAccountInfoSignedRequestParams) => {
      await dispatch(
        setAccountInfo({
          params,
          regToken,
        }),
      ).unwrap()
    },
    [dispatch, regToken],
  )

  return setAccountInfoCb
}
