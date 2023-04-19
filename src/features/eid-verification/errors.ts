import { Messages } from '@jolocom/react-native-ausweis/js/messageTypes'
import { ErrorWithCode } from '../../services/errors/errors'

export enum AA2ErrorCode {
  AA2_ERROR = 'AA2_ERROR',
  AA2_AUTH_ERROR_RESULT = 'AA2_AUTH_ERROR_RESULT',
  AA2_AUTH_ERROR = 'AA2_AUTH_ERROR',
  AA2_BAD_STATE = 'AA2_BAD_STATE',
  AA2_INTERNAL_ERROR = 'AA2_INTERNAL_ERROR',
  AA2_INVALID_MESSAGE = 'AA2_INVALID_MESSAGE',
  AA2_UNKNOWN_COMMAND = 'AA2_UNKNOWN_COMMAND',
  AA2_ID_CARD_CONNECTION_LOST = 'AA2_ID_CARD_CONNECTION_LOST',
}

export class AA2Error extends ErrorWithCode {
  type?: string
  constructor(errorCode: AA2ErrorCode = AA2ErrorCode.AA2_ERROR, detailCode?: string) {
    super(errorCode, detailCode)
  }
}

// TODO: Replace messages with real detail texts (TBD as of story implementation)

export class AA2AuthErrorResultError extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_AUTH_ERROR_RESULT, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2AuthError extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_AUTH_ERROR, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2IDCardConnectionLost extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_ID_CARD_CONNECTION_LOST, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2BadState extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_BAD_STATE, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2InternalError extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_INTERNAL_ERROR, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2InvalidMessage extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_INVALID_MESSAGE, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2UnknownCommand extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_UNKNOWN_COMMAND, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export const createAA2ErrorFromMessage = (message: Messages): ErrorWithCode => {
  switch (message) {
    case Messages.badState:
      return new AA2BadState()
    case Messages.internalError:
      return new AA2InternalError()
    case Messages.invalid:
      return new AA2InvalidMessage()
    case Messages.unknownCommand:
      return new AA2UnknownCommand()
    default:
      return new AA2Error()
  }
}
