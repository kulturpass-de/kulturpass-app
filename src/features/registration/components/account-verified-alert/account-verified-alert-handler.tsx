import React, { useCallback } from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { getCdcSessionData, isUserPending } from '../../../../services/auth/store/auth-selectors'
import { selectIsInForeground } from '../../../../services/redux/slices/app-core'
import { useGetAccountInfoLazyQuery } from '../../../../services/user/use-get-account-info-lazy-query'
import { AccountVerifiedAlert } from './account-verified-alert'

/**
 * Renders the "Erfolgreich verifiziert" alert
 * when the app gets into foreground and the
 * verification status changed from unverified to verified
 */
export const AccountVerifiedAlertHandler = () => {
  const sessionData = useSelector(getCdcSessionData)
  const isPending = isUserPending(sessionData)
  const regToken = sessionData?.regToken
  const appIsInForeground = useSelector(selectIsInForeground)
  const getAccountInfoLazyQuery = useGetAccountInfoLazyQuery()

  const [displayAlert, setDisplayAlert] = useState<boolean>(false)

  useEffect(() => {
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
        const { data } = await getAccountInfoLazyQuery(regToken)
        setDisplayAlert(data?.isVerified === true)
      } catch (_error: unknown) {}
    }

    updateVerificationStatus()
  }, [appIsInForeground, isPending, regToken, getAccountInfoLazyQuery])

  const onPressForwardToLogin = useCallback(async () => {
    setDisplayAlert(false)
  }, [])

  if (!displayAlert) {
    return null
  }

  return <AccountVerifiedAlert onDismiss={onPressForwardToLogin} />
}
