import React, { useCallback } from 'react'

import { createRouteConfig } from '../../navigation/utils/createRouteConfig'
import { UpdateProfileScreen } from './update-profile-screen'
import { SettingsScreenProps } from '../../navigation/tabs/settings/types'
import { useTabsNavigation } from '../../navigation/tabs/hooks'

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
