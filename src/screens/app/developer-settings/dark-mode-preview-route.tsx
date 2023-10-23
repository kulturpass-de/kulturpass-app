import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { DarkModePreviewScreen } from './dark-mode-preview-screen'

export const DarkModePreviewRouteName = 'DarkModePreview'

export type DarkModePreviewRouteParams = undefined

export const DarkModePreviewRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onHeaderPressBack = useCallback(() => {
    modalNavigation.goBack()
  }, [modalNavigation])

  const onHeaderPressClose = useCallback(() => {
    modalNavigation.closeModal()
  }, [modalNavigation])

  return <DarkModePreviewScreen onHeaderPressBack={onHeaderPressBack} onHeaderPressClose={onHeaderPressClose} />
}

export const DarkModePreviewRouteConfig = createRouteConfig({
  name: DarkModePreviewRouteName,
  component: DarkModePreviewRoute,
  options: { cardStyle: modalCardStyle },
})
