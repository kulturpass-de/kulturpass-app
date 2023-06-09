import React, { useCallback, useState } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidNewPinRouteName } from './eid-new-pin-route'
import { EidTransportPinScreen } from './eid-transport-pin-screen'

export const EidTransportPinRouteName = 'EidTransportPin'

export type EidTransportPinRouteParams = {
  retryCounter?: number
}

export type EidTransportPinRouteProps = ModalScreenProps<'EidTransportPin'>

export const EidTransportPinRoute: React.FC<EidTransportPinRouteProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)

  const onNext = useCallback(
    (pin: string) => {
      modalNavigation.navigate({
        screen: EidNewPinRouteName,
        params: {
          pin,
        },
      })
    },
    [modalNavigation],
  )

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={null} />
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <EidTransportPinScreen retryCounter={route.params.retryCounter} onClose={onClose} onNext={onNext} />
    </>
  )
}

export const EidTransportPinRouteConfig = createRouteConfig({
  name: EidTransportPinRouteName,
  component: EidTransportPinRoute,
  options: { cardStyle: modalCardStyle },
})
