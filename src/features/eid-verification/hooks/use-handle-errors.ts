import { useEffect } from 'react'
import { ErrorWithCode } from '../../../services/errors/errors'
import { aa2Module } from '@jolocom/react-native-ausweis'
import { AuthMessage, Messages } from '@jolocom/react-native-ausweis/js/messageTypes'
import { AA2AuthError, AA2AuthErrorResultError, AA2IDCardConnectionLost, createAA2ErrorFromMessage } from '../errors'
import { useIsFocused } from '@react-navigation/native'

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

    const callback = (authMsg: AuthMessage) => {
      const majorRes = authMsg.result?.major
      if (majorRes?.endsWith('#error') === true) {
        // Handle User Cancellation Errors
        if (authMsg.result?.minor?.endsWith('#cancellationByUser') === true) {
          if (authMsg.result.reason === 'User_Cancelled') {
            return
          } else {
            return onError(new AA2IDCardConnectionLost())
          }
        }

        const detailCodeSplit = authMsg.result?.minor?.split('#')
        const detailCode = detailCodeSplit && detailCodeSplit[detailCodeSplit?.length - 1]
        onError(new AA2AuthErrorResultError(detailCode ?? authMsg.error))
      } else if (authMsg.error !== undefined) {
        onError(new AA2AuthError(authMsg.error))
      }
    }

    aa2Module.messageEmitter.addListener(Messages.auth, callback)

    return () => {
      aa2Module.messageEmitter.removeListener(Messages.auth, callback)
    }
  }, [isFocused, onError])
}
