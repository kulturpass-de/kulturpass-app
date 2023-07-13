import { SerializedError } from '@reduxjs/toolkit'
import {
  AccessRights,
  Certificate,
  WorkflowMessages,
  AA2CommandService,
  AA2WorkflowHelper,
} from '@sap/react-native-ausweisapp2-wrapper'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { env } from '../../../env'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { useTranslation } from '../../../services/translation/translation'
import { AA2_TIMEOUTS } from '../eid-command-timeouts'
import { AA2Timeout, isTimeoutError } from '../errors'
import { getSimulateCard } from '../redux/simulated-card-selectors'
import { useGetTcTokenUrl } from './use-get-tc-token-url'

/**
 * Hook that returns a callback for starting the AA2 Auth flow.
 * Pass in a callback that will be called on success, error or nfc not supported.
 */
export const useStartAA2Auth = (
  onSuccess: (accessRights: AccessRights, certificate: Certificate) => void,
  onNFCNotSupported: () => void,
  onError: (error: ErrorWithCode | SerializedError) => void,
) => {
  const { t } = useTranslation()
  const simulateCard = useSelector(getSimulateCard)
  const getTcTokenUrl = useGetTcTokenUrl()

  const [isLoading, setIsLoading] = useState(false)
  const startAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      // 1. Check if the required Reader is available
      const isReaderAvailable = await AA2WorkflowHelper.readerIsAvailable(
        simulateCard,
        'NFC',
        AA2_TIMEOUTS.GET_READER_LIST,
      )
      if (!isReaderAvailable) {
        if (simulateCard) {
          return onError(new UnknownError())
        } else {
          return onNFCNotSupported()
        }
      }

      // 2. Create the tcTokenUrl pointing to the eID backend.
      const tokenUrl = await getTcTokenUrl()

      // 3. Run the auth workflow in the AusweisApp2 SDK
      const messages: WorkflowMessages = {
        sessionStarted: t('eid_iosScanDialog_sessionStarted'),
        sessionFailed: t('eid_iosScanDialog_sessionFailed'),
        sessionSucceeded: t('eid_iosScanDialog_sessionSucceeded'),
        sessionInProgress: t('eid_iosScanDialog_sessionInProgress'),
      }
      const accessRights = await AA2CommandService.runAuth(tokenUrl, env.AA2_DEVELOPER_MODE, false, true, messages, {
        msTimeout: AA2_TIMEOUTS.RUN_AUTH,
      })

      // 4. Request the Certificate Information from the AusweisApp2 SDK
      const certificate = await AA2CommandService.getCertificate({ msTimeout: AA2_TIMEOUTS.GET_CERTIFICATE })

      onSuccess(accessRights, certificate)
    } catch (e) {
      if (e instanceof ErrorWithCode) {
        onError(e)
      } else if (isTimeoutError(e)) {
        onError(new AA2Timeout())
      }
      // AusweisApp2 Message errors are handled by the useHandleErrors hook
    } finally {
      setIsLoading(false)
    }
  }, [simulateCard, getTcTokenUrl, t, onSuccess, onError, onNFCNotSupported])

  return { startAuth, isLoading }
}
