import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidNFCNotSupportedScreen } from './eid-nfc-not-supported-screen'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useCancelFlow } from '../hooks/use-cancel-flow'

export const EidNFCNotSupportedRouteName = 'EidNFCNotSupported'

export type EidNFCNotSupportedRouteParams = undefined

export const EidNFCNotSupportedRoute: React.FC = () => {
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
      <EidNFCNotSupportedScreen onClose={onClose} />
    </>
  )
}

export const EidNFCNotSupportedAppRouteConfig = createRouteConfig({
  name: EidNFCNotSupportedRouteName,
  component: EidNFCNotSupportedRoute,
  options: { cardStyle: modalCardStyle },
})
