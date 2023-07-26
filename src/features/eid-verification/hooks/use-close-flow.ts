import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback, useState } from 'react'
import { RootStackParams } from '../../../navigation/types'
import { useCancelFlow } from './use-cancel-flow'

export const useCloseFlow = () => {
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<StackNavigationProp<RootStackParams, 'Tabs'>>()
  const cancelFlow = useCancelFlow()

  const closeFlow = useCallback(async () => {
    setLoading(true)
    await cancelFlow()
    navigation.navigate('Tabs')
    setLoading(false)
  }, [cancelFlow, navigation])

  return { closeFlow, loading }
}
