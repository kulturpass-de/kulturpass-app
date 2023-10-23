import React, { useCallback, useState } from 'react'
import { CancelRegistrationAlert } from '../../../features/registration/components/cancel-alert/cancel-registration-alert'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { RegistrationFormScreen } from './registration-form-screen'
import { RegistrationPreferencesRouteConfig } from './registration-preferences-route'

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
