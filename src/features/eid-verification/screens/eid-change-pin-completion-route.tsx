import { AA2CommandService } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { logger } from '../../../services/logger'
import { modalCardStyle } from '../../../theme/utils'
import { AA2_TIMEOUTS } from '../eid-command-timeouts'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidAboutVerificationRouteName } from './eid-about-verification-route'
import { EidChangePinCompletionScreen } from './eid-change-pin-completion-screen'

export const EidChangePinCompletionRouteName = 'EidChangePinCompletion'

export type EidChangePinCompletionRouteParams = undefined

export const EidChangePinCompletionRoute: React.FC = () => {
  const modalNavigation = useModalNavigation()

  const onNext = useCallback(() => {
    modalNavigation.reset({
      index: 0,
      routes: [
        {
          name: 'Modal',
          state: {
            routes: [{ name: EidAboutVerificationRouteName }],
          },
        },
      ],
    })
  }, [modalNavigation])

  const onClose = useCallback(() => {
    modalNavigation.closeModal()
    try {
      AA2CommandService.stop({ msTimeout: AA2_TIMEOUTS.STOP })
    } catch (e) {
      logger.log(e)
    }
  }, [modalNavigation])

  useHandleGestures(onClose)

  return <EidChangePinCompletionScreen onNext={onNext} onClose={onClose} />
}

export const EidChangePinCompletionRouteConfig = createRouteConfig({
  name: EidChangePinCompletionRouteName,
  component: EidChangePinCompletionRoute,
  options: { cardStyle: modalCardStyle },
})
