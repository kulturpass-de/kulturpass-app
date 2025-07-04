import { useIsFocused, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { AA2Messages, AA2WorkflowHelper, isCardDeactivated } from '@sap/react-native-ausweisapp2-wrapper'
import { useEffect } from 'react'
import { EidParamList } from '../../../navigation/eid/types'
import { ErrorWithCode } from '../../../services/errors/errors'
import { AA2CardDeactivated, createAA2ErrorFromMessage, handleAuthError, handleChangePinError } from '../errors'
import { EidPukInoperativeRouteName } from '../screens/eid-puk-inoperative-route'
import { useCloseFlow } from './use-close-flow'

/**
 * Hook that handles AusweisApp2 SDK message errors.
 * As those can happen at any time in the workflow (even without sending a command),
 * we have to handle them with a always active subscription.
 * @param onError callback for handling an ErrorWithCode in the UI
 * @param handleUserCancellation boolean to indicate if we should handle user cancellation errors.
 * Only used on the card scanning screen, as user cancellation outside of our cancel dialog can only occur there.
 * @param cancelEidFlowAlertVisible boolean indicating if the cancellation dialog is opened.
 * User cancellation errors are ignored if this is true.
 * @param inEidFlow boolean indication if this should do anything.
 */
export const useHandleErrors = (
  onError: (error: ErrorWithCode) => void,
  handleUserCancellation: boolean = false,
  cancelEidFlowAlertVisible: boolean = false,
  inEidFlow: boolean = true,
) => {
  const isFocused = useIsFocused()
  const navigation = useNavigation<StackNavigationProp<EidParamList>>()
  const { closeFlow } = useCloseFlow(inEidFlow)

  useEffect(() => {
    if (!isFocused || !inEidFlow) {
      return
    }

    const sub = AA2WorkflowHelper.handleError(message => {
      const shouldCloseOnCancellation = handleUserCancellation && !cancelEidFlowAlertVisible
      try {
        if (message.msg === AA2Messages.Auth) {
          /**
           * Auth errors can only happen in the Auth workflow.
           * The Auth Flow failed if we have to handle this message.
           */
          handleAuthError(message, shouldCloseOnCancellation, closeFlow, () =>
            navigation.replace(EidPukInoperativeRouteName),
          )
        } else if (message.msg === AA2Messages.ChangePin) {
          /**
           * ChangePin errors can only happen in the ChangePin workflow.
           * The ChangePin Flow failed if we have to handle this message.
           */
          handleChangePinError(message, shouldCloseOnCancellation, closeFlow)
        } else if (message.msg === AA2Messages.Reader) {
          /**
           * Reader messages can happen as long as the SDK is started.
           * A deactivated Card was detected if we have to handle this message.
           */
          if (isCardDeactivated(message.card)) {
            throw new AA2CardDeactivated()
          }
        } else {
          /**
           * Handles the following basic errors: BadState, Invalid, UnknownCommand and InternalError.
           */
          throw createAA2ErrorFromMessage(message.msg)
        }
      } catch (error: any) {
        onError(error)
      }
    })

    return () => sub.unsubscribe()
  }, [onError, isFocused, cancelEidFlowAlertVisible, closeFlow, handleUserCancellation, navigation, inEidFlow])
}
