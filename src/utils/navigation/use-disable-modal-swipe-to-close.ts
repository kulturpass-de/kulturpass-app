import { useNavigation } from '@react-navigation/native'
import { StackNavigationOptions } from '@react-navigation/stack'
import { useEffect } from 'react'
import { NavigatorIds } from '../../navigation/types'

export const useDisableModalSwipeToClose = () => {
  const navigation = useNavigation()

  useEffect(() => {
    // changing the current navigator will not work, we need to find the root navigator
    // options don't need to be reset, that happens automatically
    const rootNavigator = navigation.getParent(NavigatorIds.ROOT_STACK as any)
    rootNavigator?.setOptions({ gestureEnabled: false } as Partial<StackNavigationOptions>)
  }, [navigation])
}
