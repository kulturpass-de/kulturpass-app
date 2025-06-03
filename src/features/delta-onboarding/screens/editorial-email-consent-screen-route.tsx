import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { EditorialEmailConsentScreen } from './editorial-email-consent-screen'

export const EditorialEmailConsentScreenRouteName = 'EditorialEmailConsentScreen'

export type EditorialEmailConsentScreenRouteParams = undefined

export type EditorialEmailConsentScreenRouteStackParams = {
  EditorialEmailConsentScreen: undefined
}

const EditorialEmailConsentScreenRoute: React.FC = () => {
  const navigation = useNavigation()
  const goBack = useCallback(() => {
    navigation.goBack()
  }, [navigation])

  return <EditorialEmailConsentScreen screenKey="editorial_email_consent_modal" goBack={goBack} />
}

export const EditorialEmailConsentScreenRouteConfig = createRouteConfig({
  name: EditorialEmailConsentScreenRouteName,
  component: EditorialEmailConsentScreenRoute,
})
