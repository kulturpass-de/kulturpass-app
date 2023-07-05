import { SerializedError } from '@reduxjs/toolkit'
import { AccessRights, Certificate } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useCallback, useState } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { modalCardStyle } from '../../../theme/utils'
import { CancelEidFlowAlert } from '../components/cancel-eid-flow-alert'
import { EidErrorAlert } from '../components/eid-error-alert'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidAboutServiceProviderRouteName } from './eid-about-service-provider-route'
import { EidAboutVerificationScreen } from './eid-about-verification-screen'
import { EidNFCNotSupportedRouteName } from './eid-nfc-not-supported-route'

export const EidAboutVerificationRouteName = 'EidAboutVerification'

export type EidAboutVerificationRouteParams = undefined

export const EidAboutVerificationRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const [visibleError, setVisibleError] = useState<ErrorWithCode | null>(null)
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false)

  const onNext = useCallback(
    (accessRights: AccessRights, certificate: Certificate) => {
      modalNavigation.navigate({
        screen: EidAboutServiceProviderRouteName,
        params: {
          certificate,
          accessRights,
        },
      })
    },
    [modalNavigation],
  )

  const onNFCNotSupported = useCallback(() => {
    modalNavigation.navigate({
      screen: EidNFCNotSupportedRouteName,
    })
  }, [modalNavigation])

  const onClose = useCallback(() => {
    setCancelAlertVisible(true)
  }, [])

  const onError = useCallback((error: ErrorWithCode | SerializedError) => {
    if (error instanceof ErrorWithCode) {
      setVisibleError(error)
    } else {
      setVisibleError(new UnknownError())
    }
  }, [])

  useHandleGestures(onClose)

  return (
    <>
      <EidErrorAlert error={visibleError} />
      <CancelEidFlowAlert visible={cancelAlertVisible} onChange={setCancelAlertVisible} />
      <EidAboutVerificationScreen
        onClose={onClose}
        onError={onError}
        onNext={onNext}
        onNFCNotSupported={onNFCNotSupported}
      />
    </>
  )
}

export const EidAboutVerificationRouteConfig = createRouteConfig({
  name: EidAboutVerificationRouteName,
  component: EidAboutVerificationRoute,
  options: { cardStyle: modalCardStyle },
})
