import React, { useCallback, useState } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidPukScreen } from './eid-puk-screen'
import { EidErrorAlert } from '../components/eid-error-alert'
import { Flow } from '../types'
import { EidInsertCardRouteName } from './eid-insert-card-route'

export const EidPukRouteName = 'EidPuk'

export type EidPukRouteParams = {
  flow: Flow
  retry: boolean
}

export type EidPukRouteProps = ModalScreenProps<'EidPuk'>

export const EidPukRoute: React.FC<EidPukRouteProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)
  const flow = route.params.flow

  const onNext = useCallback(
    (puk: string) => {
      modalNavigation.navigate({
        screen: EidInsertCardRouteName,
        params: {
          flow,
          puk,
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
      <EidPukScreen onClose={onClose} onNext={onNext} retry={route.params.retry} />
    </>
  )
}

export const EidPukRouteConfig = createRouteConfig({
  name: EidPukRouteName,
  component: EidPukRoute,
  options: { cardStyle: modalCardStyle },
})
