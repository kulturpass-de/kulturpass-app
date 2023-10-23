import { EventListenerCallback, EventMapCore, NavigationProp } from '@react-navigation/native'
import { useCallback, useEffect } from 'react'

export type UseNavigationOnBeforeRemoveCallback = EventListenerCallback<EventMapCore<any>, 'beforeRemove'>

/**
 * Listen to navigation beforeRemove events, so events like gesture screen navigate back can be caught
 *
 * @param cb Callback to invoke on navigation beforeRemove event
 * @param navigation navigation prop for the related navigator
 * @returns Optional callback to remove the listener again
 */
export const useNavigationOnBeforeRemove = (
  cb: UseNavigationOnBeforeRemoveCallback,
  navigation: NavigationProp<ReactNavigation.RootParamList>,
) => {
  useEffect(() => navigation.addListener('beforeRemove', cb), [navigation, cb])

  const unsubscribeOnBeforeRemoveCallback = useCallback(
    () => navigation.removeListener('beforeRemove', cb),
    [navigation, cb],
  )

  return {
    unsubscribeOnBeforeRemoveCallback,
  }
}
