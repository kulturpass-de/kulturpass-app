import React, { useCallback, useState } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidCanRouteName } from './eid-can-route'
import { EidInsertCardScreen } from './eid-insert-card-screen'
import { EidPinRouteName } from './eid-pin-route'
import { EidVerificationCompletionRouteName } from './eid-verification-completion-route'
import { EidErrorAlert } from '../components/eid-error-alert'
import { EidTransportPinRouteName } from './eid-transport-pin-route'
import { Flow } from '../types'
import { EidChangePinCompletionRouteName } from './eid-change-pin-completion-route'

export const EidInsertCardRouteName = 'EidInsertCard'

export type EidInsertCardRouteParams = {
  flow: Flow
  pin: string
  newPin?: string
  can?: string
}

export type ProfileScreenProps = ModalScreenProps<'EidInsertCard'>

export const EidInsertCardRoute: React.FC<ProfileScreenProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)
  const flow = route.params.flow

  const onAuthSuccess = useCallback(() => {
    modalNavigation.navigate({
      screen: EidVerificationCompletionRouteName,
    })
  }, [modalNavigation])

  const onChangePinSuccess = useCallback(() => {
    modalNavigation.navigate({
      screen: EidChangePinCompletionRouteName,
    })
  }, [modalNavigation])

  const onPinRetry = useCallback(
    (retryCounter?: number) => {
      modalNavigation.navigate({
        screen: flow === 'Auth' ? EidPinRouteName : EidTransportPinRouteName,
        params: {
          can: undefined,
          retryCounter,
        },
      })
    },
    [flow, modalNavigation],
  )

  const onCanRetry = useCallback(() => {
    modalNavigation.navigate({
      screen: EidCanRouteName,
      params: {
        flow,
      },
    })
  }, [flow, modalNavigation])

  const onPukRetry = useCallback(() => {
    // TODO: Add Puk Route
    // modalNavigation.navigate({
    //   screen: EidPukRouteName,
    // })
  }, [])

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={null} />
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <EidInsertCardScreen
        flow={flow}
        pin={route.params.pin}
        newPin={route.params.newPin}
        can={route.params.can}
        onAuthSuccess={onAuthSuccess}
        onPinRetry={onPinRetry}
        onChangePinSuccess={onChangePinSuccess}
        onCanRetry={onCanRetry}
        onPukRetry={onPukRetry}
        onClose={onClose}
      />
    </>
  )
}

export const EidInsertCardAppRouteConfig = createRouteConfig({
  name: EidInsertCardRouteName,
  component: EidInsertCardRoute,
  options: { cardStyle: modalCardStyle },
})
