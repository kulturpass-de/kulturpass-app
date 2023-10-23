import React, { useCallback, useState } from 'react'
import { Linking } from 'react-native'
import { useDispatch } from 'react-redux'
import { LoadingIndicator } from '../components/loading-indicator/loading-indicator'
import { useNavigateToPDP } from '../features/spartacus-webview/hooks/use-navigate-to-pdp'
import { rootNavigationRef } from '../navigation/navigation-container'
import { RegistrationFinishedRouteName } from '../screens/account/registration/registration-finished-route'
import { authFinalizeRegistration } from '../services/auth/store/thunks/auth-finalize-registration'
import { useEnvironmentConfiguration } from '../services/environment-configuration/hooks/use-environment-configuration'
import { ErrorAlertManager } from '../services/errors/error-alert-provider'
import { ErrorWithCode, UnknownError } from '../services/errors/errors'
import { logger } from '../services/logger'
import { AppDispatch } from '../services/redux/configure-store'
import { useOnDeepLink } from '../utils/links/hooks/use-on-deep-link'

export const DeeplinkHandler: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const navigateToPDP = useNavigateToPDP()

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

        if (url.pathname.startsWith('/product/')) {
          navigateToPDP({ url: url.href })
        } else if (url.pathname.startsWith('/redirect/email-verification')) {
          await dispatch(authFinalizeRegistration({ url })).unwrap()
          rootNavigationRef.navigate('Modal', { screen: RegistrationFinishedRouteName })
        } else {
          await Linking.openURL(url.href)
        }
      } catch (error: unknown) {
        if (error instanceof ErrorWithCode) {
          ErrorAlertManager.current?.showError(error)
        } else {
          logger.warn('deeplink handler error cannot be interpreted', JSON.stringify(error))
          ErrorAlertManager.current?.showError(new UnknownError('Deeplink Handler'))
        }
      } finally {
        setLoading(false)
      }
    },
    [dispatch, homeUrl, navigateToPDP],
  )

  useOnDeepLink(onDeepLink)

  return (
    <>
      <LoadingIndicator loading={loading} />
    </>
  )
}
