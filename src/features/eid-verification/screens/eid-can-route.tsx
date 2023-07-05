import React, { useCallback, useState } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { Flow } from '../types'
import { EidCanScreen } from './eid-can-screen'
import { EidInsertCardRouteName } from './eid-insert-card-route'

export const EidCanRouteName = 'EidCan'

export type EidCanRouteParams = {
  flow: Flow
  retry: boolean
}

export type EidCanRouteProps = ModalScreenProps<'EidCan'>

export const EidCanRoute: React.FC<EidCanRouteProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)
  const flow = route.params.flow

  const onNext = useCallback(
    (can: string) => {
      modalNavigation.navigate({
        screen: EidInsertCardRouteName,
        params: {
          flow,
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
      <EidCanScreen onClose={onClose} onNext={onNext} retry={route.params.retry} />
    </>
  )
}

export const EidCanRouteConfig = createRouteConfig({
  name: EidCanRouteName,
  component: EidCanRoute,
  options: { cardStyle: modalCardStyle },
})
