import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AccessRights, Certificate } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useCallback, useState } from 'react'
import { EidParamList } from '../../../navigation/eid/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { ErrorWithCode } from '../../../services/errors/errors'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { useInitAA2Sdk } from '../hooks/use-init-aa2-sdk'
import { useStartAA2Auth } from '../hooks/use-start-aa2-auth'
import { EidAboutServiceProviderRouteName } from './eid-about-service-provider-route'
import { EidAboutVerificationScreen } from './eid-about-verification-screen'
import { EidNFCNotSupportedRouteName } from './eid-nfc-not-supported-route'

export const EidAboutVerificationRouteName = 'EidAboutVerification'

export type EidAboutVerificationRouteParams = undefined

export const EidAboutVerificationRoute: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<EidParamList, 'EidAboutVerification'>>()
  const [visibleError, setVisibleError] = useState<ErrorWithCode | null>(null)
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)

  const onNext = useCallback(
    (accessRights: AccessRights, certificate: Certificate) => {
      navigation.replace(EidAboutServiceProviderRouteName, {
        certificate,
        accessRights,
      })
    },
    [navigation],
  )

  const onNFCNotSupported = useCallback(() => {
    navigation.replace(EidNFCNotSupportedRouteName)
  }, [navigation])

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  const onError = useCallback((error: ErrorWithCode) => {
    setVisibleError(error)
  }, [])

  const { isLoading: initLoading } = useInitAA2Sdk(onError)

  const { isLoading: startAuthLoading, startAuth } = useStartAA2Auth(onNext, onNFCNotSupported, onError)

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={visibleError} isLoading={initLoading || startAuthLoading} />
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <EidAboutVerificationScreen onClose={onClose} startAuth={startAuth} isLoading={initLoading || startAuthLoading} />
    </>
  )
}

export const EidAboutVerificationRouteConfig = createRouteConfig({
  name: EidAboutVerificationRouteName,
  component: EidAboutVerificationRoute,
  options: { cardStyle: modalCardStyle },
})
