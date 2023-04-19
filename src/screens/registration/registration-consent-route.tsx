import React, { useCallback } from 'react'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../theme/utils'
import { RegistrationConsentScreen } from './registration-consent-screen'
import { RegistrationDataPrivacyRouteConfig } from './registration-data-privacy-route'

export const RegistrationConsentRouteName = 'RegistrationConsent'

export type RegistrationConsentRouteParams = undefined

export const RegistrationConsentRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onHeaderPressClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  const onPressContinue = useCallback(async () => {
    modalNavigation.navigate({
      screen: RegistrationDataPrivacyRouteConfig.name,
    })
  }, [modalNavigation])

  return <RegistrationConsentScreen onHeaderPressClose={onHeaderPressClose} onPressContinue={onPressContinue} />
}

export const RegistrationConsentRouteConfig = createRouteConfig({
  name: RegistrationConsentRouteName,
  component: RegistrationConsentRoute,
  options: { cardStyle: modalCardStyle },
})
