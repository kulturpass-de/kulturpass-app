import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { EidParamList, EidScreenProps } from '../../../navigation/eid/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidInsertCardRouteName } from './eid-insert-card-route'
import { EidNewPinScreen } from './eid-new-pin-screen'

export const EidNewPinRouteName = 'EidNewPin'

export type EidNewPinRouteParams = {
  pin: string
  can?: string
}

export type EidNewPinRouteProps = EidScreenProps<'EidNewPin'>

export const EidNewPinRoute: React.FC<EidNewPinRouteProps> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<EidParamList, 'EidNewPin'>>()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)

  const onNext = useCallback(
    (newPin: string) => {
      navigation.navigate(EidInsertCardRouteName, {
        flow: 'ChangePin',
        pin: route.params.pin,
        newPin,
        can: route.params.can,
      })
    },
    [navigation, route.params.can, route.params.pin],
  )

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={null} />
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <EidNewPinScreen onClose={onClose} onNext={onNext} />
    </>
  )
}

export const EidNewPinRouteConfig = createRouteConfig({
  name: EidNewPinRouteName,
  component: EidNewPinRoute,
  options: { cardStyle: modalCardStyle },
})
