import React, { useCallback, useState } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidAboutServiceProviderScreen } from './eid-about-service-provider-screen'
import { EidPinRouteName } from './eid-pin-route'
import { EidErrorAlert } from '../components/eid-error-alert'
import { AccessRightsMessage, CertificateMessage } from '@jolocom/react-native-ausweis/js/messageTypes'
import { ModalScreenProps } from '../../../navigation/modal/types'
import { EidServiceProviderDetailsRouteName } from './eid-service-provider-details-route'

export const EidAboutServiceProviderRouteName = 'EidAboutServiceProvider'

export type EidAboutServiceProviderRouteParams = {
  accessRights: AccessRightsMessage
  certificate: CertificateMessage
}

export type EidAboutServiceProviderRouteProps = ModalScreenProps<'EidAboutServiceProvider'>

export const EidAboutServiceProviderRoute: React.FC<EidAboutServiceProviderRouteProps> = ({ route }) => {
  const modalNavigation = useModalNavigation()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)

  const onNext = useCallback(() => {
    modalNavigation.navigate({
      screen: EidPinRouteName,
      params: {
        can: undefined,
      },
    })
  }, [modalNavigation])

  const onProviderDetails = useCallback(() => {
    modalNavigation.navigate({
      screen: EidServiceProviderDetailsRouteName,
      params: {
        certificate: route.params.certificate,
      },
    })
  }, [modalNavigation, route.params.certificate])

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={null} />
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <EidAboutServiceProviderScreen
        certificate={route.params.certificate}
        accessRights={route.params.accessRights}
        onProviderDetails={onProviderDetails}
        onNext={onNext}
        onClose={onClose}
      />
    </>
  )
}

export const EidAboutServiceProviderAppRouteConfig = createRouteConfig({
  name: EidAboutServiceProviderRouteName,
  component: EidAboutServiceProviderRoute,
  options: { cardStyle: modalCardStyle },
})
