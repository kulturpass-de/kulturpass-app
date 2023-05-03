import React, { useCallback, useState } from 'react'

import { useModalNavigation } from '../../navigation/modal/hooks'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../theme/utils'
import { ForgotPasswordScreen } from './forgot-password-screen'
import { ForgotPasswordSuccessScreen } from './forgot-password-success-screen'
import { cdcApi } from '../../services/api/cdc-api'

export const ForgotPasswordRouteName = 'ForgotPassword'

export type ForgotPasswordRouteParams = undefined

export const ForgotPasswordRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const [showSuccess, setShowSuccess] = useState(false)
  const [accountsResetPasswordQuery] = cdcApi.endpoints.accountsResetPassword.useMutation()

  const onHeaderPressClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  const onToLogin = useCallback(() => {
    modalNavigation.navigate({ screen: 'LogIn' })
  }, [modalNavigation])

  const onFormSubmit = useCallback(
    async (loginID: string) => {
      await accountsResetPasswordQuery({ loginID }).unwrap()
      setShowSuccess(true)
    },
    [accountsResetPasswordQuery],
  )

  return showSuccess ? (
    <ForgotPasswordSuccessScreen onHeaderPressClose={onHeaderPressClose} onToLogin={onToLogin} />
  ) : (
    <ForgotPasswordScreen onHeaderPressClose={onHeaderPressClose} onFormSubmit={onFormSubmit} />
  )
}

export const ForgotPasswordRouteConfig = createRouteConfig({
  name: ForgotPasswordRouteName,
  component: ForgotPasswordRoute,
  options: { cardStyle: modalCardStyle },
})
