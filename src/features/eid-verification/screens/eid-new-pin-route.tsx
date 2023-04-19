import React, { useCallback, useState } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidNewPinScreen } from './eid-new-pin-screen'
import { EidInsertCardRouteName } from './eid-insert-card-route'
import { EidErrorAlert } from '../components/eid-error-alert'

export const EidNewPinRouteName = 'EidNewPin'

export type EidNewPinRouteParams = {
  pin: string
  can?: string
}

export type EidNewPinRouteProps = ModalScreenProps<'EidNewPin'>

export const EidNewPinRoute: React.FC<EidNewPinRouteProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setNewCancelAlertVisible] = useState(false)

  const onNext = useCallback(
    (newPin: string) => {
      modalNavigation.navigate({
        screen: EidInsertCardRouteName,
        params: {
          flow: 'ChangePin',
          pin: route.params.pin,
          newPin,
          can: route.params.can,
        },
      })
    },
    [modalNavigation, route.params.can, route.params.pin],
  )

  const onClose = useCallback(() => {
    setNewCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={null} />
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setNewCancelAlertVisible} />
      <EidNewPinScreen onClose={onClose} onNext={onNext} />
    </>
  )
}

export const EidNewPinAppRouteConfig = createRouteConfig({
  name: EidNewPinRouteName,
  component: EidNewPinRoute,
  options: { cardStyle: modalCardStyle },
})
