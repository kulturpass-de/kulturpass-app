import React, { useCallback, useState } from 'react'

import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidInsertCardRouteName } from './eid-insert-card-route'
import { EidPinScreen } from './eid-pin-screen'
import { EidErrorAlert } from '../components/eid-error-alert'
import { aa2Module } from '@jolocom/react-native-ausweis'
import { EidTransportPinRouteName } from './eid-transport-pin-route'

export const EidPinRouteName = 'EidPin'

export type EidPinRouteParams = {
  can?: string
  retryCounter?: number
}

export type EidPinRouteProps = ModalScreenProps<'EidPin'>

export const EidPinRoute: React.FC<EidPinRouteProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)

  const onNext = useCallback(
    (pin: string) => {
      modalNavigation.navigate({
        screen: EidInsertCardRouteName,
        params: {
          flow: 'Auth',
          pin,
          can: route.params.can,
        },
      })
    },
    [modalNavigation, route.params.can],
  )

  const onChangePin = useCallback(async () => {
    await aa2Module.cancelFlow()
    modalNavigation.navigate({
      screen: EidTransportPinRouteName,
      params: {},
    })
  }, [modalNavigation])

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={null} />
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

export const EidPinAppRouteConfig = createRouteConfig({
  name: EidPinRouteName,
  component: EidPinRoute,
  options: { cardStyle: modalCardStyle },
})
