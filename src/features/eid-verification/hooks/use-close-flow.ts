import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useCallback, useState } from 'react'
import { RootStackParams } from '../../../navigation/types'
import { eidAusweisApp2Service } from '../services/eid-ausweisapp2-service'

export const useCloseFlow = (inEidFlow: boolean = true) => {
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation<StackNavigationProp<RootStackParams, 'Tabs'>>()

  const closeFlow = useCallback(async () => {
    if (!inEidFlow) {
      return
    }
    setLoading(true)
    await eidAusweisApp2Service.stopSDK()
    navigation.popTo('Tabs')
    setLoading(false)
  }, [inEidFlow, navigation])

  return { closeFlow, loading }
}
