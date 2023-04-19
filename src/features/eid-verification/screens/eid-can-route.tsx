import React, { useCallback, useState } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidCanScreen } from './eid-can-screen'
import { EidPinRouteName } from './eid-pin-route'
import { EidErrorAlert } from '../components/eid-error-alert'
import { EidTransportPinRouteName } from './eid-transport-pin-route'
import { Flow } from '../types'

export const EidCanRouteName = 'EidCan'

export type EidCanRouteParams = {
  flow: Flow
}

export type EidCanRouteProps = ModalScreenProps<'EidCan'>

export const EidCanRoute: React.FC<EidCanRouteProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)
  const flow = route.params.flow

  const onNext = useCallback(
    (can: string) => {
      modalNavigation.navigate({
        screen: flow === 'Auth' ? EidPinRouteName : EidTransportPinRouteName,
        params: {
          // coming from the can screen, the user has only one more try
          retryCounter: 1,
          can,
        },
      })
    },
    [flow, modalNavigation],
  )

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={null} />
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <EidCanScreen onClose={onClose} onNext={onNext} />
    </>
  )
}

export const EidCanAppRouteConfig = createRouteConfig({
  name: EidCanRouteName,
  component: EidCanRoute,
  options: { cardStyle: modalCardStyle },
})
