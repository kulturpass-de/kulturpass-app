import { useCallback, useState } from 'react'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { useCancelFlow } from './use-cancel-flow'

export const useCloseFlow = () => {
  const [loading, setLoading] = useState(false)
  const modalNavigation = useModalNavigation()
  const cancelFlow = useCancelFlow()

  const closeFlow = useCallback(async () => {
    setLoading(true)
    await cancelFlow()
    modalNavigation.closeModal()
    setLoading(false)
  }, [cancelFlow, modalNavigation])

  return { closeFlow, loading }
}
