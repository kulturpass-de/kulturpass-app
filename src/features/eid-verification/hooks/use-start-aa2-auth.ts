import { AccessRights, Certificate } from '@sap/react-native-ausweisapp2-wrapper'
import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { AppDispatch } from '../../../services/redux/configure-store'
import { eidAusweisApp2Service } from '../services/eid-ausweisapp2-service'
import { EidFlowResponse } from '../types'
import { useWorkflowMessages } from './use-workflow-messages'

/**
 * Hook that returns a callback for starting the AA2 Auth flow.
 * Pass in a callback that will be called on success, error or nfc not supported.
 */
export const useStartAA2Auth = (
  onSuccess: (accessRights: AccessRights, certificate: Certificate) => void,
  onNFCNotSupported: () => void,
  onError: (error: ErrorWithCode) => void,
) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const messages = useWorkflowMessages()

  const startAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await dispatch(eidAusweisApp2Service.startAA2AuthFlow({ messages })).unwrap()
      if (result.response === EidFlowResponse.EidMessageError) {
        // AusweisApp2 Message errors are handled by the useHandleErrors hook
        logger.log('eID start auth failed with message', result.msg.msg)
      } else if (result.response === EidFlowResponse.EidNFCNotSupported) {
        logger.log('eID start auth failed. NFC not supported')
        onNFCNotSupported()
      } else {
        logger.log('eID start auth succeeded.')
        const { accessRights, certificate } = result
        onSuccess(accessRights, certificate)
      }
    } catch (error: unknown) {
      if (error instanceof ErrorWithCode) {
        onError(error)
      } else {
        logger.warn('eID start auth error cannot be interpreted', JSON.stringify(error))
        onError(new UnknownError('eID Start Auth'))
      }
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, messages, onNFCNotSupported, onSuccess, onError])

  return { startAuth, isLoading }
}
