import { ErrorWithCode } from '../../services/errors/errors'
import { AA2Messages, Auth, FailureCodes, TimeoutError } from '@sap/react-native-ausweisapp2-wrapper'

export enum AA2ErrorCode {
  AA2_ERROR = 'AA2_ERROR',
  AA2_AUTH_ERROR_RESULT = 'AA2_AUTH_ERROR_RESULT',
  AA2_AUTH_ERROR = 'AA2_AUTH_ERROR',
  AA2_INIT_ERROR = 'AA2_INIT_ERROR',
  AA2_BAD_STATE = 'AA2_BAD_STATE',
  AA2_INTERNAL_ERROR = 'AA2_INTERNAL_ERROR',
  AA2_INVALID_MESSAGE = 'AA2_INVALID_MESSAGE',
  AA2_UNKNOWN_COMMAND = 'AA2_UNKNOWN_COMMAND',
  AA2_BELOW_MIN_YEAR_OF_BIRTH = 'AA2_BELOW_MIN_YEAR_OF_BIRTH',
  AA2_BELOW_MIN_AGE = 'AA2_BELOW_MIN_AGE',
  AA2_FOREIGN_RESIDENCY = 'AA2_FOREIGN_RESIDENCY',
  AA2_PSEUDONYM_ALREADY_IN_USE = 'AA2_PSEUDONYM_ALREADY_IN_USE',
  AA2_CARD_DEACTIVATED = 'AA2_CARD_DEACTIVATED',
  AA2_TIMEOUT = 'AA2_TIMEOUT',
  AA2_ACCEPT_TIMEOUT = 'AA2_ACCEPT_TIMEOUT',
  AA2_CARD_REMOVED = 'AA2_CARD_REMOVED',
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

export class AA2InitError extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_INIT_ERROR, detailCode)
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

/**
 * User is too young to be verified
 */
export class AA2BelowMinYearOfBirth extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_BELOW_MIN_YEAR_OF_BIRTH, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

/**
 * User is too old to be verified
 */
export class AA2BelowMinAge extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_BELOW_MIN_AGE, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2ForeignResidency extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_FOREIGN_RESIDENCY, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}
export class AA2PseudonymAlreadyInUse extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_PSEUDONYM_ALREADY_IN_USE, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2CardDeactivated extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_CARD_DEACTIVATED, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2Timeout extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_TIMEOUT, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2AcceptTimeout extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_ACCEPT_TIMEOUT, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export class AA2CardRemoved extends AA2Error {
  constructor(detailCode?: string, message?: string, type?: string) {
    super(AA2ErrorCode.AA2_CARD_REMOVED, detailCode)
    this.message = message ?? this.message
    this.type = type
  }
}

export const createAA2ErrorFromMessage = (message: AA2Messages): ErrorWithCode => {
  switch (message) {
    case AA2Messages.BadState:
      return new AA2BadState()
    case AA2Messages.InternalError:
      return new AA2InternalError()
    case AA2Messages.Invalid:
      return new AA2InvalidMessage()
    case AA2Messages.UnknownCommand:
      return new AA2UnknownCommand()
    default:
      return new AA2Error()
  }
}

/**
 * Extract a detailed code out of the `Auth` AusweisApp2 SDK Message
 */
export const extractDetailCode = (authMsg: Auth): string | undefined => {
  const reason = authMsg.result?.reason
  if (reason !== undefined) {
    return reason
  }

  const detailCodeSplit = authMsg.result?.minor?.split('#')
  const detailCode = detailCodeSplit && detailCodeSplit[detailCodeSplit?.length]
  if (detailCode !== undefined) {
    return detailCode
  }

  return authMsg.error
}

export const isTimeoutError = (error: unknown): boolean => {
  return error instanceof TimeoutError
}

/**
 * Check if `Auth` AusweisApp2 SDK Message is a user cancellation error
 */
export const isErrorUserCancellation = (authMsg: Auth): boolean => {
  return (
    authMsg.result?.minor?.endsWith('#cancellationByUser') === true &&
    authMsg.result.reason === FailureCodes.User_Cancelled
  )
}

export const extractAuthResultUrlQueryError = (authMsg: Auth): AA2Error | undefined => {
  if (authMsg.url !== undefined) {
    const errorCode: string | undefined = authMsg.url.match(/^.*errorCode=([^&]+).*$/)?.[1]
    if (errorCode !== undefined) {
      switch (errorCode) {
        case 'BELOW_MIN_YEAR_OF_BIRTH':
          return new AA2BelowMinYearOfBirth()
        case 'BELOW_MIN_AGE':
          return new AA2BelowMinAge()
        case 'FOREIGN_RESIDENCY':
          return new AA2ForeignResidency()
        case 'PSEUDONYM_ALREADY_IN_USE':
          return new AA2PseudonymAlreadyInUse()
        default:
          return new AA2AuthError(errorCode)
      }
    }
  }
}
