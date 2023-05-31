import React, { useCallback, useEffect } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { commerceApi } from '../../../services/api/commerce-api'
import { modalCardStyle } from '../../../theme/utils'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidVerificationCompletionScreen } from './eid-verification-completion-screen'
import { AA2CommandService } from '@sap/react-native-ausweisapp2-wrapper'

export const EidVerificationCompletionRouteName = 'EidVerificationCompletion'

export type EidVerificationCompletionRouteParams = undefined

export const EidVerificationCompletionRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()
  const [getProfile] = commerceApi.endpoints.getProfile.useLazyQuery()

  useEffect(() => {
    getProfile({ forceUpdate: true }, false)
  }, [getProfile])

  const onNext = useCallback(() => {
    modalNavigation.closeModal()
    try {
      AA2CommandService.stop()
    } catch (e) {
      console.log(e)
    }
  }, [modalNavigation])

  useHandleGestures(onNext)

  return <EidVerificationCompletionScreen onNext={onNext} />
}

export const EidVerificationCompletionRouteConfig = createRouteConfig({
  name: EidVerificationCompletionRouteName,
  component: EidVerificationCompletionRoute,
  options: { cardStyle: modalCardStyle },
})
