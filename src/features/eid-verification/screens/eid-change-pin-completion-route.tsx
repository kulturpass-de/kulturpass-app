import { aa2Module } from '@jolocom/react-native-ausweis'
import React, { useCallback } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'

import { createRouteConfig } from '../../../navigation/utils/createRouteConfig'
import { modalCardStyle } from '../../../theme/utils'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidChangePinCompletionScreen } from './eid-change-pin-completion-screen'
import { EidAboutVerificationRouteName } from './eid-about-verification-route'

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
      aa2Module.disconnectAa2Sdk()
    } catch (e) {
      console.log(e)
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
