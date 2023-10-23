import React, { useCallback, useState } from 'react'
import { CancelRegistrationPreferencesAlert } from '../../../features/registration/components/cancel-alert/cancel-registration-preferences-alert'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { RegistrationPreferencesScreen } from './registration-preferences-screen'
import { RegistrationSuccessRouteConfig } from './registration-success-route'

export const RegistrationPreferencesRouteName = 'RegistrationPreferences'

export type RegistrationPreferencesRouteParams = {
  regToken: string
  firstName: string
}

export type RegistrationPreferencesRouteProps = ModalScreenProps<'RegistrationPreferences'>

export const RegistrationPreferencesRoute: React.FC<RegistrationPreferencesRouteProps> = props => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)
  const { regToken } = props.route.params

  const navigateToSuccessScreen = useCallback(() => {
    modalNavigation.navigate({
      screen: RegistrationSuccessRouteConfig.name,
    })
  }, [modalNavigation])

  const afterSubmitTriggered = useCallback(() => {
    navigateToSuccessScreen()
  }, [navigateToSuccessScreen])

  const onPressClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  const onDismissAlert = useCallback(() => {
    setCancelAlertVisible(false)
  }, [])

  const onConfirmCancelation = useCallback(() => {
    setCancelAlertVisible(false)
    navigateToSuccessScreen()
  }, [navigateToSuccessScreen])

  return (
    <>
      <CancelRegistrationPreferencesAlert
        visible={cancelAlertVisible}
        onDismiss={onDismissAlert}
        onConfirmCancelation={onConfirmCancelation}
      />
      <RegistrationPreferencesScreen
        regToken={regToken}
        afterSubmitTriggered={afterSubmitTriggered}
        onPressClose={onPressClose}
      />
    </>
  )
}

export const RegistrationPreferencesRouteConfig = createRouteConfig({
  name: RegistrationPreferencesRouteName,
  component: RegistrationPreferencesRoute,
})
