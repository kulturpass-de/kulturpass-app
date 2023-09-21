import React, { useCallback } from 'react'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useCloseFlow } from '../hooks/use-close-flow'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidPukInoperativeScreen } from './eid-puk-inoperative-screen'

export const EidPukInoperativeRouteName = 'EidPukInoperative'

export type EidPukInoperativeRouteParams = undefined

export const EidPukInoperativeRoute: React.FC = () => {
  const { closeFlow } = useCloseFlow()

  const onClose = useCallback(async () => {
    await closeFlow()
  }, [closeFlow])

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
