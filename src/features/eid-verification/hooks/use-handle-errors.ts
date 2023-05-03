import { useEffect } from 'react'
import { ErrorWithCode } from '../../../services/errors/errors'
import { aa2Module } from '@jolocom/react-native-ausweis'
import { AuthMessage, ChangePinMessage, Messages } from '@jolocom/react-native-ausweis/js/messageTypes'
import { AA2AuthError, AA2AuthErrorResultError, createAA2ErrorFromMessage } from '../errors'
import { useIsFocused } from '@react-navigation/native'
import { FailureCodes } from '@jolocom/react-native-ausweis/js/failure_codes'

const AA2_ERROR_MESSAGES = [Messages.badState, Messages.internalError, Messages.invalid, Messages.unknownCommand]

export const useHandleErrors = (onError: (error: ErrorWithCode) => void) => {
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused) {
      return
    }

    const callbacks: ((result: any) => void)[] = []
    for (const msg of AA2_ERROR_MESSAGES) {
      const cb = () => {
        const error = createAA2ErrorFromMessage(msg)
        onError(error)
      }
      aa2Module.messageEmitter.addListener(msg, cb)
      callbacks.push(cb)
    }
    return () => {
      AA2_ERROR_MESSAGES.forEach((msg, i) => {
        aa2Module.messageEmitter.removeListener(msg, callbacks[i])
      })
    }
  }, [onError, isFocused])

  useEffect(() => {
    if (!isFocused) {
      return
    }

    const authMsgHandler = (authMsg: AuthMessage) => {
      const majorRes = authMsg.result?.major
      if (majorRes?.endsWith('#error') === true) {
        if (
          authMsg.result?.minor?.endsWith('#cancellationByUser') === true &&
          authMsg.result.reason === FailureCodes.User_Cancelled
        ) {
          return
        }

        const reason = authMsg.result?.reason
        const detailCodeSplit = authMsg.result?.minor?.split('#')
        const detailCode = detailCodeSplit && detailCodeSplit[detailCodeSplit?.length - 1]
        onError(
          new AA2AuthErrorResultError(
            reason ?? detailCode ?? authMsg.error,
            authMsg.result?.message ?? authMsg.result?.description,
          ),
        )
      } else if (authMsg.error !== undefined) {
        onError(new AA2AuthError(authMsg.error))
      }
    }

    const changePinMsgHandler = (changePinMsg: ChangePinMessage) => {
      if (changePinMsg.success === false) {
        if (changePinMsg.reason === FailureCodes.User_Cancelled) {
          return
        }

        onError(new AA2AuthErrorResultError(changePinMsg.reason))
      }
    }

    aa2Module.messageEmitter.addListener(Messages.auth, authMsgHandler)
    aa2Module.messageEmitter.addListener(Messages.changePin, changePinMsgHandler)

    return () => {
      aa2Module.messageEmitter.removeListener(Messages.auth, authMsgHandler)
      aa2Module.messageEmitter.removeListener(Messages.changePin, changePinMsgHandler)
    }
  }, [isFocused, onError])
}
