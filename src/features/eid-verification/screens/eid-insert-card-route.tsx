import React, { useCallback, useState } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { ErrorWithCode } from '../../../services/errors/errors'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { Flow } from '../types'
import { EidCanRouteName } from './eid-can-route'
import { EidChangePinCompletionRouteName } from './eid-change-pin-completion-route'
import { EidInsertCardScreen } from './eid-insert-card-screen'
import { EidPinRouteName } from './eid-pin-route'
import { EidPukRouteName } from './eid-puk-route'
import { EidTransportPinRouteName } from './eid-transport-pin-route'
import { EidVerificationCompletionRouteName } from './eid-verification-completion-route'

export const EidInsertCardRouteName = 'EidInsertCard'

export type EidInsertCardRouteParams = {
  flow: Flow
  pin?: string
  puk?: string
  newPin?: string
  can?: string
}

export type ProfileScreenProps = ModalScreenProps<'EidInsertCard'>

export const EidInsertCardRoute: React.FC<ProfileScreenProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [visibleError, setVisibleError] = useState<ErrorWithCode | null>(null)
  const flow = route.params.flow

  const onAuthSuccess = useCallback(() => {
    modalNavigation.replace({
      screen: EidVerificationCompletionRouteName,
    })
  }, [modalNavigation])

  const onChangePinSuccess = useCallback(() => {
    modalNavigation.replace({
      screen: EidChangePinCompletionRouteName,
    })
  }, [modalNavigation])

  const onPinRetry = useCallback(
    (retryCounter?: number) => {
      modalNavigation.replace({
        screen: flow === 'Auth' ? EidPinRouteName : EidTransportPinRouteName,
        params: {
          retryCounter,
        },
      })
    },
    [flow, modalNavigation],
  )

  const onCanRetry = useCallback(
    (retry: boolean) => {
      modalNavigation.replace({
        screen: EidCanRouteName,
        params: {
          flow,
          retry,
        },
      })
    },
    [flow, modalNavigation],
  )

  const onPukRetry = useCallback(
    (retry: boolean) => {
      modalNavigation.replace({
        screen: EidPukRouteName,
        params: {
          flow,
          retry,
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
      <EidErrorAlert
        error={visibleError}
        onModalIsVisible={setErrorModalVisible}
        cancelEidFlowAlertVisible={cancelAlertVisible}
        handleUserCancellation={true}
      />
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <EidInsertCardScreen
        flow={flow}
        pin={route.params.pin}
        newPin={route.params.newPin}
        can={route.params.can}
        puk={route.params.puk}
        errorModalVisible={errorModalVisible}
        onAuthSuccess={onAuthSuccess}
        onPinRetry={onPinRetry}
        onChangePinSuccess={onChangePinSuccess}
        onCanRetry={onCanRetry}
        onPukRetry={onPukRetry}
        onClose={onClose}
        onError={setVisibleError}
      />
    </>
  )
}

export const EidInsertCardRouteConfig = createRouteConfig({
  name: EidInsertCardRouteName,
  component: EidInsertCardRoute,
  options: { cardStyle: modalCardStyle },
})
