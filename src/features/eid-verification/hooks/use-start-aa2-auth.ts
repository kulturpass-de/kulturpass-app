import { SerializedError } from '@reduxjs/toolkit'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { env } from '../../../env'
import { getCdcSessionData } from '../../../services/auth/store/auth-selectors'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { RootState } from '../../../services/redux/configure-store'
import { useTranslation } from '../../../services/translation/translation'
import { getSimulateCard } from '../redux/simulated-card-selectors'
import { useGetAccountInfoLazyQuery } from '../../../services/user/use-get-account-info-lazy-query'
import {
  AccessRights,
  Certificate,
  WorkflowMessages,
  AA2CommandService,
  AA2WorkflowHelper,
} from '@sap/react-native-ausweisapp2-wrapper'
import { AA2Timeout, isTimeoutError } from '../errors'

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
  const tcTokenUrl = useSelector(
    (state: RootState) => state.persisted.environmentConfiguration.currentEnvironment.eid.tcTokenUrl,
  )

  const sessionData = useSelector(getCdcSessionData)
  const getAccountInfoLazyQuery = useGetAccountInfoLazyQuery()

  const [isLoading, setIsLoading] = useState(false)
  const startAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      const isReaderAvailable = await AA2WorkflowHelper.readerIsAvailable(simulateCard, 'NFC')
      if (!isReaderAvailable) {
        if (simulateCard) {
          return onError(new UnknownError())
        } else {
          return onNFCNotSupported()
        }
      }

      if (sessionData === null) {
        return onError(new UnknownError())
      }

      const { data, error } = await getAccountInfoLazyQuery(sessionData.regToken)

      if (error !== undefined) {
        return onError(error)
      }

      if (data?.id_token === undefined) {
        return onError(new UnknownError())
      }

      const messages: WorkflowMessages = {
        sessionStarted: t('eid_iosScanDialog_sessionStarted'),
        sessionFailed: t('eid_iosScanDialog_sessionFailed'),
        sessionSucceeded: t('eid_iosScanDialog_sessionSucceeded'),
        sessionInProgress: t('eid_iosScanDialog_sessionInProgress'),
      }
      const tokenUrl = `${tcTokenUrl}?idToken=${data.id_token}`
      const accessRights = await AA2CommandService.runAuth(tokenUrl, env.AA2_DEVELOPER_MODE, false, true, messages)
      const certificate = await AA2CommandService.getCertificate()
      onSuccess(accessRights, certificate)
    } catch (e) {
      if (isTimeoutError(e)) {
        onError(new AA2Timeout())
      }
      // Other Error cases are handled by the useHandleErrors hook
    } finally {
      setIsLoading(false)
    }
  }, [simulateCard, sessionData, getAccountInfoLazyQuery, t, onNFCNotSupported, onError, tcTokenUrl, onSuccess])

  return { startAuth, isLoading }
}
