import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { useCallback } from 'react'
import { EidParamList } from '../../../navigation/eid/types'
import { RootStackParams } from '../../../navigation/types'
import { createRouteConfig } from '../../../navigation/utils/create-route-config'
import { modalCardStyle } from '../../../theme/utils'
import { useHandleGestures } from '../hooks/use-handle-gestures'
import { BankIdSelectBankRouteName } from './bankid-select-bank-route'
import { EidAboutVerificationRouteName } from './eid-about-verification-route'
import { IdentificationSelectionScreen } from './identification-selection-screen'

export const IdentificationSelectionRouteName = 'IdentificationSelection'

export type IdentificationSelectionRouteParams = undefined

export const IdentificationSelectionRoute: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<EidParamList, 'IdentificationSelection'>>()
  const rootNavigation = useNavigation<StackNavigationProp<RootStackParams, 'Tabs'>>()

  const onEidStart = useCallback(() => {
    navigation.replace(EidAboutVerificationRouteName)
  }, [navigation])

  const onBankIdStart = useCallback(() => {
    navigation.replace(BankIdSelectBankRouteName)
  }, [navigation])

  const onClose = useCallback(() => {
    rootNavigation.navigate('Tabs')
  }, [rootNavigation])

  useHandleGestures(onClose)

  return <IdentificationSelectionScreen onClose={onClose} onBankIDStart={onBankIdStart} onEidStart={onEidStart} />
}

export const IdentificationSelectionRouteConfig = createRouteConfig({
  name: IdentificationSelectionRouteName,
  component: IdentificationSelectionRoute,
  options: { cardStyle: modalCardStyle },
})
