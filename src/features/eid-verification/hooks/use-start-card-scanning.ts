import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ErrorWithCode, UnknownError } from '../../../services/errors/errors'
import { logger } from '../../../services/logger'
import { AppDispatch } from '../../../services/redux/configure-store'
import { eidAusweisApp2Service } from '../services/eid-ausweisapp2-service'
import { EidFlowResponse, Flow } from '../types'
import { useWorkflowMessages } from './use-workflow-messages'

type StartCardScanningParams = {
  flow: Flow
  onPinRetry: (retryCounter?: number) => void
  onCanRetry: (canRetry: boolean) => void
  onPukRetry: (pukRetry: boolean) => void
  pin?: string
  newPin?: string
  can?: string
  puk?: string
  onAuthSuccess: () => void
  onChangePinSuccess: () => void
  onError: (error: ErrorWithCode) => void
}

/**
 * Returns function to handle the complete scanning process and its edge cases.
 */
export const useStartCardScanning = ({
  flow,
  pin,
  can,
  puk,
  newPin,
  onPinRetry,
  onCanRetry,
  onPukRetry,
  onAuthSuccess,
  onChangePinSuccess,
  onError,
}: StartCardScanningParams) => {
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const messages = useWorkflowMessages()

  const startScanning = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await dispatch(
        eidAusweisApp2Service.startScanning({
          flow,
          userInput: {
            pin,
            newPin,
            can,
            puk,
          },
          messages,
        }),
      ).unwrap()

      switch (result.response) {
        case EidFlowResponse.RetryPin:
          onPinRetry(result.retryCounter)
          break
        case EidFlowResponse.RetryCan:
          onCanRetry(result.retry)
          break
        case EidFlowResponse.RetryPuk:
          onPukRetry(result.retry)
          break
        case EidFlowResponse.EidAuthSuccess:
          onAuthSuccess()
          break
        case EidFlowResponse.EidChangePinSuccess:
          onChangePinSuccess()
          break
        case EidFlowResponse.EidMessageError:
          // AusweisApp2 Message errors are handled by the useHandleErrors hook
          logger.log('eID scan failed with message', result.msg.msg)
          break
      }
    } catch (error: unknown) {
      if (error instanceof ErrorWithCode) {
        onError(error)
      } else {
        logger.warn('eID scan error cannot be interpreted', JSON.stringify(error))
        onError(new UnknownError('eID Scan'))
      }
    } finally {
      setIsLoading(false)
    }
  }, [
    can,
    dispatch,
    flow,
    messages,
    newPin,
    onAuthSuccess,
    onCanRetry,
    onChangePinSuccess,
    onError,
    onPinRetry,
    onPukRetry,
    pin,
    puk,
  ])

  return { startScanning, isLoading }
}
