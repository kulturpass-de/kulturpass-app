import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { NotificationsScreen } from './notifications-screen'

export const NotificationsRouteName = 'Notifications'

export type NotificationsRouteParams = undefined

export const NotificationsRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onHeaderPressBack = useCallback(() => {
    modalNavigation.goBack()
  }, [modalNavigation])

  const onHeaderPressClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  return <NotificationsScreen onHeaderPressBack={onHeaderPressBack} onHeaderPressClose={onHeaderPressClose} />
}

export const NotificationsRouteConfig = createRouteConfig({
  name: NotificationsRouteName,
  component: NotificationsRoute,
  options: { cardStyle: modalCardStyle },
})
