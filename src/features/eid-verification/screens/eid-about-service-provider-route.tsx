import { useNavigation } from '@react-navigation/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { AccessRights, Certificate } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useCallback, useState } from 'react'
import { EidParamList, EidScreenProps } from '../../../navigation/eid/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidAboutServiceProviderScreen } from './eid-about-service-provider-screen'
import { EidInsertCardRouteName } from './eid-insert-card-route'
import { EidServiceProviderDetailsRouteName } from './eid-service-provider-details-route'

export const EidAboutServiceProviderRouteName = 'EidAboutServiceProvider'

export type EidAboutServiceProviderRouteParams = {
  accessRights: AccessRights
  certificate: Certificate
}

export type EidAboutServiceProviderRouteProps = EidScreenProps<'EidAboutServiceProvider'>

export const EidAboutServiceProviderRoute: React.FC<EidAboutServiceProviderRouteProps> = ({ route }) => {
  const navigation = useNavigation<StackNavigationProp<EidParamList, 'EidAboutServiceProvider'>>()
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)

  const onNext = useCallback(() => {
    navigation.replace(EidInsertCardRouteName, {
      flow: 'Auth',
    })
  }, [navigation])

  const onProviderDetails = useCallback(() => {
    navigation.navigate(EidServiceProviderDetailsRouteName, {
      certificate: route.params.certificate,
    })
  }, [navigation, route.params.certificate])

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

export const EidAboutServiceProviderRouteConfig = createRouteConfig({
  name: EidAboutServiceProviderRouteName,
  component: EidAboutServiceProviderRoute,
  options: { cardStyle: modalCardStyle },
})
