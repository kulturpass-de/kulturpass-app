import React, { useCallback, useState } from 'react'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../theme/utils'
import { RegistrationPreferencesRouteConfig } from '../registration-preferences/registration-preferences-route'
import { CancelRegistrationAlert } from './cancel-registration-alert'
import { RegistrationFormScreen } from './registration-form-screen'

export const RegistrationFormRouteName = 'RegistrationForm'

export type RegistrationFormRouteParams = undefined

export const RegistrationFormRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)

  const onRegistrationFormClosingRequested = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  const onDismissAlert = useCallback(() => {
    setCancelAlertVisible(false)
  }, [])

  const onConfirmCancelation = useCallback(() => {
    setCancelAlertVisible(false)
    modalNavigation.closeModal()
  }, [modalNavigation])

  const afterRegister = useCallback(
    (regToken: string, firstName: string) => {
      modalNavigation.replace({ screen: RegistrationPreferencesRouteConfig.name, params: { regToken, firstName } })
    },
    [modalNavigation],
  )

  return (
    <>
      <CancelRegistrationAlert
        visible={cancelAlertVisible}
        onDismiss={onDismissAlert}
        onConfirmCancelation={onConfirmCancelation}
      />
      <RegistrationFormScreen onHeaderPressClose={onRegistrationFormClosingRequested} afterRegister={afterRegister} />
    </>
  )
}

export const RegistrationFormRouteConfig = createRouteConfig({
  name: RegistrationFormRouteName,
  component: RegistrationFormRoute,
  options: { cardStyle: modalCardStyle },
})
