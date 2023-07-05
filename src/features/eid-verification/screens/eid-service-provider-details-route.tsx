import { Certificate } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useCallback, useState } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidServiceProviderDetailsScreen } from './eid-service-provider-details-screen'

export const EidServiceProviderDetailsRouteName = 'EidServiceProviderDetails'

export type EidServiceProviderDetailsRouteParams = {
  certificate: Certificate
}

export type EidServiceProviderDetailsRouteProps = ModalScreenProps<'EidServiceProviderDetails'>

export const EidServiceProviderDetailsRoute: React.FC<EidServiceProviderDetailsRouteProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)

  const onBack = useCallback(() => {
    modalNavigation.goBack()
  }, [modalNavigation])

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose, false)

  return (
    <>
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <EidServiceProviderDetailsScreen certificate={route.params.certificate} onBack={onBack} onClose={onClose} />
    </>
  )
}

export const EidServiceProviderDetailsRouteConfig = createRouteConfig({
  name: EidServiceProviderDetailsRouteName,
  component: EidServiceProviderDetailsRoute,
  options: { cardStyle: modalCardStyle },
})
