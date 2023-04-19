import { useEffect } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { useIsFocused } from '@react-navigation/native'

/**
 * Handle back and pull down gesture on Modal
 */
export const useHandleGestures = (handleClose: () => void, disableBack: boolean = true) => {
  const isFocused = useIsFocused()
  const modalNavigation = useModalNavigation()

  useEffect(() => {
    if (!isFocused) {
      return
    }

    return modalNavigation.addListener('beforeRemove', e => {
      const { type, source } = e.data.action
      if (type === 'POP' && source?.startsWith('Modal')) {
        // On swipe down show close alert
        e.preventDefault()
        handleClose()
      } else if (disableBack && (type === 'GO_BACK' || type === 'POP')) {
        // Disable going back
        e.preventDefault()
      }
    })
  }, [handleClose, modalNavigation, isFocused, disableBack])
}
