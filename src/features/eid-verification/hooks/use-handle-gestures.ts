import { useIsFocused, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useEffect } from 'react'
import { EidParamList } from '../../../navigation/eid/types'

/**
 * Handle back and pull down gesture on Modal
 */
export const useHandleGestures = (handleClose: () => void, disableBack: boolean = true) => {
  const isFocused = useIsFocused()
  const navigation = useNavigation<StackNavigationProp<EidParamList>>()

  useEffect(() => {
    if (!isFocused) {
      return
    }

    return navigation.addListener('beforeRemove', e => {
      const { type, source } = e.data.action
      // Whenever you pull down the modal, this event will fire
      // {"type":"POP","source":"Eid-211PKHM5e-pCW4oXPEdTz"}
      if (type === 'POP' && source?.startsWith('Eid-')) {
        // On swipe down show close alert
        e.preventDefault()
        handleClose()
      } else if (disableBack && (type === 'GO_BACK' || type === 'POP')) {
        // Disable going back
        e.preventDefault()
      }
    })
  }, [handleClose, navigation, isFocused, disableBack])
}
