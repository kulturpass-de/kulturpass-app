import React, { useCallback, useState } from 'react'

import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidInsertCardRouteName } from './eid-insert-card-route'
import { EidPinScreen } from './eid-pin-screen'
import { EidTransportPinRouteName } from './eid-transport-pin-route'
import { AA2CommandService } from '@sap/react-native-ausweisapp2-wrapper'
import { LoadingIndicator } from '../../../components/loading-indicator/loading-indicator'
import { EidErrorAlert } from '../components/eid-error-alert'
import { AA2_TIMEOUTS } from '../eid-command-timeouts'

export const EidPinRouteName = 'EidPin'

export type EidPinRouteParams = {
  retryCounter?: number
}

export type EidPinRouteProps = ModalScreenProps<'EidPin'>

export const EidPinRoute: React.FC<EidPinRouteProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onNext = useCallback(
    (pin: string) => {
      modalNavigation.navigate({
        screen: EidInsertCardRouteName,
        params: {
          flow: 'Auth',
          pin,
        },
      })
    },
    [modalNavigation],
  )

  const onChangePin = useCallback(async () => {
    setIsLoading(true)
    try {
      await AA2CommandService.cancel({ msTimeout: AA2_TIMEOUTS.CANCEL })
    } catch {
      // Will be handled by error EidErrorAlert
    } finally {
      setIsLoading(false)
    }
    modalNavigation.navigate({
      screen: EidTransportPinRouteName,
      params: {
        retryCounter: route.params.retryCounter,
      },
    })
  }, [modalNavigation, route.params.retryCounter])

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={null} />
      <LoadingIndicator loading={isLoading} />
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
