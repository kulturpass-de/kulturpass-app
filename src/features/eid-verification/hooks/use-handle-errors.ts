import { useEffect } from 'react'
import { ErrorWithCode } from '../../../services/errors/errors'
import {
  AA2AuthError,
  AA2AuthErrorResultError,
  AA2CardRemoved,
  createAA2ErrorFromMessage,
  extractDetailCode,
  isErrorUserCancellation,
} from '../errors'
import { useIsFocused } from '@react-navigation/native'
import { useCloseFlow } from './use-close-flow'
import { AA2Messages, FailureCodes, AA2WorkflowHelper } from '@sap/react-native-ausweisapp2-wrapper'

//TODO: Refactor flow logic in hooks - also consider changes on the native aa2 library

export const useHandleErrors = (
  onError: (error: ErrorWithCode) => void,
  handleUserCancellation: boolean = false,
  cancelEidFlowAlertVisible: boolean = false,
) => {
  const isFocused = useIsFocused()
  const { closeFlow } = useCloseFlow()

  useEffect(() => {
    if (!isFocused) {
      return
    }

    const sub = AA2WorkflowHelper.handleError(msg => {
      if (msg.msg === AA2Messages.Auth) {
        const majorRes = msg.result?.major
        if (majorRes?.endsWith('#error') === true) {
          if (isErrorUserCancellation(msg)) {
            if (handleUserCancellation && !cancelEidFlowAlertVisible) {
              closeFlow()
            }
            return
          }

          if (
            msg.result?.reason === FailureCodes.Card_Removed ||
            msg.result?.reason === FailureCodes.Did_Authenticate_Eac2_Card_Command_Failed
          ) {
            onError(new AA2CardRemoved())
            return
          }

          const detailCode = extractDetailCode(msg)
          onError(new AA2AuthErrorResultError(detailCode, msg.result?.message ?? msg.result?.description))
        } else if (msg.error !== undefined) {
          onError(new AA2AuthError(msg.error))
        }
      } else if (msg.msg === AA2Messages.ChangePin) {
        if (msg.success === false) {
          if (msg.reason === FailureCodes.User_Cancelled) {
            if (handleUserCancellation && !cancelEidFlowAlertVisible) {
              closeFlow()
            }
            return
          }

          onError(new AA2AuthErrorResultError(msg.reason))
        }
      } else {
        const error = createAA2ErrorFromMessage(msg.msg)
        onError(error)
      }
    })

    return () => sub.unsubscribe()
  }, [onError, isFocused, cancelEidFlowAlertVisible, closeFlow, handleUserCancellation])
}
