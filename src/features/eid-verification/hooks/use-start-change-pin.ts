import { aa2Module } from '@jolocom/react-native-ausweis'
import { useCallback } from 'react'
import { useTranslation } from '../../../services/translation/translation'

/**
 * Hook that returns a callback for starting the AA2 Change PIN flow.
 */
export const useStartAA2ChangePin = () => {
  const { t } = useTranslation()

  const startChangePin = useCallback(async () => {
    const messages = {
      sessionStarted: t('eid_iosScanDialog_sessionStarted'),
      sessionFailed: t('eid_iosScanDialog_sessionFailed'),
      sessionSucceeded: t('eid_iosScanDialog_sessionSucceeded'),
      sessionInProgress: t('eid_iosScanDialog_sessionInProgress'),
    }
    return await aa2Module.startChangePin(false, true, messages)
  }, [t])

  return startChangePin
}
