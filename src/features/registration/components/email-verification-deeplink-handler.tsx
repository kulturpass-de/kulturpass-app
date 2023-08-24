import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { rootNavigationRef } from '../../../navigation/navigation-container'
import { authFinalizeRegistration } from '../../../services/auth/store/thunks/auth-finalize-registration'
import { useEnvironmentConfiguration } from '../../../services/environment-configuration/hooks/use-environment-configuration'
import { ErrorAlertManager } from '../../../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { AppDispatch } from '../../../services/redux/configure-store'
import { useOnDeepLink } from '../../../utils/links/hooks/use-on-deep-link'
import { RegistrationFinishedRouteName } from '../screens/registration-finished-route'

export const EmailVerificationDeeplinkHandler: React.FC = () => {
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch<AppDispatch>()

  const homeUrl = useEnvironmentConfiguration().commerce.homeUrl

  const onDeepLink = useCallback(
    async (url: URL) => {
      setLoading(true)
      try {
        const homeUrlOrigin = new URL(homeUrl).origin
        if (url.origin !== homeUrlOrigin) {
          logger.warn('Deeplink origin not matching current environment configuration')
          return
        }

        await dispatch(authFinalizeRegistration({ url })).unwrap()

        rootNavigationRef.navigate('Modal', { screen: RegistrationFinishedRouteName })
      } catch (error: unknown) {
        if (error instanceof ErrorWithCode) {
          ErrorAlertManager.current?.showError(error)
        } else {
          ErrorAlertManager.current?.showError(new UnknownError())
        }
      } finally {
        setLoading(false)
      }
    },
    [dispatch, homeUrl],
  )

  useOnDeepLink(onDeepLink)

  return (
    <>
      <LoadingIndicator loading={loading} />
    </>
  )
}
