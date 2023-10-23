import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AA2CommandService } from '@sap/react-native-ausweisapp2-wrapper'
import React, { useCallback } from 'react'
import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { logger } from '../../../services/logger'
import { modalCardStyle } from '../../../theme/utils'
import { AA2_TIMEOUTS } from '../eid-command-timeouts'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { EidChangePinCompletionScreen } from './eid-change-pin-completion-screen'

export const EidChangePinCompletionRouteName = 'EidChangePinCompletion'

export type EidChangePinCompletionRouteParams = undefined

export const EidChangePinCompletionRoute: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams, 'Tabs'>>()

  const onNext = useCallback(() => {
    navigation.replace('Eid')
  }, [navigation])

  const onClose = useCallback(async () => {
    navigation.navigate('Tabs')
    try {
      await AA2CommandService.stop({ msTimeout: AA2_TIMEOUTS.STOP })
    } catch (e) {
      logger.log(e)
    }
  }, [navigation])

  useHandleGestures(onClose)

  return <EidChangePinCompletionScreen onNext={onNext} onClose={onClose} />
}

export const EidChangePinCompletionRouteConfig = createRouteConfig({
  name: EidChangePinCompletionRouteName,
  component: EidChangePinCompletionRoute,
  options: { cardStyle: modalCardStyle },
})
