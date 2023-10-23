import React, { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCdcSessionData, isUserPending } from '../../../../services/auth/store/auth-selectors'
import { useAuth } from '../../../../services/auth/use-auth'
import { AppDispatch } from '../../../../services/redux/configure-store'
import { selectIsInForeground } from '../../../../services/redux/slices/app-core'
import { getDisplayVerifiedAlert } from '../../../../services/user/redux/user-selectors'
import { userSlice } from '../../../../services/user/redux/user-slice'
import { useGetAccountInfoLazyQuery } from '../../../../services/user/use-get-account-info-lazy-query'
import { AccountVerifiedAlert } from './account-verified-alert'

/**
 * Renders the "Erfolgreich verifiziert" alert
 * when the app gets into foreground and the
 * verification status changed from unverified to verified
 */
export const AccountVerifiedAlertHandler = () => {
  const { isLoading } = useAuth()
  const sessionData = useSelector(getCdcSessionData)
  const isPending = isUserPending(sessionData)
  const regToken = sessionData?.regToken
  const appIsInForeground = useSelector(selectIsInForeground)

  const getAccountInfoLazyQuery = useGetAccountInfoLazyQuery()

  const displayVerifiedAlert = useSelector(getDisplayVerifiedAlert)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (isLoading) {
      return
    }
    if (!appIsInForeground) {
      return
    }
    if (!isPending) {
      return
    }
    if (!regToken) {
      return
    }

    const updateVerificationStatus = async () => {
      try {
        const { isVerified } = await getAccountInfoLazyQuery(regToken)
        dispatch(userSlice.actions.setDisplayVerifiedAlert(isVerified === true))
      } catch (_error: unknown) {}
    }

    updateVerificationStatus()
  }, [appIsInForeground, isPending, regToken, getAccountInfoLazyQuery, dispatch, isLoading])

  const onPressForwardToLogin = useCallback(async () => {
    dispatch(userSlice.actions.setDisplayVerifiedAlert(false))
  }, [dispatch])

  if (!displayVerifiedAlert) {
    return null
  }

  return <AccountVerifiedAlert onDismiss={onPressForwardToLogin} />
}
