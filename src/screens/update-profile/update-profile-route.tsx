import React, { useCallback } from 'react'
import { useTabsNavigation } from '../../navigation/tabs/hooks'
import { SettingsScreenProps } from '../../navigation/tabs/settings/types'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { UpdateProfileScreen } from './update-profile-screen'

export const UpdateProfileRouteName = 'UpdateProfile'

export type UpdateProfileRouteParams = undefined

export type UpdateProfileRouteProps = SettingsScreenProps<'UpdateProfile'>

export const UpdateProfileRoute: React.FC<UpdateProfileRouteProps> = () => {
  const tabsNavigation = useTabsNavigation()

  const closeUpdateProfileScreen = useCallback(() => {
    tabsNavigation.goBack()
  }, [tabsNavigation])

  return <UpdateProfileScreen onHeaderPressClose={closeUpdateProfileScreen} afterUpdate={closeUpdateProfileScreen} />
}

export const UpdateProfileRouteConfig = createRouteConfig({
  name: UpdateProfileRouteName,
  component: UpdateProfileRoute,
})
