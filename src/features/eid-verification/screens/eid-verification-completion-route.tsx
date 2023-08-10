import { AA2CommandService } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useCallback } from 'react'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { commerceApi } from '../../../services/api/commerce-api'
import { logger } from '../../../services/logger'
import { modalCardStyle } from '../../../theme/utils'
import { AA2_TIMEOUTS } from '../eid-command-timeouts'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidVerificationCompletionScreen } from './eid-verification-completion-screen'

export const EidVerificationCompletionRouteName = 'EidVerificationCompletion'

export type EidVerificationCompletionRouteParams = undefined

export const EidVerificationCompletionRoute: React.FC = () => {
  const [getProfile] = commerceApi.endpoints.getProfile.useLazyQuery()

  const onNext = useCallback(async () => {
    try {
      await AA2CommandService.stop({ msTimeout: AA2_TIMEOUTS.STOP })

      // 'Eid' stack will disappear from the rendering tree
      // once the identificationStatus changes to something other than "NOT_VERIFIED"
      // So it's not required to navigate to another screen manually
      await getProfile({ forceUpdate: true }, false)
    } catch (error: unknown) {
      logger.log(error)
    }
  }, [getProfile])

  useHandleGestures(onNext)

  return <EidVerificationCompletionScreen onNext={onNext} />
}

export const EidVerificationCompletionRouteConfig = createRouteConfig({
  name: EidVerificationCompletionRouteName,
  component: EidVerificationCompletionRoute,
  options: { cardStyle: modalCardStyle },
})
