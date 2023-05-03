import React, { useCallback } from 'react'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { AccountDeletionSuccessfulScreen } from './account-deletion-successful-screen'
import { useTabsNavigation } from '../../../navigation/tabs/hooks'

export const AccountDeletionSuccessfulRouteName = 'AccountDeletionSuccessful'

export type AccountDeletionSuccessfulRouteParams = undefined

export const AccountDeletionSuccessfulRoute: React.FC = () => {
  const tabNavigation = useTabsNavigation()

  const onClose = useCallback(() => {
    tabNavigation.navigate('Settings', {
      screen: 'ViewProfile',
    })
  }, [tabNavigation])

  return <AccountDeletionSuccessfulScreen onClose={onClose} />
}

export const AccountDeletionSuccessfulRouteConfig = createRouteConfig({
  name: AccountDeletionSuccessfulRouteName,
  component: AccountDeletionSuccessfulRoute,
  options: { cardStyle: modalCardStyle },
})
