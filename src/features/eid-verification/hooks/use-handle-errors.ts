import { useIsFocused, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AA2Messages, FailureCodes, AA2WorkflowHelper } from '@sap/react-native-ausweisapp2-wrapper'
import { useEffect } from 'react'
import { EidParamList } from '../../../navigation/eid/types'
import { ErrorWithCode } from '../../../services/errors/errors'
import {
  AA2AuthError,
  AA2AuthErrorResultError,
  AA2CardDeactivated,
  createAA2ErrorFromMessage,
  extractDetailCode,
  isErrorUserCancellation,
  reasonToError,
} from '../errors'
import { EidPukInoperativeRouteName } from '../screens/eid-puk-inoperative-route'
import { useCloseFlow } from './use-close-flow'

//TODO: Refactor flow logic in hooks - also consider changes on the native aa2 library

/**
 * Hook that handles AusweisApp2 SDK message errors.
 * As those can happen at any time in the workflow (even without sending a command),
 * we have to handle them with a always active subscription.
 * @param onError callback for handling an ErrorWithCode in the UI
 * @param handleUserCancellation boolean to indicate if we should handle user cancellation errors.
 * Only used on the card scanning screen, as user cancellation outside of our cancel dialog can only occur there.
 * @param cancelEidFlowAlertVisible boolean indicating if the cancellation dialog is opened.
 * User cancellation errors are ignored if this is true.
 */
export const useHandleErrors = (
  onError: (error: ErrorWithCode) => void,
  handleUserCancellation: boolean = false,
  cancelEidFlowAlertVisible: boolean = false,
) => {
  const isFocused = useIsFocused()
  const navigation = useNavigation<StackNavigationProp<EidParamList>>()
  const { closeFlow } = useCloseFlow()

  useEffect(() => {
    if (!isFocused) {
      return
    }

    const sub = AA2WorkflowHelper.handleError(msg => {
      if (msg.msg === AA2Messages.Auth) {
        /**
         * Auth errors can only happen in the Auth workflow.
         * The Auth Flow failed if we have to handle this message.
         */
        const majorRes = msg.result?.major
        if (majorRes?.endsWith('#error') === true) {
          if (isErrorUserCancellation(msg)) {
            if (handleUserCancellation && !cancelEidFlowAlertVisible) {
              closeFlow()
            }
            return
          }

          const reasonError = reasonToError(msg.result?.reason)

          if (reasonError !== undefined) {
            onError(reasonError)
            return
          }

          if (msg.result?.reason === FailureCodes.Establish_Pace_Channel_Puk_Inoperative) {
            navigation.replace(EidPukInoperativeRouteName)
            return
          }

          const detailCode = extractDetailCode(msg)
          onError(new AA2AuthErrorResultError(detailCode, msg.result?.message ?? msg.result?.description))
        } else if (msg.error !== undefined) {
          onError(new AA2AuthError(msg.error))
        }
      } else if (msg.msg === AA2Messages.ChangePin) {
        /**
         * ChangePin errors can only happen in the ChangePin workflow.
         * The ChangePin Flow failed if we have to handle this message.
         */
        if (msg.success === false) {
          if (msg.reason === FailureCodes.User_Cancelled) {
            if (handleUserCancellation && !cancelEidFlowAlertVisible) {
              closeFlow()
            }
            return
          }

          const reasonError = reasonToError(msg.reason)

          if (reasonError !== undefined) {
            onError(reasonError)
            return
          }

          onError(new AA2AuthErrorResultError(msg.reason))
        }
      } else if (msg.msg === AA2Messages.Reader) {
        /**
         * Reader messages can happen as long as the SDK is started.
         * A deactivated Card was detected if we have to handle this message.
         */
        if (msg.card?.deactivated === true) {
          onError(new AA2CardDeactivated())
        }
      } else {
        /**
         * Handles the following basic errors: BadState, Invalid, UnknownCommand and InternalError.
         */
        const error = createAA2ErrorFromMessage(msg.msg)
        onError(error)
      }
    })

    return () => sub.unsubscribe()
  }, [onError, isFocused, cancelEidFlowAlertVisible, closeFlow, handleUserCancellation, navigation])
}
