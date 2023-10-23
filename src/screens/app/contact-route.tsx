import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { ContactScreen } from './contact-screen'

export const ContactRouteName = 'Contact'

export type ContactRouteParams = undefined

export const ContactRoute: React.FC = () => {
  const navigation = useNavigation()
  return <ContactScreen onPressBackButton={navigation.goBack} />
}

export const ContactRouteConfig = createRouteConfig({
  name: ContactRouteName,
  component: ContactRoute,
})
