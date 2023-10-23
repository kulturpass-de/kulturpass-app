import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { EidParamList, EidScreenProps } from '../../../navigation/eid/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
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

export type ProfileScreenProps = EidScreenProps<'EidInsertCard'>

export const EidInsertCardRoute: React.FC<ProfileScreenProps> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<EidParamList, 'EidInsertCard'>>()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)
  const [errorModalVisible, setErrorModalVisible] = useState(false)
  const [visibleError, setVisibleError] = useState<ErrorWithCode | null>(null)
  const flow = route.params.flow

  const onAuthSuccess = useCallback(() => {
    navigation.replace(EidVerificationCompletionRouteName)
  }, [navigation])

  const onChangePinSuccess = useCallback(() => {
    navigation.replace(EidChangePinCompletionRouteName)
  }, [navigation])

  const onPinRetry = useCallback(
    (retryCounter?: number) => {
      navigation.replace(flow === 'Auth' ? EidPinRouteName : EidTransportPinRouteName, {
        retryCounter,
      })
    },
    [flow, navigation],
  )

  const onCanRetry = useCallback(
    (retry: boolean) => {
      navigation.replace(EidCanRouteName, {
        flow,
        retry,
      })
    },
    [flow, navigation],
  )

  const onPukRetry = useCallback(
    (retry: boolean) => {
      navigation.replace(EidPukRouteName, {
        flow,
        retry,
      })
    },
    [flow, navigation],
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
