import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { EidParamList, EidScreenProps } from '../../../navigation/eid/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
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

export type EidTransportPinRouteProps = EidScreenProps<'EidTransportPin'>

export const EidTransportPinRoute: React.FC<EidTransportPinRouteProps> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<EidParamList, 'EidTransportPin'>>()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)

  const onNext = useCallback(
    (pin: string) => {
      navigation.replace(EidNewPinRouteName, {
        pin,
      })
    },
    [navigation],
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
