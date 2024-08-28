import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { RootStackParams } from '../../../navigation/types'
import { selectBankIdEnabled } from '../../../services/redux/slices/persisted-app-core'
import { EidAboutVerificationRouteName } from '../screens/eid-about-verification-route'
import { IdentificationSelectionRouteName } from '../screens/identification-selection-route'

export const useStartVerification = () => {
  const bankIdEnabled = useSelector(selectBankIdEnabled)
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>()

  const startVerification = useCallback(() => {
    if (bankIdEnabled) {
      navigation.navigate('Eid', { screen: IdentificationSelectionRouteName })
    } else {
      navigation.navigate('Eid', { screen: EidAboutVerificationRouteName })
    }
  }, [bankIdEnabled, navigation])

  return startVerification
}
