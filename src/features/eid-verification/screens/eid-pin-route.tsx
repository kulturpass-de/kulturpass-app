import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback, useState } from 'react'
import { EidParamList, EidScreenProps } from '../../../navigation/eid/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { eidAusweisApp2Service } from '../services/eid-ausweisapp2-service'
import { EidInsertCardRouteName } from './eid-insert-card-route'
import { EidPinScreen } from './eid-pin-screen'

export const EidPinRouteName = 'EidPin'

export type EidPinRouteParams = {
  retryCounter?: number
}

export type EidPinRouteProps = EidScreenProps<'EidPin'>

export const EidPinRoute: React.FC<EidPinRouteProps> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<EidParamList, 'EidCan'>>()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onNext = useCallback(
    (pin: string) => {
      navigation.replace(EidInsertCardRouteName, {
        flow: 'Auth',
        pin,
      })
    },
    [navigation],
  )

  const onChangePin = useCallback(async () => {
    setIsLoading(true)
    try {
      await eidAusweisApp2Service.cancelFlow()
    } finally {
      setIsLoading(false)
    }
    navigation.replace(EidInsertCardRouteName, {
      flow: 'ChangePin',
    })
  }, [navigation])

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={null} isLoading={isLoading} />
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <EidPinScreen
        retryCounter={route.params.retryCounter}
        onClose={onClose}
        onChangePin={onChangePin}
        onNext={onNext}
      />
    </>
  )
}

export const EidPinRouteConfig = createRouteConfig({
  name: EidPinRouteName,
  component: EidPinRoute,
  options: { cardStyle: modalCardStyle },
})
