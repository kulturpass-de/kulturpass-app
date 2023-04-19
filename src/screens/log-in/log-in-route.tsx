import React, { useCallback } from 'react'

import { useModalNavigation } from '../../navigation/modal/hooks'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { useAuth } from '../../services/auth/use-auth'
import { modalCardStyle } from '../../theme/utils'
import { LogInScreen } from './log-in-screen'

export const LogInRouteName = 'LogIn'

export type LogInRouteParams = undefined

export const LogInRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const auth = useAuth()

  const afterClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  const onLoginSuccess = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  const afterLogin = useCallback(
    async (loginData: { email: string; password: string }) => {
      const { email, password } = loginData
      await auth.login({ loginId: email, password })
      onLoginSuccess()
    },
    [auth, onLoginSuccess],
  )

  const afterRegister = useCallback(() => {
    modalNavigation.navigate({ screen: 'RegistrationConsent' })
  }, [modalNavigation])

  const afterForgotPassword = useCallback(() => {
    modalNavigation.navigate({ screen: 'ForgotPassword' })
  }, [modalNavigation])

  return (
    <LogInScreen
      afterLogin={afterLogin}
      afterClose={afterClose}
      afterRegister={afterRegister}
      afterForgotPassword={afterForgotPassword}
      onLoginSuccess={onLoginSuccess}
    />
  )
}

export const LogInRouteConfig = createRouteConfig({
  name: LogInRouteName,
  component: LogInRoute,
  options: { cardStyle: modalCardStyle },
})
