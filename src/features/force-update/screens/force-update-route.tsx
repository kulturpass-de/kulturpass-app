import React, { useEffect } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { ForceUpdateScreen } from './force-update-screen'

export const ForceUpdateRouteName = 'ForceUpdate'

export type ForceUpdateRouteParams = undefined

export const ForceUpdateRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  useEffect(() => {
    return modalNavigation.addListener('beforeRemove', e => {
      // Block every navigation from the force update screen
      e.preventDefault()
    })
  })

  return <ForceUpdateScreen />
}

export const ForceUpdateRouteConfig = createRouteConfig({
  name: ForceUpdateRouteName,
  component: ForceUpdateRoute,
  options: { cardStyle: modalCardStyle },
})
