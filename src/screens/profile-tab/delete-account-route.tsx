import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { DeleteAccountScreen } from './delete-account-screen'

export const DeleteAccountRouteName = 'DeleteAccount'

export type DeleteAccountRouteParams = undefined

export const DeleteAccountRoute: React.FC = () => {
  const navigation = useNavigation()
  return <DeleteAccountScreen onPressBackButton={navigation.goBack} />
}

export const DeleteAccountRouteConfig = createRouteConfig({
  name: DeleteAccountRouteName,
  component: DeleteAccountRoute,
})
