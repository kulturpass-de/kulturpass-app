import React, { useEffect } from 'react'
import { useModalNavigation } from '../../navigation/modal/hooks'
import { createRouteConfig } from '../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../theme/utils'
import { EndOfLifeScreen } from './end-of-life-screen'

export const EndOfLifeRouteName = 'EndOfLife'

export type EndOfLifeRouteParams = undefined

export const EndOfLifeRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  useEffect(() => {
    return modalNavigation.addListener('beforeRemove', e => {
      // Block every navigation from the end of life screen
      e.preventDefault()
    })
  })

  return <EndOfLifeScreen />
}

export const EndOfLifeRouteConfig = createRouteConfig({
  name: EndOfLifeRouteName,
  component: EndOfLifeRoute,
  options: { cardStyle: modalCardStyle },
})
