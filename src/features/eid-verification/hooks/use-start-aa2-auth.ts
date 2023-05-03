import { aa2Module } from '@jolocom/react-native-ausweis'
import { SerializedError } from '@reduxjs/toolkit'
import { useCallback, useState } from 'react'
import { useSelector } from 'react-redux'
import { env } from '../../../env'
import { getCdcSessionData } from '../../../services/auth/store/auth-selectors'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { RootState } from '../../../services/redux/configure-store'
import { useTranslation } from '../../../services/translation/translation'
import { AccessRightsMessage, CertificateMessage } from '@jolocom/react-native-ausweis/js/messageTypes'
import { getSimulateCard } from '../redux/simulated-card-selectors'
import { useGetAccountInfoLazyQuery } from '../../../services/user/use-get-account-info-lazy-query'

/**
 * Hook that returns a callback for starting the AA2 Auth flow.
 * Pass in a callback that will be called on success, error or nfc not supported.
 */
export const useStartAA2Auth = (
  onSuccess: (accessRights: AccessRightsMessage, certificate: CertificateMessage) => void,
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
      const readerList = await aa2Module.getReaderList()
      if (!simulateCard) {
        if (!readerList.readers.some(reader => reader.name === 'NFC')) {
          return onNFCNotSupported()
        }
      } else if (simulateCard) {
        if (!readerList.readers.some(reader => reader.name === 'Simulator')) {
          return onError(new UnknownError())
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

      const messages = {
        sessionStarted: t('eid_iosScanDialog_sessionStarted'),
        sessionFailed: t('eid_iosScanDialog_sessionFailed'),
        sessionSucceeded: t('eid_iosScanDialog_sessionSucceeded'),
        sessionInProgress: t('eid_iosScanDialog_sessionInProgress'),
      }
      const tokenUrl = `${tcTokenUrl}?idToken=${data.id_token}`
      const accessRights = await aa2Module.startAuth(tokenUrl, env.AA2_DEVELOPER_MODE, false, true, messages)
      const certificate = await aa2Module.getCertificate()
      onSuccess(accessRights, certificate)
    } catch (e) {
      console.log(e)
    } finally {
      setIsLoading(false)
    }
  }, [simulateCard, sessionData, getAccountInfoLazyQuery, t, onNFCNotSupported, onError, tcTokenUrl, onSuccess])

  return { startAuth, isLoading }
}
