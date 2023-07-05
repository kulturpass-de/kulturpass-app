import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useCancelFlow } from '../hooks/use-cancel-flow'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidPukInoperativeScreen } from './eid-puk-inoperative-screen'

export const EidPukInoperativeRouteName = 'EidPukInoperative'

export type EidPukInoperativeRouteParams = undefined

export const EidPukInoperativeRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const cancelFlow = useCancelFlow()

  const onClose = useCallback(async () => {
    await cancelFlow()
    modalNavigation.closeModal()
  }, [cancelFlow, modalNavigation])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={null} />
      <EidPukInoperativeScreen onClose={onClose} />
    </>
  )
}

export const EidPukInoperativeRouteConfig = createRouteConfig({
  name: EidPukInoperativeRouteName,
  component: EidPukInoperativeRoute,
  options: { cardStyle: modalCardStyle },
})
