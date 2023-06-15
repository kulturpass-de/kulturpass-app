import { useCallback } from 'react'
import { useTranslation } from '../../../services/translation/translation'
import { AA2CommandService } from '@sap/react-native-ausweisapp2-wrapper'
import { AA2_TIMEOUTS } from '../eid-command-timeouts'

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
    return await AA2CommandService.changePin(false, true, messages, { msTimeout: AA2_TIMEOUTS.CHANGE_PIN })
  }, [t])

  return startChangePin
}
