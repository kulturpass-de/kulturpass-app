import { useEffect } from 'react'
import { ErrorWithCode } from '../../../services/errors/errors'
import {
  AA2AuthError,
  AA2AuthErrorResultError,
  AA2CardDeactivated,
  AA2CardRemoved,
  createAA2ErrorFromMessage,
  extractDetailCode,
  isErrorUserCancellation,
} from '../errors'
import { useIsFocused } from '@react-navigation/native'
import { useCloseFlow } from './use-close-flow'
import { AA2Messages, FailureCodes, AA2WorkflowHelper } from '@sap/react-native-ausweisapp2-wrapper'
import { useModalNavigation } from '../../../navigation/modal/hooks'
import { EidPukInoperativeRouteName } from '../screens/eid-puk-inoperative-route'

//TODO: Refactor flow logic in hooks - also consider changes on the native aa2 library

export const useHandleErrors = (
  onError: (error: ErrorWithCode) => void,
  handleUserCancellation: boolean = false,
  cancelEidFlowAlertVisible: boolean = false,
) => {
  const isFocused = useIsFocused()
  const modalNavigation = useModalNavigation()
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

          if (msg.result?.reason === FailureCodes.Connect_Card_Eid_Inactive) {
            onError(new AA2CardDeactivated())
            return
          }

          if (msg.result?.reason === FailureCodes.Establish_Pace_Channel_Puk_Inoperative) {
            modalNavigation.replace({
              screen: EidPukInoperativeRouteName,
            })
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
      } else if (msg.msg === AA2Messages.Reader) {
        if (msg.card?.deactivated === true) {
          onError(new AA2CardDeactivated())
        }
      } else {
        const error = createAA2ErrorFromMessage(msg.msg)
        onError(error)
      }
    })

    return () => sub.unsubscribe()
  }, [onError, isFocused, cancelEidFlowAlertVisible, closeFlow, handleUserCancellation, modalNavigation])
}
