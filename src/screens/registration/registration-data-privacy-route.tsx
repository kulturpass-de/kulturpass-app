import React, { useCallback } from 'react'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../theme/utils'
import { RegistrationDataPrivacyScreen } from './registration-data-privacy-screen'
import { RegistrationFormRouteConfig } from './registration-form-route'

export const RegistrationDataPrivacyRouteName = 'RegistrationDataPrivacy'

export type RegistrationDataPrivacyRouteParams = undefined

export const RegistrationDataPrivacyRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onHeaderPressClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  const onPressContinue = useCallback(async () => {
    modalNavigation.navigate({
      screen: RegistrationFormRouteConfig.name,
    })
  }, [modalNavigation])

  const onCancelRegistration = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  return (
    <RegistrationDataPrivacyScreen
      onHeaderClose={onHeaderPressClose}
      onContinue={onPressContinue}
      onCancelRegistration={onCancelRegistration}
    />
  )
}

export const RegistrationDataPrivacyRouteConfig = createRouteConfig({
  name: RegistrationDataPrivacyRouteName,
  component: RegistrationDataPrivacyRoute,
  options: { cardStyle: modalCardStyle },
})
